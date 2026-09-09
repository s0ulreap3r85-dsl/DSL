#!/usr/bin/env bash
# Genera preview.html, un fichero unico con el CSS y el JS dentro,
# para poder compartir la web por mensaje sin subirla a ningun sitio.
set -e
cd "$(dirname "$0")/.."

python3 - <<'PY'
html = open('index.html', encoding='utf-8').read()
css  = open('assets/css/style.css', encoding='utf-8').read()
i18n = open('assets/js/i18n.js', encoding='utf-8').read()
app  = open('assets/js/app.js', encoding='utf-8').read()

html = html.replace('<link rel="stylesheet" href="assets/css/style.css">',
                    '<style>\n' + css + '</style>')
html = html.replace('<script src="assets/js/i18n.js"></script>\n<script src="assets/js/app.js"></script>',
                    '<script>\n' + i18n + '\n' + app + '\n</script>')
open('preview.html', 'w', encoding='utf-8').write(html)
print('preview.html generado')
PY
