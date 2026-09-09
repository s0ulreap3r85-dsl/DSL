/* Diseno 4, Expediente. */
(function () {
  'use strict';
  var el = DSL.el, root = document.getElementById('root');

  function secHead(s, id) {
    var img = id ? DSL.sectionImage(id, s.imageAlt, null) : null;
    return el('div', { class: 'sec__h' + (img ? ' sec__h--pic' : '') }, [
      el('div', null, [
        el('span', { class: 'sec__n', text: s.eyebrow }),
        el('h2', { text: s.title }),
        s.text ? el('p', { class: 'int', text: s.text }) : null
      ]),
      img ? el('figure', { class: 'photo' }, [img]) : null
    ]);
  }

  function render(d, ctx) {
    var cd = el('div', { class: 't' });
    var ext = (d.join.buttonUrl || '').indexOf('http') === 0;
    var mk = { must: 'mk mk--must', ok: 'mk mk--ok', free: 'mk mk--free' };

    var bar = el('header', { class: 'bar' }, [
      el('div', { class: 'bar__in' }, [
        DSL.pic('emblema', d.meta.emblemAlt, 'crest', '28px'),
        el('span', { class: 'ref', text: d.meta.brand + ' / ' + d.meta.brandAccent }),
        d.meta.badge ? el('span', { class: 'cls', text: d.meta.badge }) : null,
        el('nav', { class: 'menu' }, d.nav.map(function (n) {
          return el('a', { href: '#' + n.target, text: n.label });
        })),
        DSL.langSelect(ctx)
      ])
    ]);

    var file = el('section', { class: 'wrap file' }, [
      el('div', { class: 'tape' }, [
        el('span', { text: d.hero.eyebrow }),
        el('span', { text: d.meta.brand + ' · ' + d.meta.brandAccent })
      ]),
      el('h1', { text: d.hero.title }, [el('em', { text: d.hero.subtitle })]),
      el('figure', { class: 'photo photo--wide' }, [
        DSL.pic('banner', d.hero.bannerAlt, null, '100vw'),
        el('figcaption', { text: d.meta.brand + ' · ' + d.meta.brandAccent })
      ]),
      el('p', { class: 'lead', text: d.hero.lead }),
      el('div', { class: 'acts' }, [
        el('a', { class: 'btn btn--ink', href: '#alta', text: d.hero.primaryButton }),
        el('a', { class: 'btn', href: '#protocolos', text: d.hero.secondaryButton })
      ]),
      el('div', { class: 'stamp' }, [
        el('span', { text: d.hero.countdownLabel }),
        cd,
        el('span', { text: d.hero.countdownNote })
      ]),
      el('dl', { class: 'regs' }, d.stats.map(function (s) {
        return el('div', null, [
          el('dt', { text: s.label }),
          el('dd', { text: s.value }, s.note ? [el('small', { text: s.note })] : [])
        ]);
      }))
    ]);

    var about = el('section', { class: 'wrap sec', id: 'clan' }, [
      secHead(d.about, 'clan'),
      el('div', { class: 'terms' }, d.about.requirements.map(function (r) {
        return el('div', null, [
          el('span', { text: r.key }),
          el('strong', { text: r.value }),
          el('p', { text: r.note })
        ]);
      }))
    ]);

    var rules = el('section', { class: 'wrap sec', id: 'protocolos' }, [
      secHead(d.rules, 'protocolos'),
      el('div', { class: 'arts' }, d.rules.items.map(function (r, i) {
        var det = el('details', { class: 'art' }, [
          el('summary', null, [
            el('span', { class: 'art__n', text: 'ART. ' + String(i + 1).padStart(2, '0') }),
            el('h3', { text: r.title }),
            el('span', { class: 'art__x', text: '§' })
          ]),
          el('p', { text: r.text })
        ]);
        if (i === 0) det.open = true;
        return det;
      }))
    ]);

    var command = el('section', { class: 'wrap sec', id: 'mando' }, [
      secHead(d.command, 'mando'),
      el('div', { class: 'roll' }, d.command.ranks.map(function (r) {
        return el('article', r.highlight ? { class: 'roll--lead' } : null, [
          el('span', { class: 'roll__c', text: r.count }),
          el('h3', { text: r.title }),
          el('ul', null, (r.members || []).map(function (m) { return el('li', { text: m }); })),
          el('p', { text: r.note })
        ]);
      }))
    ]);

    var schedule = el('section', { class: 'wrap sec', id: 'operaciones' }, [
      secHead(d.schedule, 'operaciones'),
      el('div', { class: 'sched' }, [
        el('table', null, [
          el('thead', null, [el('tr', null, d.schedule.columns.map(function (c) {
            return el('th', { scope: 'col', text: c });
          }))]),
          el('tbody', null, d.schedule.rows.map(function (r) {
            return el('tr', r.highlight ? { class: 'hot' } : null, [
              el('td', { text: r.day }),
              el('td', { text: r.operation }),
              el('td', { class: 'time', text: r.time }),
              el('td', null, [el('span', { class: mk[r.level] || mk.free, text: r.attendance })])
            ]);
          }))
        ])
      ])
    ]);

    var board = el('section', { class: 'wrap sec', id: 'tablon' }, [
      secHead(d.board),
      el('div', { class: 'notes' }, d.board.posts.map(function (p) {
        return el('article', null, [
          el('time', { text: p.date }),
          el('h3', { text: p.title }),
          el('p', { text: p.text })
        ]);
      }))
    ]);

    var join = el('section', { class: 'wrap' }, [
      el('div', { class: 'join', id: 'alta' }, [
        el('span', { class: 'sec__n', text: d.join.eyebrow }),
        el('h2', { text: d.join.title }),
        el('p', { text: d.join.text }),
        el('p', { class: 'id', text: d.join.findText + ' ' + d.join.clanName + ', ' +
                                     d.join.serverText + ' ' + d.join.server }),
        el('div', { class: 'acts' }, [
          el('a', {
            class: 'btn btn--ink', href: d.join.buttonUrl || '#alta',
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
    [bar, file, about, rules, command, schedule, board, join, foot].forEach(function (s) {
      root.appendChild(s);
    });
    DSL.countdown(cd, d.hero.daysSuffix);
  }

  DSL.init(render);
})();
