/* Parte comun a todos los disenos: carga los contenidos, gestiona el idioma,
   y lleva el contador de la guerra. Cada diseno solo aporta su render. */

window.DSL = (function () {
  'use strict';

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'class') n.className = attrs[k];
      else if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  /* proxima guerra, viernes a las 21:00 */
  function nextWar() {
    var n = new Date();
    var t = new Date(n.getFullYear(), n.getMonth(), n.getDate(), 21, 0, 0, 0);
    t.setDate(t.getDate() + ((5 - t.getDay() + 7) % 7));
    if (t <= n) t.setDate(t.getDate() + 7);
    return t;
  }

  var cdNode = null, cdSuffix = 'd', target = nextWar();
  function pad(v) { return String(v).padStart(2, '0'); }
  function tick() {
    if (!cdNode || !cdNode.isConnected) return;
    var ms = target - new Date();
    if (ms <= 0) { target = nextWar(); ms = target - new Date(); }
    var s = Math.floor(ms / 1000);
    cdNode.textContent = Math.floor(s / 86400) + cdSuffix + ' ' +
      pad(Math.floor(s % 86400 / 3600)) + ':' + pad(Math.floor(s % 3600 / 60)) + ':' + pad(s % 60);
  }
  setInterval(tick, 1000);

  function countdown(node, suffix) {
    cdNode = node; cdSuffix = suffix || 'd'; tick(); return node;
  }

  function fetchJSON(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(url + ' ' + r.status);
      return r.json();
    });
  }

  /* arranque. render recibe (contenido, contexto) */
  function init(render) {
    var base = window.CONTENT_BASE || 'content/';
    var packed = document.getElementById('bundled-content');
    var bundle = packed ? JSON.parse(packed.textContent) : null;
    var root = document.documentElement;

    var getLangs = bundle ? Promise.resolve(bundle.languages)
                          : fetchJSON(base + 'languages.json');
    var getContent = function (code) {
      return bundle ? Promise.resolve(bundle.content[code])
                    : fetchJSON(base + 'site.' + code + '.json');
    };

    return getLangs.then(function (langs) {
      var codes = langs.map(function (l) { return l.code; });
      var saved = load('dsl770.lang');
      var guess = (navigator.language || '').slice(0, 2).toLowerCase();
      var current = codes.indexOf(saved) >= 0 ? saved
                  : codes.indexOf(guess) >= 0 ? guess : codes[0];

      var ctx = {
        languages: langs,
        get current() { return current; },
        setLang: function (code) {
          current = code;
          store('dsl770.lang', code);
          root.setAttribute('lang', code);
          return getContent(code).then(function (d) {
            root.setAttribute('dir', d.meta.direction || 'ltr');
            render(d, ctx);
          });
        }
      };

      root.setAttribute('lang', current);
      return getContent(current).then(function (d) {
        root.setAttribute('dir', d.meta.direction || 'ltr');
        render(d, ctx);
      });
    }).catch(function (e) {
      document.body.appendChild(el('p', {
        style: 'padding:40px;font-family:system-ui;color:#888',
        text: 'No se ha podido cargar el contenido. Recarga la página.'
      }));
      if (window.console) console.error(e);
    });
  }

  /* selector de idioma listo para usar, cada diseno lo coloca donde quiera */
  function langSelect(ctx, className) {
    var s = el('select', { class: className || '', 'aria-label': 'Idioma' });
    ctx.languages.forEach(function (l) {
      s.appendChild(el('option', { value: l.code, text: l.name }));
    });
    s.value = ctx.current;
    s.addEventListener('change', function () { ctx.setLang(s.value); });
    return s;
  }

  return { el: el, init: init, countdown: countdown, langSelect: langSelect,
           store: store, load: load };
})();
