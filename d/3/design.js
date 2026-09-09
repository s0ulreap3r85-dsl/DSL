/* Diseno 3, Terminal del refugio. */
(function () {
  'use strict';
  var el = DSL.el, root = document.getElementById('root');

  var LOGO = [
'  ██████  ███████ ██',
'  ██   ██ ██      ██',
'  ██   ██ ███████ ██',
'  ██   ██      ██ ██',
'  ██████  ███████ ███████'].join('\n');

  function prompt(cmdText) {
    return el('span', { class: 'cmd' }, [
      document.createTextNode('dsl@770:~$ '),
      el('b', { text: cmdText })
    ]);
  }

  function secHead(s, cmd) {
    return [prompt(cmd), el('h2', { text: s.title }),
            s.text ? el('p', { class: 'int', text: s.text }) : null];
  }

  function render(d, ctx) {
    var cd = el('div', { class: 'cdown' });
    var ext = (d.join.buttonUrl || '').indexOf('http') === 0;
    var st = { must: 'st st--must', ok: 'st st--ok', free: 'st st--free' };

    var bar = el('header', { class: 'bar' }, [
      el('div', { class: 'bar__in' }, [
        el('span', { class: 'host' }, [
          document.createTextNode(d.meta.brand.toLowerCase() + '@'),
          el('b', { text: d.meta.brandAccent })
        ]),
        d.meta.badge ? el('span', { class: 'warn', text: d.meta.badge }) : null,
        el('nav', { class: 'menu' }, d.nav.map(function (n) {
          return el('a', { href: '#' + n.target, text: n.label.toLowerCase() });
        })),
        DSL.langSelect(ctx)
      ])
    ]);

    var boot = el('section', { class: 'wrap boot' }, [
      prompt('./iniciar_refugio.sh'),
      el('pre', { class: 'ascii', text: LOGO }),
      el('h1', { text: d.hero.title + ' ' + d.hero.subtitle }, [el('span', { class: 'cur' })]),
      el('p', { class: 'sub', text: d.hero.eyebrow }),
      el('p', { class: 'lead', text: d.hero.lead }),
      el('div', { class: 'acts' }, [
        el('a', { class: 'k k--go', href: '#alta', text: '[ ' + d.hero.primaryButton + ' ]' }),
        el('a', { class: 'k', href: '#protocolos', text: '[ ' + d.hero.secondaryButton + ' ]' })
      ]),
      el('div', { class: 'box alert' }, [
        el('div', { class: 'box__h' }, [
          el('span', { text: d.hero.countdownLabel }),
          el('span', { text: d.hero.countdownNote })
        ]),
        el('div', { class: 'box__b' }, [cd])
      ]),
      el('dl', { class: 'kv' }, d.stats.map(function (s) {
        return el('div', null, [
          el('dt', { text: s.label }),
          el('dd', { text: s.value }, s.note ? [el('small', { text: s.note })] : [])
        ]);
      }))
    ]);

    var about = el('section', { class: 'wrap sec', id: 'clan' },
      secHead(d.about, 'cat quienes_somos.txt').concat([
        el('div', { class: 'reqs' }, d.about.requirements.map(function (r) {
          return el('div', null, [
            el('span', { text: r.key }),
            el('strong', { text: r.value }),
            el('p', { text: r.note })
          ]);
        }))
      ]));

    var rules = el('section', { class: 'wrap sec', id: 'protocolos' },
      secHead(d.rules, 'cat /etc/normas.conf').concat([
        el('div', { class: 'rules' }, d.rules.items.map(function (r, i) {
          var det = el('details', { class: 'rule' }, [
            el('summary', null, [
              el('span', { class: 'rule__i', text: '[' + String(i + 1).padStart(2, '0') + ']' }),
              el('span', { class: 'rule__t', text: r.title }),
              el('span', { class: 'rule__s', text: '···' })
            ]),
            el('p', { text: r.text })
          ]);
          if (i === 0) det.open = true;
          return det;
        }))
      ]));

    var command = el('section', { class: 'wrap sec', id: 'mando' },
      secHead(d.command, 'who --ranks').concat([
        el('div', { class: 'crew' }, d.command.ranks.map(function (r) {
          return el('article', r.highlight ? { class: 'crew--lead' } : null, [
            el('span', { class: 'crew__c', text: r.count }),
            el('h3', { text: r.title }),
            el('ul', null, (r.members || []).map(function (m) { return el('li', { text: m }); })),
            el('p', { text: r.note })
          ]);
        }))
      ]));

    var schedule = el('section', { class: 'wrap sec', id: 'operaciones' },
      secHead(d.schedule, 'crontab -l').concat([
        el('div', { class: 'tbl' }, [
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
      ]));

    var board = el('section', { class: 'wrap sec', id: 'tablon' },
      secHead(d.board, 'tail -n 3 anuncios.log').concat([
        el('div', { class: 'log' }, d.board.posts.map(function (p) {
          return el('article', null, [
            el('time', { text: p.date }),
            el('h3', { text: p.title }),
            el('p', { text: p.text })
          ]);
        }))
      ]));

    var join = el('section', { class: 'wrap' }, [
      el('div', { class: 'join', id: 'alta' }, [
        prompt('./solicitar_ingreso.sh'),
        el('h2', { text: d.join.title }),
        el('p', { text: d.join.text }),
        el('p', { class: 'id', text: d.join.findText + ' ' + d.join.clanName + ', ' +
                                     d.join.serverText + ' ' + d.join.server }),
        el('div', { class: 'acts' }, [
          el('a', {
            class: 'k k--go', href: d.join.buttonUrl || '#alta',
            target: ext ? '_blank' : null, rel: ext ? 'noopener' : null,
            text: '[ ' + d.join.buttonLabel + ' ]'
          })
        ])
      ])
    ]);

    var foot = el('footer', null, [
      el('div', { class: 'wrap' }, [
        el('p', null, [document.createTextNode(d.footer.line1), el('br'),
                       document.createTextNode(d.footer.line2)]),
        d.footer.draft ? el('p', { class: 'draft', text: '! ' + d.footer.draft }) : null
      ])
    ]);

    root.textContent = '';
    [bar, boot, about, rules, command, schedule, board, join, foot].forEach(function (s) {
      root.appendChild(s);
    });
    DSL.countdown(cd, d.hero.daysSuffix);
  }

  DSL.init(render);
})();
