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
