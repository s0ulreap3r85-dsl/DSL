/* Prueba la gestion de idiomas contra un GitHub simulado en memoria,
   usando los ficheros reales del repositorio como punto de partida.
   Uso:  node tools/test-idiomas.js */
'use strict';
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const raiz = path.join(__dirname, '..');
const L = require(path.join(raiz, 'admin/idiomas/logica.js'));
const catalogo = require(path.join(raiz, 'admin/idiomas/catalogo.js'));
const idioma = (c) => catalogo.find((x) => x.code === c);

/* ---------- un repositorio falso ---------- */
function repoFalso(ficheros) {
  let n = 0; const id = () => 'sha' + (++n);
  const trees = {}; const commits = {};
  const t0 = id(); trees[t0] = Object.assign({}, ficheros);
  const c0 = id(); commits[c0] = { tree: t0 };
  const estado = { ref: c0, llamadas: [], fallarPatch: null, status401: false };

  async function fetchFalso(url, init) {
    const metodo = init.method; const ruta = url.replace('https://api.github.com/repos/o/r', '');
    const cuerpo = init.body ? JSON.parse(init.body) : null;
    estado.llamadas.push(metodo + ' ' + ruta.split('?')[0]);
    const r = (status, datos) => ({ ok: status < 300, status, json: async () => datos });
    if (estado.status401) return r(401, { message: 'Bad credentials' });

    if (metodo === 'GET' && ruta === '') return r(200, { permissions: { push: true } });
    if (metodo === 'GET' && ruta === '/git/ref/heads/main') return r(200, { object: { sha: estado.ref } });
    if (metodo === 'GET' && ruta.startsWith('/contents/')) {
      const [p, q] = ruta.slice('/contents/'.length).split('?ref=');
      const arbol = trees[commits[q].tree]; const txt = arbol[decodeURI(p)];
      if (txt === undefined) return r(404, {});
      return r(200, { content: Buffer.from(txt, 'utf8').toString('base64') });
    }
    if (metodo === 'GET' && ruta.startsWith('/git/commits/')) return r(200, { tree: { sha: commits[ruta.split('/').pop()].tree } });
    if (metodo === 'POST' && ruta === '/git/trees') {
      const nuevo = Object.assign({}, trees[cuerpo.base_tree]);
      for (const e of cuerpo.tree) {
        if (e.sha === null) { if (!(e.path in nuevo)) return r(422, { message: 'borrar algo que no existe' }); delete nuevo[e.path]; }
        else nuevo[e.path] = e.content;
      }
      const s = id(); trees[s] = nuevo; return r(201, { sha: s });
    }
    if (metodo === 'POST' && ruta === '/git/commits') { const s = id(); commits[s] = { tree: cuerpo.tree, parent: cuerpo.parents[0], message: cuerpo.message }; return r(201, { sha: s }); }
    if (metodo === 'PATCH' && ruta === '/git/refs/heads/main') {
      assert.strictEqual(cuerpo.force, false, 'nunca debe forzar');
      if (estado.fallarPatch) return r(422, { message: estado.fallarPatch });
      if (commits[cuerpo.sha].parent !== estado.ref) return r(422, { message: 'Update is not a fast forward' });
      estado.ref = cuerpo.sha; return r(200, {});
    }
    throw new Error('llamada inesperada ' + metodo + ' ' + ruta);
  }
  estado.fetch = fetchFalso;
  estado.fichero = (p) => trees[commits[estado.ref].tree][p];
  estado.existe = (p) => p in trees[commits[estado.ref].tree];
  estado.mensaje = () => commits[estado.ref].message;
  return estado;
}

const leer = (p) => fs.readFileSync(path.join(raiz, p), 'utf8');
const inicial = {};
for (const p of ['content/languages.json', 'admin/config.yml']) inicial[p] = leer(p);
for (const l of JSON.parse(leer('content/languages.json'))) inicial['content/site.' + l.code + '.json'] = leer('content/site.' + l.code + '.json');

let ok = 0; const prueba = async (nombre, fn) => { await fn(); ok++; console.log('  bien  ' + nombre); };

(async () => {
  console.log('Gestion de idiomas');

  await prueba('añadir turco copia todo desde el español', async () => {
    const g = repoFalso(inicial);
    const cli = L.crearCliente({ fetch: g.fetch, token: 't', repo: 'o/r', rama: 'main' });
    const plan = await L.anadir(cli, idioma('tr'));
    assert.strictEqual(plan.conservado, false);
    const es = JSON.parse(g.fichero('content/site.es.json'));
    const tr = JSON.parse(g.fichero('content/site.tr.json'));
    assert.strictEqual(tr.meta.language, 'Türkçe');
    assert.strictEqual(tr.meta.direction, 'ltr');
    assert.deepStrictEqual(tr.pages, es.pages, 'las secciones se copian enteras');
    assert.deepStrictEqual(tr.home, es.home);
    const langs = JSON.parse(g.fichero('content/languages.json'));
    assert.deepStrictEqual(langs.map((l) => l.code), ['es', 'en', 'fr', 'de', 'ar', 'tr']);
    assert.strictEqual(langs[5].flag, '🇹🇷');
    const locales = g.fichero('admin/config.yml').match(/locales: \[[^\]]*\]/g);
    assert.deepStrictEqual(locales, ['locales: [es, en, fr, de, ar, tr]', 'locales: [es, en, fr, de, ar, tr]']);
    assert.strictEqual(g.mensaje(), 'idiomas: añade turco');
  });

  await prueba('añadir griego guarda su tipo de escritura y la bandera elegida', async () => {
    const g = repoFalso(inicial);
    const cli = L.crearCliente({ fetch: g.fetch, token: 't', repo: 'o/r', rama: 'main' });
    await L.anadir(cli, idioma('el'), '🇨🇾');
    const e = JSON.parse(g.fichero('content/languages.json')).pop();
    assert.deepStrictEqual(e, { code: 'el', name: 'Ελληνικά', flag: '🇨🇾', direction: 'ltr', script: 'greek' });
  });

  await prueba('añadir hebreo sale de derecha a izquierda', async () => {
    const g = repoFalso(inicial);
    const cli = L.crearCliente({ fetch: g.fetch, token: 't', repo: 'o/r', rama: 'main' });
    await L.anadir(cli, idioma('he'));
    assert.strictEqual(JSON.parse(g.fichero('content/site.he.json')).meta.direction, 'rtl');
  });

  await prueba('todo se guarda en un solo cambio', async () => {
    const g = repoFalso(inicial);
    const cli = L.crearCliente({ fetch: g.fetch, token: 't', repo: 'o/r', rama: 'main' });
    await L.anadir(cli, idioma('tr'));
    assert.strictEqual(g.llamadas.filter((x) => x.startsWith('PATCH')).length, 1);
    assert.strictEqual(g.llamadas.filter((x) => x === 'POST /git/commits').length, 1);
  });

  await prueba('no deja añadir un idioma repetido', async () => {
    const g = repoFalso(inicial);
    const cli = L.crearCliente({ fetch: g.fetch, token: 't', repo: 'o/r', rama: 'main' });
    await assert.rejects(L.anadir(cli, idioma('fr')), (e) => e.tipo === 'duplicado');
    assert.ok(!g.llamadas.some((x) => x.startsWith('PATCH')), 'no escribe nada');
  });

  await prueba('si ya habia textos de ese idioma, se conservan', async () => {
    const previo = Object.assign({}, inicial, { 'content/site.tr.json': '{"meta":{"language":"Türkçe"},"traducido":true}\n' });
    const g = repoFalso(previo);
    const cli = L.crearCliente({ fetch: g.fetch, token: 't', repo: 'o/r', rama: 'main' });
    const plan = await L.anadir(cli, idioma('tr'));
    assert.strictEqual(plan.conservado, true);
    assert.strictEqual(JSON.parse(g.fichero('content/site.tr.json')).traducido, true);
  });

  await prueba('quitar francés borra sus textos y lo saca de todas partes', async () => {
    const g = repoFalso(inicial);
    const cli = L.crearCliente({ fetch: g.fetch, token: 't', repo: 'o/r', rama: 'main' });
    await L.eliminar(cli, 'fr', 'Francés');
    assert.strictEqual(g.existe('content/site.fr.json'), false);
    assert.deepStrictEqual(JSON.parse(g.fichero('content/languages.json')).map((l) => l.code), ['es', 'en', 'de', 'ar']);
    assert.strictEqual((g.fichero('admin/config.yml').match(/locales: \[es, en, de, ar\]/g) || []).length, 2);
    assert.strictEqual(g.mensaje(), 'idiomas: quita francés');
    assert.ok(g.existe('content/site.es.json') && g.existe('content/site.ar.json'), 'no toca los demás');
  });

  await prueba('el español no se puede quitar', async () => {
    const g = repoFalso(inicial);
    const cli = L.crearCliente({ fetch: g.fetch, token: 't', repo: 'o/r', rama: 'main' });
    await assert.rejects(L.eliminar(cli, 'es', 'Español'), (e) => e.tipo === 'base');
    assert.ok(g.existe('content/site.es.json'));
  });

  await prueba('añadir y luego quitar deja el repositorio como estaba', async () => {
    const g = repoFalso(inicial);
    const cli = L.crearCliente({ fetch: g.fetch, token: 't', repo: 'o/r', rama: 'main' });
    await L.anadir(cli, idioma('ru'));
    await L.eliminar(cli, 'ru', 'Ruso');
    for (const p of Object.keys(inicial)) {
      if (p.endsWith('.json')) assert.deepStrictEqual(JSON.parse(g.fichero(p)), JSON.parse(inicial[p]), 'cambió ' + p);
      else assert.strictEqual(g.fichero(p), inicial[p], 'cambió ' + p);
    }
    assert.strictEqual(g.existe('content/site.ru.json'), false);
  });

  await prueba('cambiar la bandera solo toca la lista de idiomas', async () => {
    const g = repoFalso(inicial);
    const cli = L.crearCliente({ fetch: g.fetch, token: 't', repo: 'o/r', rama: 'main' });
    await L.cambiarBandera(cli, 'ar', '🇲🇦', 'Árabe');
    assert.strictEqual(JSON.parse(g.fichero('content/languages.json')).find((l) => l.code === 'ar').flag, '🇲🇦');
    assert.strictEqual(g.fichero('admin/config.yml'), inicial['admin/config.yml']);
  });

  await prueba('si alguien guarda entre medias, falla sin pisar nada', async () => {
    const g = repoFalso(inicial);
    const cli = L.crearCliente({ fetch: g.fetch, token: 't', repo: 'o/r', rama: 'main' });
    g.fallarPatch = 'Update is not a fast forward';
    const antes = g.ref;
    await assert.rejects(L.anadir(cli, idioma('tr')), (e) => e.tipo === 'conflicto');
    assert.strictEqual(g.ref, antes);
  });

  await prueba('sesión caducada se reconoce', async () => {
    const g = repoFalso(inicial); g.status401 = true;
    const cli = L.crearCliente({ fetch: g.fetch, token: 't', repo: 'o/r', rama: 'main' });
    await assert.rejects(L.listar(cli), (e) => e.tipo === 'sesion');
  });

  await prueba('la configuración real del panel tiene las dos listas de idiomas', async () => {
    const salida = L.reemplazarLocales(inicial['admin/config.yml'], ['es', 'xx']);
    assert.strictEqual((salida.match(/locales: \[es, xx\]/g) || []).length, 2);
  });

  console.log('\n' + ok + ' pruebas correctas');
})().catch((e) => { console.error('\n  FALLO  ' + e.message); process.exit(1); });
