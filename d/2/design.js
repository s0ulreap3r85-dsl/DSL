/* Diseno 2, Cartel de guerra. */
(function () {
  'use strict';
  var el = DSL.el, root = document.getElementById('root');

  function bandHead(s, paper, id) {
    var img = id ? DSL.sectionImage(id, s.imageAlt, null) : null;
    return [el('div', { class: 'hd' + (img ? ' hd--pic' : '') }, [
      el('div', null, [
        el('span', { class: 'lab', text: s.eyebrow }),
        el('h2', { text: s.title }),
        s.text ? el('p', { class: 'int', text: s.text }) : null
      ]),
      img ? el('div', { class: 'shot' }, [img]) : null
    ])];
  }

  function render(d, ctx) {
    var cd = el('span', { class: 'war__t' });
    var ext = (d.join.buttonUrl || '').indexOf('http') === 0;
    var st = { must: 'st st--must', ok: 'st st--ok', free: 'st st--free' };

    var bar = el('header', { class: 'bar' }, [
      el('div', { class: 'bar__in' }, [
        DSL.pic('emblema', d.meta.emblemAlt, 'seal', '34px'),
        el('span', { class: 'mark', text: d.meta.brand + ' ' + d.meta.brandAccent }),
        d.meta.badge ? el('span', { class: 'tag', text: d.meta.badge }) : null,
        el('nav', { class: 'menu' }, d.nav.map(function (n) {
          return el('a', { href: '#' + n.target, text: n.label });
        })),
        DSL.langSelect(ctx)
      ])
    ]);

    var hero = el('section', { class: 'wrap hero' }, [
      el('div', { class: 'strip' }, [DSL.pic('banner', d.hero.bannerAlt, null, '100vw')]),
      el('span', { class: 'lab', text: d.hero.eyebrow }),
      el('h1', { text: d.hero.title }, [el('b', { text: d.hero.subtitle })]),
      el('p', { class: 'hero__lead', text: d.hero.lead }),
      el('div', { class: 'acts' }, [
        el('a', { class: 'b b--fill', href: '#alta', text: d.hero.primaryButton }),
        el('a', { class: 'b b--line', href: '#protocolos', text: d.hero.secondaryButton })
      ]),
      el('div', { class: 'war' }, [
        el('span', { class: 'war__l', text: d.hero.countdownLabel }),
        cd,
        el('span', { class: 'war__n', text: d.hero.countdownNote })
      ]),
      el('dl', { class: 'nums' }, d.stats.map(function (s) {
        return el('div', null, [
          el('dt', { text: s.label }),
          el('dd', { text: s.value }, s.note ? [el('small', { text: s.note })] : [])
        ]);
      }))
    ]);

    var about = el('section', { class: 'band band--paper', id: 'clan' }, [
      el('div', { class: 'wrap' }, bandHead(d.about, null, 'clan').concat([
        el('div', { class: 'req4' }, d.about.requirements.map(function (r) {
          return el('div', null, [
            el('span', { text: r.key }),
            el('strong', { text: r.value }),
            el('p', { text: r.note })
          ]);
        }))
      ]))
    ]);

    var rules = el('section', { class: 'band', id: 'protocolos' }, [
      el('div', { class: 'wrap' }, bandHead(d.rules, null, 'protocolos').concat([
        el('div', { class: 'laws' }, d.rules.items.map(function (r, i) {
          return el('div', { class: 'law' }, [
            el('span', { class: 'law__n', text: String(i + 1).padStart(2, '0') }),
            el('div', null, [el('h3', { text: r.title }), el('p', { text: r.text })])
          ]);
        }))
      ]))
    ]);

    var command = el('section', { class: 'band', id: 'mando' }, [
      el('div', { class: 'wrap' }, bandHead(d.command, null, 'mando').concat([
        el('div', { class: 'crew' }, d.command.ranks.map(function (r) {
          return el('article', r.highlight ? { class: 'crew--lead' } : null, [
            el('h3', { text: r.title }),
            el('span', { class: 'crew__c', text: r.count }),
            el('ul', null, (r.members || []).map(function (m) { return el('li', { text: m }); })),
            el('p', { text: r.note })
          ]);
        }))
      ]))
    ]);

    var schedule = el('section', { class: 'band band--paper', id: 'operaciones' }, [
      el('div', { class: 'wrap' }, bandHead(d.schedule, null, 'operaciones').concat([
        el('div', { class: 'grid7' }, [
          el('table', null, [
            el('thead', null, [el('tr', null, d.schedule.columns.map(function (c) {
              return el('th', { scope: 'col', text: c });
            }))]),
            el('tbody', null, d.schedule.rows.map(function (r) {
              return el('tr', r.highlight ? { class: 'hot' } : null, [
                el('td', { text: r.day }),
                el('td', { text: r.operation }),
                el('td', { text: r.time }),
                el('td', null, [el('span', { class: st[r.level] || st.free, text: r.attendance })])
              ]);
            }))
          ])
        ])
      ]))
    ]);

    var board = el('section', { class: 'band', id: 'tablon' }, [
      el('div', { class: 'wrap' }, bandHead(d.board).concat([
        el('div', { class: 'news' }, d.board.posts.map(function (p) {
          return el('article', null, [
            el('time', { text: p.date }),
            el('h3', { text: p.title }),
            el('p', { text: p.text })
          ]);
        }))
      ]))
    ]);

    var join = el('section', { class: 'call', id: 'alta' }, [
      el('div', { class: 'wrap' }, [
        el('span', { class: 'lab', style: 'color:#0A0A0A', text: d.join.eyebrow }),
        el('h2', { text: d.join.title }),
        el('p', { text: d.join.text }),
        el('p', { class: 'id' }, [
          document.createTextNode(d.join.findText + ' ' + d.join.clanName + ', ' +
                                  d.join.serverText + ' ' + d.join.server)
        ]),
        el('a', {
          class: 'b', href: d.join.buttonUrl || '#alta',
          target: ext ? '_blank' : null, rel: ext ? 'noopener' : null,
          text: d.join.buttonLabel
        })
      ])
    ]);

    var foot = el('footer', null, [
      el('div', { class: 'wrap' }, [
        el('p', null, [document.createTextNode(d.footer.line1), el('br'),
                       document.createTextNode(d.footer.line2)]),
        d.footer.draft ? el('p', { class: 'warn', text: d.footer.draft }) : null
      ])
    ]);

    root.textContent = '';
    [bar, hero, about, rules, command, schedule, board, join, foot].forEach(function (s) {
      root.appendChild(s);
    });
    DSL.countdown(cd, d.hero.daysSuffix);
  }

  DSL.init(render);
})();
