/* Diseno 5, Manga. */
(function () {
  'use strict';
  var el = DSL.el, root = document.getElementById('root');

  function chapter(s, n, id, kids) {
    var img = DSL.sectionImage(id, s.imageAlt, null);
    return el('section', { class: 'wrap ch', id: id }, [
      el('div', { class: 'ch__h' + (img ? ' ch__h--pic' : '') }, [
        el('div', { class: 'ch__t' }, [
          el('span', { class: 'ch__n', text: String(n).padStart(2, '0') }),
          el('div', null, [
            el('h2', { text: s.title }),
            s.text ? el('p', { class: 'int', text: s.text }) : null
          ])
        ]),
        img ? el('div', { class: 'p cut' }, [img]) : null
      ])
    ].concat(kids));
  }

  function render(d, ctx) {
    var cd = el('div', { class: 't' });
    var ext = (d.join.buttonUrl || '').indexOf('http') === 0;
    var tg = { must: 'tg tg--must', ok: 'tg tg--ok', free: 'tg tg--free' };

    var bar = el('header', { class: 'bar' }, [
      el('div', { class: 'bar__in' }, [
        DSL.pic('emblema', d.meta.emblemAlt, 'badge', '32px'),
        el('span', { class: 'logo' }, [
          document.createTextNode(d.meta.brand),
          el('b', { text: d.meta.brandAccent })
        ]),
        d.meta.badge ? el('span', { class: 'flag', text: d.meta.badge }) : null,
        el('nav', { class: 'menu' }, d.nav.map(function (n) {
          return el('a', { href: '#' + n.target, text: n.label });
        })),
        DSL.langSelect(ctx)
      ])
    ]);

    var open = el('div', { class: 'wrap' }, [
      el('div', { class: 'open' }, [
        el('div', { class: 'p p--ink splash' }, [
          el('div', { class: 'cut cut--wide' }, [DSL.pic('banner', d.hero.bannerAlt, null, '100vw')]),
          el('span', { class: 'kicker', text: d.hero.eyebrow }),
          el('h1', { text: d.hero.title }, [el('i', { text: d.hero.subtitle })]),
          el('p', { text: d.hero.lead }),
          el('div', { class: 'acts' }, [
            el('a', { class: 'bt bt--red', href: '#alta', text: d.hero.primaryButton }),
            el('a', { class: 'bt', href: '#protocolos', text: d.hero.secondaryButton })
          ])
        ]),
        el('aside', { class: 'p p--red tick' }, [
          el('span', { class: 'l', text: d.hero.countdownLabel }),
          cd,
          el('span', { class: 'n', text: d.hero.countdownNote })
        ])
      ]),
      el('dl', { class: 'scores' }, d.stats.map(function (s) {
        return el('div', { class: 'p p--tone' }, [
          el('dt', { text: s.label }),
          el('dd', { text: s.value }, s.note ? [el('small', { text: s.note })] : [])
        ]);
      }))
    ]);

    var about = chapter(d.about, 1, 'clan', [
      el('div', { class: 'wants' }, d.about.requirements.map(function (r) {
        return el('div', { class: 'p' }, [
          el('span', { text: r.key }),
          el('strong', { text: r.value }),
          el('p', { text: r.note })
        ]);
      }))
    ]);

    var rules = chapter(d.rules, 2, 'protocolos', [
      el('div', { class: 'codex' }, d.rules.items.map(function (r, i) {
        return el('article', { class: 'p' + (i % 4 === 0 ? ' p--tone' : '') }, [
          el('span', { class: 'no', text: 'REGLA ' + String(i + 1).padStart(2, '0') }),
          el('h3', { text: r.title }),
          el('p', { text: r.text })
        ]);
      }))
    ]);

    var command = chapter(d.command, 3, 'mando', [
      el('div', { class: 'cast' }, d.command.ranks.map(function (r) {
        return el('article', { class: 'p' + (r.highlight ? ' p--red' : '') }, [
          el('span', { class: 'c', text: r.count }),
          el('h3', { text: r.title }),
          el('ul', null, (r.members || []).map(function (m) { return el('li', { text: m }); })),
          el('p', { text: r.note })
        ]);
      }))
    ]);

    var schedule = chapter(d.schedule, 4, 'operaciones', [
      el('div', { class: 'week' }, [
        el('table', null, [
          el('thead', null, [el('tr', null, d.schedule.columns.map(function (c) {
            return el('th', { scope: 'col', text: c });
          }))]),
          el('tbody', null, d.schedule.rows.map(function (r) {
            return el('tr', r.highlight ? { class: 'hot' } : null,
              r.cells.map(function (c) { return el('td', { text: c }); }));
          }))
        ])
      ])
    ]);

    var board = chapter(d.board, 5, 'tablon', [
      el('div', { class: 'strip' }, d.board.posts.map(function (p, i) {
        return el('article', { class: 'p' + (i === 0 ? ' p--tone' : '') }, [
          el('time', { text: p.date }),
          el('div', null, [el('h3', { text: p.title }), el('p', { text: p.text })])
        ]);
      }))
    ]);

    var join = el('div', { class: 'wrap' }, [
      el('section', { class: 'p p--ink final', id: 'alta' }, [
        el('span', { class: 'kicker', text: d.join.eyebrow }),
        el('h2', { text: d.join.title }),
        el('p', { text: d.join.text }),
        el('p', { class: 'id', text: d.join.findText + ' ' + d.join.clanName + ', ' +
                                     d.join.serverText + ' ' + d.join.server }),
        el('div', { class: 'acts' }, [
          el('a', {
            class: 'bt bt--red', href: d.join.buttonUrl || '#alta',
            target: ext ? '_blank' : null, rel: ext ? 'noopener' : null,
            text: d.join.buttonLabel
          })
        ])
      ])
    ]);

    var foot = el('footer', null, [
      el('div', { class: 'wrap' }, [
        el('p', null, [document.createTextNode(d.footer.line1), el('br'),
                       document.createTextNode(d.footer.line2)]),
        d.footer.draft ? el('p', { class: 'draft', text: d.footer.draft }) : null
      ])
    ]);

    root.textContent = '';
    [bar, open, about, rules, command, schedule, board, join, foot].forEach(function (s) {
      root.appendChild(s);
    });
    DSL.countdown(cd, d.hero.daysSuffix);
  }

  DSL.init(render);
})();
