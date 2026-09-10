#!/usr/bin/env python3
"""
Avisa de campos del contenido que el panel de edicion borraria.

El panel guarda solo lo que esta declarado en admin/config.yml. Cualquier
campo que exista en el contenido pero no este declarado desaparece la
primera vez que alguien pulse guardar, y sin avisar.

Uso:  python3 tools/revisar-campos.py
"""
import json, sys, os
try:
    import yaml
except ImportError:
    print('Hace falta pyyaml:  pip install pyyaml'); sys.exit(2)

raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(raiz)

cfg = yaml.safe_load(open('admin/config.yml', encoding='utf-8'))
campos = cfg['collections'][0]['files'][0]['fields']

def declarados(fs):
    out = {}
    for f in fs:
        if f.get('widget') == 'object':
            out[f['name']] = declarados(f.get('fields', []))
        elif f.get('widget') == 'list' and 'fields' in f:
            out[f['name']] = declarados(f['fields'])
        else:
            out[f['name']] = '*'
    return out

D = declarados(campos)
faltan = []
for lang in [l['code'] for l in json.load(open('content/languages.json', encoding='utf-8'))]:
    ruta = 'content/site.%s.json' % lang
    if not os.path.exists(ruta):
        continue
    d = json.load(open(ruta, encoding='utf-8'))
    for k, v in d.items():
        if k not in D:
            faltan.append('%s: %s' % (lang, k))
        elif isinstance(v, dict) and isinstance(D[k], dict):
            for sk in v:
                if sk not in D[k]:
                    faltan.append('%s: %s.%s' % (lang, k, sk))

if faltan:
    print('El panel de edicion borraria estos campos al guardar:')
    for f in faltan:
        print('  ', f)
    print('\nSe arregla declarandolos en admin/config.yml.')
    sys.exit(1)

print('Correcto. Todos los campos del contenido estan declarados en el panel.')
