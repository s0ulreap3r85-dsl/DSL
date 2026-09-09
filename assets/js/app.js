/* Pinta la web a partir de los ficheros de content/, cambia de idioma,
   y lleva el contador de la guerra. Los textos NO se tocan aqui. */

(function () {
  'use strict';

  var app = document.getElementById('app');
  var foot = document.getElementById('foot');
  var sel = document.getElementById('lang');
  var root = document.documentElement;
  var countdownNode = null;
  var daysSuffix = 'd';

  /* ---------- utilidades ---------- */

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

  function head(data, id) {
    return el('div', { class: 'sec__head' }, [
      el('span', { class: 'eyebrow', text: data.eyebrow }),
      el('h2', { text: data.title }),
      data.text ? el('p', { text: data.text }) : null
    ]);
  }

  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  /* ---------- secciones ---------- */

  function heroSection(d) {
    var h1 = el('h1', { text: d.hero.title }, [el('span', { text: d.hero.subtitle })]);

    countdownNode = el('div', { class: 'warpanel__t', id: 'cd', text: '--' });
    daysSuffix = d.hero.daysSuffix || 'd';

    var panel = el('aside', { class: 'warpanel' }, [
      el('span', { class: 'warpanel__label', text: d.hero.countdownLabel }),
      countdownNode,
      el('span', { class: 'warpanel__sub', text: d.hero.countdownNote })
    ]);

    var stats = el('dl', { class: 'readout' }, d.stats.map(function (s) {
      return el('div', null, [
        el('dt', { text: s.label }),
        el('dd', { text: s.value }, s.note ? [el('small', { text: s.note })] : [])
      ]);
    }));

    return el('section', { class: 'hero' }, [
      el('div', { class: 'hero__grid' }, [
        el('div', null, [
          el('span', { class: 'eyebrow', text: d.hero.eyebrow }),
          h1,
          el('p', { class: 'hero__lead', text: d.hero.lead }),
          el('div', { class: 'hero__cta' }, [
            el('a', { class: 'btn btn--solid', href: '#alta', text: d.hero.primaryButton }),
            el('a', { class: 'btn btn--ghost', href: '#protocolos', text: d.hero.secondaryButton })
          ])
        ]),
        panel
      ]),
      stats
    ]);
  }

  function aboutSection(d) {
    return el('section', { class: 'sec', id: 'clan' }, [
      head(d.about),
      el('div', { class: 'reqs' }, d.about.requirements.map(function (r) {
        return el('div', { class: 'req' }, [
          el('span', { class: 'req__k', text: r.key }),
          el('div', { class: 'req__v', text: r.value }),
          el('p', { class: 'req__n', text: r.note })
        ]);
      }))
    ]);
  }

  function rulesSection(d) {
    return el('section', { class: 'sec', id: 'protocolos' }, [
      head(d.rules),
      el('div', { class: 'protos' }, d.rules.items.map(function (r, i) {
        var num = 'P' + String(i + 1).padStart(2, '0');
        var det = el('details', { class: 'proto' }, [
          el('summary', null, [
            el('span', { class: 'proto__n', text: num }),
            el('span', { class: 'proto__t', text: r.title }),
            el('span', { class: 'proto__x', text: '+' })
          ]),
          el('p', { text: r.text })
        ]);
        if (i === 0) det.open = true;
        return det;
      }))
    ]);
  }

  function commandSection(d) {
    return el('section', { class: 'sec', id: 'mando' }, [
      head(d.command),
      el('div', { class: 'ranks' }, d.command.ranks.map(function (r) {
        return el('article', { class: 'rank' + (r.highlight ? ' rank--lead' : '') }, [
          el('div', { class: 'rank__top' }, [
            el('h3', { class: 'rank__ttl', text: r.title }),
            el('span', { class: 'rank__count', text: r.count })
          ]),
          el('ul', { class: 'rank__list' }, (r.members || []).map(function (m) {
            return el('li', { text: m });
          })),
          el('p', { class: 'rank__note', text: r.note })
        ]);
      }))
    ]);
  }

  function scheduleSection(d) {
    var thead = el('thead', null, [
      el('tr', null, d.schedule.columns.map(function (c) {
        return el('th', { scope: 'col', text: c });
      }))
    ]);
    var tbody = el('tbody', null, d.schedule.rows.map(function (r) {
      var cls = { must: 'pill pill--must', ok: 'pill pill--ok', free: 'pill pill--free' };
      return el('tr', r.highlight ? { class: 'key' } : null, [
        el('td', { text: r.day }),
        el('td', { text: r.operation }),
        el('td', { class: 'time', text: r.time }),
        el('td', null, [el('span', { class: cls[r.level] || cls.free, text: r.attendance })])
      ]);
    }));
    return el('section', { class: 'sec', id: 'operaciones' }, [
      head(d.schedule),
      el('div', { class: 'tablewrap' }, [el('table', null, [thead, tbody])])
    ]);
  }

  function boardSection(d) {
    return el('section', { class: 'sec', id: 'tablon' }, [
      head(d.board),
      el('div', { class: 'posts' }, d.board.posts.map(function (p) {
        return el('article', { class: 'post' }, [
          el('span', { class: 'post__date', text: p.date }),
          el('div', null, [
            el('h3', { text: p.title }),
            el('p', { text: p.text })
          ])
        ]);
      }))
    ]);
  }

  function joinSection(d) {
    var id = el('p', { class: 'join__id' }, [
      el('span', { text: d.join.findText + ' ' }),
      el('b', { text: d.join.clanName }),
      el('span', { text: ', ' + d.join.serverText + ' ' }),
      el('b', { text: d.join.server })
    ]);
    return el('section', { class: 'join', id: 'alta' }, [
      el('div', null, [
        el('span', { class: 'eyebrow', text: d.join.eyebrow }),
        el('h2', { text: d.join.title }),
        el('p', { text: d.join.text }),
        id
      ]),
      el('div', { class: 'hero__cta' }, [
        el('a', {
          class: 'btn btn--solid',
          href: d.join.buttonUrl || '#alta',
          target: (d.join.buttonUrl || '').indexOf('http') === 0 ? '_blank' : null,
          rel: (d.join.buttonUrl || '').indexOf('http') === 0 ? 'noopener' : null,
          text: d.join.buttonLabel
        })
      ])
    ]);
  }

  /* ---------- pintado ---------- */

  function render(d) {
    document.getElementById('brand').textContent = '';
    document.getElementById('brand').appendChild(document.createTextNode(d.meta.brand + ' '));
    document.getElementById('brand').appendChild(el('em', { text: d.meta.brandAccent }));

    var badge = document.getElementById('badge');
    badge.textContent = d.meta.badge || '';
    badge.hidden = !d.meta.badge;

    var nav = document.getElementById('nav');
    nav.textContent = '';
    d.nav.forEach(function (n) {
      nav.appendChild(el('a', { href: '#' + n.target, text: n.label }));
    });

    app.textContent = '';
    [heroSection, aboutSection, rulesSection, commandSection,
     scheduleSection, boardSection, joinSection].forEach(function (fn) {
      app.appendChild(fn(d));
    });

    foot.textContent = '';
    foot.appendChild(el('p', null, [
      document.createTextNode(d.footer.line1),
      el('br'),
      document.createTextNode(d.footer.line2)
    ]));
    if (d.footer.draft) foot.appendChild(el('p', { class: 'draft', text: d.footer.draft }));

    root.setAttribute('dir', d.meta.direction || 'ltr');
    tick();
  }

  /* ---------- contador ---------- */

  function nextWar() {
    var n = new Date();
    var t = new Date(n.getFullYear(), n.getMonth(), n.getDate(), 21, 0, 0, 0);
    t.setDate(t.getDate() + ((5 - t.getDay() + 7) % 7));
    if (t <= n) t.setDate(t.getDate() + 7);
    return t;
  }
  var target = nextWar();
  function pad(v) { return String(v).padStart(2, '0'); }
  function tick() {
    if (!countdownNode) return;
    var ms = target - new Date();
    if (ms <= 0) { target = nextWar(); ms = target - new Date(); }
    var s = Math.floor(ms / 1000);
    countdownNode.textContent = Math.floor(s / 86400) + daysSuffix + ' ' +
      pad(Math.floor(s % 86400 / 3600)) + ':' + pad(Math.floor(s % 3600 / 60)) + ':' + pad(s % 60);
  }
  setInterval(tick, 1000);

  /* ---------- arranque ---------- */

  var packed = document.getElementById('bundled-content');
  var bundle = packed ? JSON.parse(packed.textContent) : null;

  function fetchJSON(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(url + ' ' + r.status);
      return r.json();
    });
  }

  function getContent(code) {
    if (bundle) return Promise.resolve(bundle.content[code]);
    return fetchJSON('content/site.' + code + '.json');
  }

  function getLanguages() {
    if (bundle) return Promise.resolve(bundle.languages);
    return fetchJSON('content/languages.json');
  }

  function fail(e) {
    app.textContent = '';
    app.appendChild(el('p', {
      style: 'padding:60px 0;color:#8A9AAE',
      text: 'No se ha podido cargar el contenido. Recarga la página.'
    }));
    if (window.console) console.error(e);
  }

  getLanguages().then(function (langs) {
    langs.forEach(function (l) {
      sel.appendChild(el('option', { value: l.code, text: l.name }));
    });

    var codes = langs.map(function (l) { return l.code; });
    var saved = load('dsl770.lang');
    var guess = (navigator.language || '').slice(0, 2).toLowerCase();
    var start = codes.indexOf(saved) >= 0 ? saved
              : codes.indexOf(guess) >= 0 ? guess
              : codes[0];

    sel.value = start;
    root.setAttribute('lang', start);

    sel.addEventListener('change', function () {
      store('dsl770.lang', sel.value);
      root.setAttribute('lang', sel.value);
      getContent(sel.value).then(render).catch(fail);
    });

    return getContent(start).then(render);
  }).catch(fail);
})();
