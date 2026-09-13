/* Anadir, quitar, y cambiar la bandera de un idioma.
   No toca la pantalla, asi se puede probar por separado. Cada operacion
   se guarda en el repositorio como un solo cambio, con todos los ficheros
   a la vez, para que la web nunca quede a medias. */

(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabrica();
  else raiz.LogicaIdiomas = fabrica();
})(this, function () {
  'use strict';

  var BASE = 'es';
  var LANGS = 'content/languages.json';
  var CONFIG = 'admin/config.yml';
  function rutaSitio(code) { return 'content/site.' + code + '.json'; }

  /* ---------- errores con significado ---------- */
  function fallo(tipo, mensaje) { var e = new Error(mensaje); e.tipo = tipo; return e; }

  /* ---------- transformaciones puras ---------- */
  function aJSON(o) { return JSON.stringify(o, null, 2) + '\n'; }

  function reemplazarLocales(yaml, codigos) {
    var n = 0;
    var salida = yaml.replace(/^(\s*locales:\s*)\[[^\]]*\]/gm, function (_, pre) {
      n++;
      return pre + '[' + codigos.join(', ') + ']';
    });
    if (n === 0) throw fallo('config', 'No se encuentra la lista de idiomas en admin/config.yml');
    return salida;
  }

  function entrada(idioma, flag) {
    var e = { code: idioma.code, name: idioma.name, flag: flag || idioma.flags[0],
              direction: idioma.direction };
    if (idioma.script && idioma.script !== 'latin') e.script = idioma.script;
    return e;
  }

  function planAnadir(estado, idioma, flag) {
    if (estado.languages.some(function (l) { return l.code === idioma.code; })) {
      throw fallo('duplicado', 'Ese idioma ya está en la web');
    }
    var languages = estado.languages.concat([entrada(idioma, flag)]);
    var cambios = [
      { path: LANGS, content: aJSON(languages) },
      { path: CONFIG, content: reemplazarLocales(estado.config, languages.map(function (l) { return l.code; })) }
    ];
    /* si ya habia textos guardados de ese idioma, de una vez anterior, se
       respetan en lugar de pisarlos con la copia en espanol */
    var conservado = estado.existente !== null;
    if (!conservado) {
      var copia = JSON.parse(JSON.stringify(estado.base));
      copia.meta = copia.meta || {};
      copia.meta.language = idioma.name;
      copia.meta.direction = idioma.direction;
      cambios.push({ path: rutaSitio(idioma.code), content: aJSON(copia) });
    }
    return { cambios: cambios, conservado: conservado,
             mensaje: 'idiomas: añade ' + idioma.nameEs.toLowerCase() };
  }

  function planEliminar(estado, code, nameEs) {
    if (code === BASE) throw fallo('base', 'El español es el idioma base y no se puede quitar');
    var languages = estado.languages.filter(function (l) { return l.code !== code; });
    if (languages.length === estado.languages.length) throw fallo('inexistente', 'Ese idioma no está en la web');
    var cambios = [
      { path: LANGS, content: aJSON(languages) },
      { path: CONFIG, content: reemplazarLocales(estado.config, languages.map(function (l) { return l.code; })) }
    ];
    if (estado.existente !== null) cambios.push({ path: rutaSitio(code), borrar: true });
    return { cambios: cambios, mensaje: 'idiomas: quita ' + (nameEs || code).toLowerCase() };
  }

  function planBandera(estado, code, flag, nameEs) {
    var tocado = false;
    var languages = estado.languages.map(function (l) {
      if (l.code !== code) return l;
      tocado = true;
      var c = JSON.parse(JSON.stringify(l)); c.flag = flag; return c;
    });
    if (!tocado) throw fallo('inexistente', 'Ese idioma no está en la web');
    return { cambios: [{ path: LANGS, content: aJSON(languages) }],
             mensaje: 'idiomas: cambia la bandera del ' + (nameEs || code).toLowerCase() };
  }

  /* ---------- acceso al repositorio ---------- */
  function base64Utf8(b64) {
    var bin = atob(String(b64).replace(/\s/g, ''));
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder('utf-8').decode(bytes);
  }

  function crearCliente(opts) {
    var hacer = opts.fetch || fetch;
    var R = '/repos/' + opts.repo;

    function api(metodo, ruta, cuerpo) {
      return hacer('https://api.github.com' + ruta, {
        method: metodo,
        headers: {
          Authorization: 'Bearer ' + opts.token,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json'
        },
        body: cuerpo ? JSON.stringify(cuerpo) : undefined
      }).then(function (r) {
        if (r.status === 404) return null;
        return r.json().catch(function () { return {}; }).then(function (datos) {
          if (r.ok) return datos;
          if (r.status === 401) throw fallo('sesion', 'La sesión ha caducado');
          if (r.status === 403) throw fallo('permiso', 'Sin permiso sobre el repositorio');
          if (r.status === 409 || r.status === 422) throw fallo('conflicto', datos.message || 'Conflicto');
          throw fallo('red', (datos && datos.message) || ('Error ' + r.status));
        });
      });
    }

    return {
      permisos: function () {
        return api('GET', R).then(function (d) { return !!(d && d.permissions && d.permissions.push); });
      },
      refActual: function () {
        return api('GET', R + '/git/ref/heads/' + opts.rama).then(function (d) {
          if (!d) throw fallo('red', 'No se encuentra la rama ' + opts.rama);
          return d.object.sha;
        });
      },
      leer: function (ruta, ref) {
        return api('GET', R + '/contents/' + encodeURI(ruta) + '?ref=' + ref).then(function (d) {
          return d ? base64Utf8(d.content) : null;
        });
      },
      commit: function (padre, cambios, mensaje) {
        return api('GET', R + '/git/commits/' + padre).then(function (c) {
          return api('POST', R + '/git/trees', {
            base_tree: c.tree.sha,
            tree: cambios.map(function (x) {
              return x.borrar
                ? { path: x.path, mode: '100644', type: 'blob', sha: null }
                : { path: x.path, mode: '100644', type: 'blob', content: x.content };
            })
          });
        }).then(function (arbol) {
          return api('POST', R + '/git/commits', { message: mensaje, tree: arbol.sha, parents: [padre] });
        }).then(function (nuevo) {
          /* sin forzar: si alguien guardo entre medias, esto falla en vez de pisarlo */
          return api('PATCH', R + '/git/refs/heads/' + opts.rama, { sha: nuevo.sha, force: false })
            .then(function () { return nuevo.sha; });
        });
      }
    };
  }

  /* ---------- operaciones completas ---------- */
  function cargarEstado(cliente, code) {
    return cliente.refActual().then(function (sha) {
      return Promise.all([
        cliente.leer(LANGS, sha),
        cliente.leer(CONFIG, sha),
        cliente.leer(rutaSitio(BASE), sha),
        code ? cliente.leer(rutaSitio(code), sha) : Promise.resolve(null)
      ]).then(function (r) {
        if (!r[0] || !r[1] || !r[2]) throw fallo('red', 'Faltan ficheros básicos en el repositorio');
        return { sha: sha, languages: JSON.parse(r[0]), config: r[1],
                 base: JSON.parse(r[2]), existente: r[3] === null ? null : r[3] };
      });
    });
  }

  function listar(cliente) {
    return cargarEstado(cliente).then(function (e) { return e.languages; });
  }
  function anadir(cliente, idioma, flag) {
    return cargarEstado(cliente, idioma.code).then(function (e) {
      var plan = planAnadir(e, idioma, flag);
      return cliente.commit(e.sha, plan.cambios, plan.mensaje).then(function () { return plan; });
    });
  }
  function eliminar(cliente, code, nameEs) {
    return cargarEstado(cliente, code).then(function (e) {
      var plan = planEliminar(e, code, nameEs);
      return cliente.commit(e.sha, plan.cambios, plan.mensaje).then(function () { return plan; });
    });
  }
  function cambiarBandera(cliente, code, flag, nameEs) {
    return cargarEstado(cliente).then(function (e) {
      var plan = planBandera(e, code, flag, nameEs);
      return cliente.commit(e.sha, plan.cambios, plan.mensaje).then(function () { return plan; });
    });
  }

  return {
    BASE: BASE,
    reemplazarLocales: reemplazarLocales, planAnadir: planAnadir,
    planEliminar: planEliminar, planBandera: planBandera,
    crearCliente: crearCliente,
    listar: listar, anadir: anadir, eliminar: eliminar, cambiarBandera: cambiarBandera
  };
});
