/* Nucleo comun a los cinco disenos. Carga los contenidos, detecta el idioma,
   pinta la portada y las paginas, y lleva el contador de la guerra.
   Cada diseno solo aporta su hoja de estilos. */

window.DSL = (function () {
  'use strict';

  var DATA = null, MEDIA = null, TARJETAS = null, CTX = null;

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
  function assets() { return window.ASSET_BASE || ''; }

  /* ---------- imagenes ---------- */
  function pic(file, alt, cls, sizes, eager) {
    var base = (MEDIA && MEDIA.base) || 'assets/img/';

    /* si es una ruta completa, por ejemplo una imagen subida desde el
       panel, se usa tal cual y no se buscan los dos tamanos */
    if (/[\/.]/.test(file)) {
      var ruta = file.charAt(0) === '/' ? assets().replace(/\/$/, '') + file : assets() + file;
      var pequena = /-800\.webp$/.test(ruta) ? ruta.replace(/-800\.webp$/, '-400.webp') : null;
      return el('img', {
        src: ruta,
        srcset: pequena ? pequena + ' 400w, ' + ruta + ' 800w' : null,
        sizes: pequena ? (sizes || '(max-width: 700px) 50vw, 380px') : null,
        alt: alt || '', class: cls || null,
        loading: eager ? 'eager' : 'lazy',
        fetchpriority: eager ? 'high' : null,
        decoding: 'async'
      });
    }

    var conf = (MEDIA && MEDIA[file]) || { widths: [400, 800], w: 800, h: 800 };
    var name = conf.file || file;
    var ws = conf.widths || [400, 800];
    return el('img', {
      src: assets() + base + name + '-' + ws[ws.length - 1] + '.webp',
      srcset: ws.map(function (w) {
        return assets() + base + name + '-' + w + '.webp ' + w + 'w';
      }).join(', '),
      sizes: sizes || '(max-width: 700px) 50vw, 380px',
      alt: alt || '', class: cls || null,
      loading: eager ? 'eager' : 'lazy',
      fetchpriority: eager ? 'high' : null,
      decoding: 'async', width: conf.w, height: conf.h
    });
  }
  function cardImage(id, alt) {
    var f = TARJETAS && TARJETAS[id];
    return f ? pic(f, alt, 'card__img') : null;
  }

  /* ---------- cabecera y pie ---------- */
  function header(d) {
    var brand = el('a', { class: 'site__brand', href: '#/' }, [
      pic('emblema', d.meta.emblemAlt, 'site__crest', '34px', true),
      el('span', { class: 'site__name' }, [
        document.createTextNode(d.meta.brand + ' '),
        el('em', { text: d.meta.brandAccent })
      ])
    ]);

    var nav = el('nav', { class: 'site__nav' }, d.pages.map(function (p) {
      return el('a', { href: '#/' + p.id, text: p.title });
    }));

    var sel = el('select', { class: 'site__lang', 'aria-label': 'Idioma' });
    CTX.languages.forEach(function (l) {
      sel.appendChild(el('option', {
        value: l.code,
        text: (l.flag ? l.flag + '  ' : '') + l.name
      }));
    });
    sel.value = CTX.current;
    sel.addEventListener('change', function () { CTX.setLang(sel.value); });

    return el('header', { class: 'site' }, [
      el('div', { class: 'site__in' }, [
        brand,
        d.meta.badge ? el('span', { class: 'site__badge', text: d.meta.badge }) : null,
        nav,
        sel
      ])
    ]);
  }

  function footer(d) {
    return el('footer', { class: 'site-foot' }, [
      el('div', { class: 'wrap' }, [
        el('p', null, [document.createTextNode(d.footer.line1), el('br'),
                       document.createTextNode(d.footer.line2)]),
        d.footer.draft ? el('p', { class: 'draft', text: d.footer.draft }) : null
      ])
    ]);
  }

  /* ---------- portada ---------- */
  function home(d) {
    var cards = el('div', { class: 'cards' }, d.home.cards.map(function (c) {
      return el('a', { class: 'card', href: '#/' + c.id }, [
        el('span', { class: 'card__frame' }, [cardImage(c.id, '')]),
        el('span', { class: 'card__title', text: c.title }),
        c.note ? el('span', { class: 'card__note', text: c.note }) : null
      ]);
    }));

    return el('main', { class: 'view view--home' }, [
      el('div', { class: 'banner' }, [pic('banner', d.home.bannerAlt, 'banner__img', '100vw', true)]),
      el('div', { class: 'wrap' }, [
        el('h1', { class: 'sr', text: d.home.title + ' ' + d.home.subtitle }),
        el('p', { class: 'home__lead', text: d.home.lead }),
        cards
      ])
    ]);
  }

  /* ---------- bloques de una pagina ---------- */
  function blockList(s) {
    return el('ol', { class: 'items' }, s.items.map(function (it) {
      return el('li', { class: 'item' }, [
        el('h3', { class: 'item__t', text: it.title }),
        it.text ? el('p', { class: 'item__d', text: it.text }) : null
      ]);
    }));
  }
  function blockRank(s) {
    return el('ol', { class: 'rank' }, s.items.map(function (it, i) {
      return el('li', { class: 'rank__row' }, [
        el('span', { class: 'rank__n', text: String(i + 1) }),
        el('span', { class: 'rank__t', text: it.title }),
        el('span', { class: 'rank__bar' }, [
          el('span', { class: 'rank__fill', style: 'width:' + (100 - i * 16) + '%' })
        ])
      ]);
    }));
  }
  function blockCards(s) {
    return el('div', { class: 'tiles' }, s.items.map(function (it) {
      return el('div', { class: 'tile' }, [
        el('span', { class: 'tile__t', text: it.title }),
        it.text ? el('span', { class: 'tile__d', text: it.text }) : null
      ]);
    }));
  }
  function blockTable(s) {
    return el('div', { class: 'tablewrap' }, [
      el('table', null, [
        el('thead', null, [el('tr', null, (s.columns || []).map(function (c) {
          return el('th', { scope: 'col', text: c });
        }))]),
        el('tbody', null, (s.rows || []).map(function (r) {
          return el('tr', r.highlight ? { class: 'key' } : null,
            r.cells.map(function (c, i) {
              return el('td', {
                class: i > 0 ? 'soft' : null,
                'data-label': (s.columns && s.columns[i]) || ''
              }, [document.createTextNode(c)]);
            }));
        }))
      ])
    ]);
  }
  function blockSoon(s, d) {
    return el('div', { class: 'soon' }, [
      el('span', { class: 'soon__t', text: d.ui.soon }),
      el('p', { class: 'soon__d', text: d.ui.soonText })
    ]);
  }

  function page(d, id) {
    var p = null;
    d.pages.forEach(function (x) { if (x.id === id) p = x; });
    if (!p) return home(d);

    var img = TARJETAS && TARJETAS[p.id];
    var blocks = p.sections.map(function (s) {
      var body = s.type === 'list'  ? blockList(s)
               : s.type === 'rank'  ? blockRank(s)
               : s.type === 'cards' ? blockCards(s)
               : s.type === 'table' ? blockTable(s)
               : blockSoon(s, d);
      return el('section', { class: 'block block--' + s.type }, [
        s.title ? el('h2', { class: 'block__t', text: s.title }) : null,
        s.intro ? el('p', { class: 'block__i', text: s.intro }) : null,
        body
      ]);
    });

    return el('main', { class: 'view view--page' }, [
      el('div', { class: 'wrap' }, [
        el('a', { class: 'back', href: '#/', text: '← ' + d.ui.back }),
        el('header', { class: 'page__head' }, [
          img ? el('span', { class: 'page__frame' }, [pic(img, '', 'page__img', '160px', true)]) : null,
          el('div', null, [
            el('h1', { class: 'page__t', text: p.title }),
            p.intro ? el('p', { class: 'page__i', text: p.intro }) : null
          ])
        ])
      ].concat(blocks.map(function (b) { return b; })))
    ]);
  }

  /* ---------- cartel para instalar en el movil ---------- */
  var instalable = null;

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    instalable = e;
    if (DATA) pintarCartel(DATA);
  });

  function yaInstalada() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  }
  function esIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) &&
           !/crios|fxios/i.test(navigator.userAgent);
  }

  function pintarCartel(d) {
    if (document.getElementById('instalar')) return;
    if (yaInstalada() || load('dsl770.instalar') === 'no') return;
    if (!instalable && !esIOS()) return;

    var t = d.ui || {};
    var caja = el('aside', { class: 'instalar', id: 'instalar', role: 'dialog',
                             'aria-label': t.installTitle || '' }, [
      el('img', { class: 'instalar__icono', src: assets() + 'assets/img/icono-192.png',
                  alt: '', width: 48, height: 48 }),
      el('div', { class: 'instalar__txt' }, [
        el('strong', { text: t.installTitle || '' }),
        el('p', { text: instalable ? (t.installText || '') : (t.installIos || '') })
      ]),
      el('div', { class: 'instalar__btns' },
        (instalable ? [el('button', { class: 'instalar__si', type: 'button',
                                      text: t.installButton || '' })] : []).concat([
          el('button', { class: 'instalar__no', type: 'button', text: t.installLater || '' })
        ]))
    ]);

    var si = caja.querySelector('.instalar__si');
    if (si) si.addEventListener('click', function () {
      caja.remove();
      instalable.prompt();
      instalable.userChoice.then(function () { instalable = null; });
    });
    caja.querySelector('.instalar__no').addEventListener('click', function () {
      store('dsl770.instalar', 'no');
      caja.remove();
    });

    document.body.appendChild(caja);
  }

  /* ---------- enrutado ---------- */
  function currentId() {
    var h = (location.hash || '').replace(/^#\/?/, '').split('?')[0];
    return h || '';
  }

  function draw() {
    var d = DATA;
    var root = document.getElementById('root');
    var id = currentId();
    root.textContent = '';
    root.appendChild(header(d));
    root.appendChild(id ? page(d, id) : home(d));
    root.appendChild(footer(d));
    document.documentElement.setAttribute('dir', d.meta.direction || 'ltr');
    document.body.setAttribute('data-view', id || 'home');
    if (!id) setTimeout(function () { pintarCartel(d); }, 2500);
  }

  function fetchJSON(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(url + ' ' + r.status);
      return r.json();
    });
  }

  function start() {
    var base = window.CONTENT_BASE || 'content/';
    var packed = document.getElementById('bundled-content');
    var bundle = packed ? JSON.parse(packed.textContent) : null;

    var getLangs = bundle ? Promise.resolve(bundle.languages) : fetchJSON(base + 'languages.json');
    var getMedia = bundle ? Promise.resolve(bundle.media)
                          : fetchJSON(base + 'media.json').catch(function () { return null; });
    var getTarjetas = bundle ? Promise.resolve(bundle.tarjetas)
                          : fetchJSON(base + 'tarjetas.json').catch(function () { return null; });
    var getSite = function (c) {
      return bundle ? Promise.resolve(bundle.content[c]) : fetchJSON(base + 'site.' + c + '.json');
    };

    return Promise.all([getLangs, getMedia, getTarjetas]).then(function (res) {
      var langs = res[0];
      MEDIA = res[1];
      TARJETAS = res[2];
      var codes = langs.map(function (l) { return l.code; });
      var saved = load('dsl770.lang');
      var guess = (navigator.language || '').slice(0, 2).toLowerCase();
      var current = codes.indexOf(saved) >= 0 ? saved
                  : codes.indexOf(guess) >= 0 ? guess : codes[0];

      CTX = {
        languages: langs,
        get current() { return current; },
        setLang: function (code) {
          current = code;
          store('dsl770.lang', code);
          document.documentElement.setAttribute('lang', code);
          return getSite(code).then(function (d) { DATA = d; draw(); });
        }
      };

      window.addEventListener('hashchange', function () { draw(); window.scrollTo(0, 0); });
      document.documentElement.setAttribute('lang', current);
      return getSite(current).then(function (d) { DATA = d; draw(); });
    }).catch(function (e) {
      document.getElementById('root').appendChild(el('p', {
        style: 'padding:40px;font-family:system-ui;color:#888',
        text: 'No se ha podido cargar el contenido. Recarga la página.'
      }));
      if (window.console) console.error(e);
    });
  }

  return { start: start, el: el };
})();

document.addEventListener('DOMContentLoaded', function () { DSL.start(); });
