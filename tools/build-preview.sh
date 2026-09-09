#!/usr/bin/env bash
# Genera preview.html, un fichero unico con el diseno, el codigo, y todos
# los contenidos dentro, para ensenar la web sin subirla a ningun sitio.
set -e
cd "$(dirname "$0")/.."
python3 - <<'PY'
import json, os
html = open('index.html', encoding='utf-8').read()
css  = open('assets/css/base.css', encoding='utf-8').read() + '\n' + \
       open('assets/css/tema-1.css', encoding='utf-8').read().replace('url("../img/','url("assets/img/')
core = open('assets/js/core.js', encoding='utf-8').read()

langs = json.load(open('content/languages.json', encoding='utf-8'))
bundle = {'languages': langs, 'media': json.load(open('content/media.json', encoding='utf-8')),
          'content': {l['code']: json.load(open('content/site.%s.json' % l['code'], encoding='utf-8'))
                      for l in langs if os.path.exists('content/site.%s.json' % l['code'])}}

html = html.replace('<link rel="stylesheet" href="assets/css/base.css">\n<link rel="stylesheet" href="assets/css/tema-1.css">',
                    '<style>\n' + css + '</style>')
html = html.replace('<script src="assets/js/core.js"></script>',
                    '<script type="application/json" id="bundled-content">'
                    + json.dumps(bundle, ensure_ascii=False).replace('</', '<\\/')
                    + '</script>\n<script>\n' + core + '\n</script>')
open('preview.html', 'w', encoding='utf-8').write(html)
print('preview.html generado con', len(bundle['content']), 'idiomas')
PY
