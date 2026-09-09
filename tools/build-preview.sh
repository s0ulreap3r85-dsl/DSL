#!/usr/bin/env bash
# Genera preview.html, un fichero unico con el diseno, el codigo, y todos
# los contenidos dentro, para poder ensenar la web sin subirla a ningun sitio.
set -e
cd "$(dirname "$0")/.."

python3 - <<'PY'
import json, glob, os

html = open('index.html', encoding='utf-8').read()
css  = open('assets/css/style.css', encoding='utf-8').read()
app  = open('assets/js/core.js', encoding='utf-8').read() + '\n' + open('assets/js/app.js', encoding='utf-8').read()

langs = json.load(open('content/languages.json', encoding='utf-8'))
bundle = {'languages': langs, 'content': {},
          'media': json.load(open('content/media.json', encoding='utf-8'))}
for l in langs:
    p = 'content/site.%s.json' % l['code']
    if os.path.exists(p):
        bundle['content'][l['code']] = json.load(open(p, encoding='utf-8'))

html = html.replace('<link rel="stylesheet" href="assets/css/style.css">',
                    '<style>\n' + css + '</style>')
html = html.replace('<script src="assets/js/core.js"></script>\n<script src="assets/js/app.js"></script>',
                    '<script type="application/json" id="bundled-content">'
                    + json.dumps(bundle, ensure_ascii=False).replace('</', '<\\/')
                    + '</script>\n<script>\n' + app + '\n</script>')
open('preview.html', 'w', encoding='utf-8').write(html)
print('preview.html generado con', len(bundle['content']), 'idiomas')
PY
