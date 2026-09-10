/**
 * Sirve la web del clan y hace de intermediario para entrar al panel.
 *
 * Casi todas las peticiones son ficheros de la web y se responden desde
 * ASSETS. Solo /auth y /callback llevan logica, y sirven para que nadie
 * tenga que escribir contrasenas dentro de la web.
 *
 * Necesita dos variables de entorno, que se ponen en el panel de Cloudflare:
 *   GITHUB_CLIENT_ID      el identificador de la aplicacion de GitHub
 *   GITHUB_CLIENT_SECRET  su clave, marcada como secreta
 *
 * Y una variable opcional:
 *   ORIGENES  lista de direcciones separadas por coma que pueden usarlo.
 *             Por ejemplo: https://dsl-770.pages.dev,https://s0ulreap3r85-dsl.github.io
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/auth') return iniciar(url, env);
    if (url.pathname === '/callback') return volver(request, url, env);

    // todo lo demas es la web
    return env.ASSETS.fetch(request);
  },
};

/* Paso 1: mandar al usuario a GitHub para que autorice. */
function iniciar(url, env) {
  if (!env.GITHUB_CLIENT_ID) return falta('GITHUB_CLIENT_ID');
  const estado = crypto.randomUUID();
  const destino = new URL('https://github.com/login/oauth/authorize');
  destino.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  destino.searchParams.set('scope', url.searchParams.get('scope') || 'repo,user');
  destino.searchParams.set('state', estado);
  destino.searchParams.set('redirect_uri', `${url.origin}/callback`);

  return new Response(null, {
    status: 302,
    headers: {
      Location: destino.toString(),
      'Set-Cookie': `estado=${estado}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
    },
  });
}

/* Paso 2: GitHub nos devuelve un codigo, lo cambiamos por una llave. */
async function volver(request, url, env) {
  if (!env.GITHUB_CLIENT_ID) return falta('GITHUB_CLIENT_ID');
  if (!env.GITHUB_CLIENT_SECRET) return falta('GITHUB_CLIENT_SECRET');
  const codigo = url.searchParams.get('code');
  const estado = url.searchParams.get('state');
  const guardado = (request.headers.get('cookie') || '').match(/estado=([^;]+)/);

  if (!codigo) return responder({ error: 'Falta el código de GitHub' }, url, env);
  if (guardado && estado && guardado[1] !== estado) {
    return responder({ error: 'El estado no coincide' }, url, env);
  }

  const r = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code: codigo,
    }),
  });

  const datos = await r.json();
  if (datos.error || !datos.access_token) {
    return responder({ error: datos.error_description || 'GitHub no ha dado la llave' }, url, env);
  }
  return responder({ token: datos.access_token, provider: 'github' }, url, env);
}

/* Aviso claro cuando falta una credencial, en vez de mandar a GitHub
   una peticion incompleta que solo devuelve un 404 sin explicacion. */
function falta(nombre) {
  const html = `<!doctype html><meta charset="utf-8"><title>Falta configurar el acceso</title>
<body style="font-family:system-ui;background:#080B10;color:#E6EDF5;padding:40px;line-height:1.6">
<h1 style="color:#FF5A1F">Falta ${nombre}</h1>
<p>El panel de edicion no puede entrar porque esta variable no esta configurada en Cloudflare.</p>
<p>Se arregla en el panel de Cloudflare, dentro del proyecto <b>dsl</b>, en Settings, en el apartado de variables.
El identificador va como texto normal y la clave como secreto.</p>
<p style="color:#8A9AAE">Despues de guardarla hay que volver a desplegar para que surta efecto.</p>`;
  return new Response(html, { status: 500, headers: { 'content-type': 'text/html; charset=utf-8' } });
}

/* Devuelve el resultado a la ventana del panel y se cierra. */
function responder(datos, url, env) {
  const ok = !datos.error;
  const mensaje = `authorization:github:${ok ? 'success' : 'error'}:${JSON.stringify(datos)}`;
  const permitidos = (env.ORIGENES || '*').split(',').map((s) => s.trim());

  const html = `<!doctype html><meta charset="utf-8"><title>Acceso</title>
<body style="font-family:system-ui;background:#0b0f14;color:#e6edf5;padding:40px">
<p>${ok ? 'Listo, ya puedes cerrar esta ventana.' : 'No se ha podido entrar.'}</p>
<script>
(function () {
  var mensaje = ${JSON.stringify(mensaje)};
  var permitidos = ${JSON.stringify(permitidos)};
  function enviar(e) {
    if (!window.opener) return;
    permitidos.forEach(function (o) { window.opener.postMessage(mensaje, o); });
  }
  window.addEventListener('message', enviar, false);
  enviar();
  setTimeout(function () { window.close(); }, 1200);
})();
</script>`;

  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
}
