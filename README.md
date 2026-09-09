# [DsL] Demon Slayer League · Servidor 770

Web oficial del clan, para el juego Last Z: Survival Shooter.

Sitio estático, sin base de datos y sin servidor. Se publica gratis, carga en menos de un segundo, y funciona igual de bien en el móvil que en el ordenador.

> **Estado actual: maqueta.** Los nombres, las cifras, y los anuncios son de ejemplo. Hay que sustituirlos por los reales antes de enseñar la web al clan. Ver la sección Pendientes.

## Qué hay dentro

```
content/languages.json  Los idiomas que ofrece la web
content/site.es.json    Todo el contenido en español
content/site.en.json    Lo mismo en inglés, y así uno por idioma
index.html              El esqueleto de la página, casi vacío a propósito
assets/css/style.css    Todo el diseño
assets/js/app.js        Pinta la web y lleva el contador
tools/build-preview.sh  Genera un fichero único para enseñarla sin publicarla
```

**Los textos no están en el código.** Viven en `content/`, un fichero por idioma, con la misma estructura en todos. Así se pueden editar sin tocar nada más, y así es como el panel de edición podrá modificarlos.

## Cómo cambiar los textos

Cada fichero `content/site.XX.json` tiene las secciones de la web, con los mismos nombres que se ven en pantalla. Se edita el texto entre comillas y ya está.

Cosas que se renumeran solas, así que no hay que tocarlas:

* Las normas se numeran solas. Si borras una, las siguientes se renumeran.
* Los rangos, los días del calendario, y los anuncios funcionan igual. Añades o quitas elementos de la lista y la web se ajusta.

Si un texto falta en un idioma, la web muestra el español en su lugar, nunca un hueco vacío.

## Cómo añadir un idioma

1. Copia `content/site.es.json` a `content/site.XX.json` y traduce los textos de dentro.
2. Añade el idioma a `content/languages.json`, con su código, su nombre, y `ltr` o `rtl` según se escriba de izquierda a derecha o al revés.

Si el idioma usa un alfabeto que no es latino, como el ruso, el chino, el japonés, el coreano, o el tailandés, hay que cargar una tipografía adicional en `index.html`. Avisa antes de traducir.

## Cómo se publica

El sitio se publica en Cloudflare Pages. Cada vez que se sube un cambio a la rama `main`, la web se actualiza sola en unos segundos, sin hacer nada más.

Puesta en marcha, una sola vez, y la tiene que hacer el propietario del repositorio:

1. Crear una cuenta gratuita en dash.cloudflare.com
2. Entrar en Workers and Pages, y pulsar Create, Pages, Connect to Git
3. Autorizar el acceso a este repositorio
4. Dejar la configuración de compilación vacía, es un sitio estático sin compilación
5. Guardar

A partir de ahí la web queda publicada en una dirección del tipo `dsl-770.pages.dev`.

## Ver la web en local

No hace falta instalar nada. Basta con abrir `index.html` en el navegador.

Para generar un fichero único que se pueda compartir por mensaje, ejecuta:

```
bash tools/build-preview.sh
```

## Pendientes

* [ ] Confirmar la lista definitiva de los nueve idiomas
* [ ] Traducir a los cinco idiomas que faltan
* [ ] Sustituir los nombres y rangos de ejemplo por los reales
* [ ] Poner el enlace de invitación de Discord, ahora apunta a ninguna parte
* [ ] Confirmar los horarios reales de guerra y eventos
* [ ] Subir el banner y el logo originales en buena resolución
* [ ] Revisar las normas con el líder del clan
* [ ] Conectar Cloudflare Pages y quitar la etiqueta MAQUETA de la cabecera
