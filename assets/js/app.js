/* Diseno 1, Panel de mando. Pinta la web con los datos que le da core.js. */

(function () {
  'use strict';
  var el = DSL.el;

  function head(s) {
    return el('div', { class: 'sec__head' }, [
      el('span', { class: 'eyebrow', text: s.eyebrow }),
      el('h2', { text: s.title }),
      s.text ? el('p', { text: s.text }) : null
    ]);
  }

  function render(d, ctx) {
    /* cabecera */
    var brand = document.getElementById('brand');
    brand.textContent = d.meta.brand + ' ';
    brand.appendChild(el('em', { text: d.meta.brandAccent }));

    var badge = document.getElementById('badge');
    badge.textContent = d.meta.badge || '';
    badge.hidden = !d.meta.badge;

    var nav = document.getElementById('nav');
    nav.textContent = '';
    d.nav.forEach(function (n) {
      nav.appendChild(el('a', { href: '#' + n.target, text: n.label }));
    });

    var langBox = document.getElementById('langbox');
    langBox.textContent = '';
    langBox.appendChild(DSL.langSelect(ctx));

    /* portada */
    var cd = el('div', { class: 'warpanel__t' });
    var hero = el('section', { class: 'hero' }, [
      el('div', { class: 'hero__grid' }, [
        el('div', null, [
          el('span', { class: 'eyebrow', text: d.hero.eyebrow }),
          el('h1', { text: d.hero.title }, [el('span', { text: d.hero.subtitle })]),
          el('p', { class: 'hero__lead', text: d.hero.lead }),
          el('div', { class: 'hero__cta' }, [
            el('a', { class: 'btn btn--solid', href: '#alta', text: d.hero.primaryButton }),
            el('a', { class: 'btn btn--ghost', href: '#protocolos', text: d.hero.secondaryButton })
          ])
        ]),
        el('aside', { class: 'warpanel' }, [
          el('span', { class: 'warpanel__label', text: d.hero.countdownLabel }),
          cd,
          el('span', { class: 'warpanel__sub', text: d.hero.countdownNote })
        ])
      ]),
      el('dl', { class: 'readout' }, d.stats.map(function (s) {
        return el('div', null, [
          el('dt', { text: s.label }),
          el('dd', { text: s.value }, s.note ? [el('small', { text: s.note })] : [])
        ]);
      }))
    ]);

    var about = el('section', { class: 'sec', id: 'clan' }, [
      head(d.about),
      el('div', { class: 'reqs' }, d.about.requirements.map(function (r) {
        return el('div', { class: 'req' }, [
          el('span', { class: 'req__k', text: r.key }),
          el('div', { class: 'req__v', text: r.value }),
          el('p', { class: 'req__n', text: r.note })
        ]);
      }))
    ]);

    var rules = el('section', { class: 'sec', id: 'protocolos' }, [
      head(d.rules),
      el('div', { class: 'protos' }, d.rules.items.map(function (r, i) {
        var det = el('details', { class: 'proto' }, [
          el('summary', null, [
            el('span', { class: 'proto__n', text: 'P' + String(i + 1).padStart(2, '0') }),
            el('span', { class: 'proto__t', text: r.title }),
            el('span', { class: 'proto__x', text: '+' })
          ]),
          el('p', { text: r.text })
        ]);
        if (i === 0) det.open = true;
        return det;
      }))
    ]);

    var command = el('section', { class: 'sec', id: 'mando' }, [
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

    var pill = { must: 'pill pill--must', ok: 'pill pill--ok', free: 'pill pill--free' };
    var schedule = el('section', { class: 'sec', id: 'operaciones' }, [
      head(d.schedule),
      el('div', { class: 'tablewrap' }, [
        el('table', null, [
          el('thead', null, [el('tr', null, d.schedule.columns.map(function (c) {
            return el('th', { scope: 'col', text: c });
          }))]),
          el('tbody', null, d.schedule.rows.map(function (r) {
            return el('tr', r.highlight ? { class: 'key' } : null, [
              el('td', { text: r.day }),
              el('td', { text: r.operation }),
              el('td', { class: 'time', text: r.time }),
              el('td', null, [el('span', { class: pill[r.level] || pill.free, text: r.attendance })])
            ]);
          }))
        ])
      ])
    ]);

    var board = el('section', { class: 'sec', id: 'tablon' }, [
      head(d.board),
      el('div', { class: 'posts' }, d.board.posts.map(function (p) {
        return el('article', { class: 'post' }, [
          el('span', { class: 'post__date', text: p.date }),
          el('div', null, [el('h3', { text: p.title }), el('p', { text: p.text })])
        ]);
      }))
    ]);

    var ext = (d.join.buttonUrl || '').indexOf('http') === 0;
    var join = el('section', { class: 'join', id: 'alta' }, [
      el('div', null, [
        el('span', { class: 'eyebrow', text: d.join.eyebrow }),
        el('h2', { text: d.join.title }),
        el('p', { text: d.join.text }),
        el('p', { class: 'join__id' }, [
          el('span', { text: d.join.findText + ' ' }),
          el('b', { text: d.join.clanName }),
          el('span', { text: ', ' + d.join.serverText + ' ' }),
          el('b', { text: d.join.server })
        ])
      ]),
      el('div', { class: 'hero__cta' }, [
        el('a', {
          class: 'btn btn--solid', href: d.join.buttonUrl || '#alta',
          target: ext ? '_blank' : null, rel: ext ? 'noopener' : null,
          text: d.join.buttonLabel
        })
      ])
    ]);

    var app = document.getElementById('app');
    app.textContent = '';
    [hero, about, rules, command, schedule, board, join].forEach(function (s) {
      app.appendChild(s);
    });

    var foot = document.getElementById('foot');
    foot.textContent = '';
    foot.appendChild(el('p', null, [
      document.createTextNode(d.footer.line1), el('br'),
      document.createTextNode(d.footer.line2)
    ]));
    if (d.footer.draft) foot.appendChild(el('p', { class: 'draft', text: d.footer.draft }));

    DSL.countdown(cd, d.hero.daysSuffix);
  }

  DSL.init(render);
})();
