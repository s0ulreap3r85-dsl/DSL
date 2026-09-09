# [DsL] Demon Slayer League · Servidor 770

Web oficial del clan, para el juego Last Z: Survival Shooter.

Sitio estático, sin base de datos y sin servidor. Se publica gratis, carga en menos de un segundo, y funciona igual de bien en el móvil que en el ordenador.

> **Estado actual: maqueta.** Los nombres, las cifras, y los anuncios son de ejemplo. Hay que sustituirlos por los reales antes de enseñar la web al clan. Ver la sección Pendientes.

## Qué hay dentro

```
index.html              La página entera, con los textos en español
assets/css/style.css    Todo el diseño
assets/js/i18n.js       Traducciones al resto de idiomas
assets/js/app.js        Selector de idioma y contador de la guerra
tools/build-preview.sh  Genera un fichero único para previsualizar
```

## Cómo cambiar los textos

**El español** se edita directamente en `index.html`. Busca la frase que quieras cambiar y escríbela encima. No toques los atributos `data-t`, son las etiquetas que enlazan cada frase con sus traducciones.

**El resto de idiomas** se editan en `assets/js/i18n.js`. Cada idioma es un bloque que empieza por su código, por ejemplo `en:{` para el inglés. Dentro, cada línea es una etiqueta y su texto.

Ejemplo, para cambiar el título de la primera norma:

```
p1t:"Actividad diaria",        en index.html
p1t:"Daily activity",          en assets/js/i18n.js, bloque en
```

Si una frase no está traducida, la web muestra automáticamente la versión en español, así que nunca aparece un hueco vacío.

## Cómo añadir un idioma nuevo

1. En `assets/js/i18n.js`, copia un bloque de idioma completo y cámbiale el código de las dos primeras letras.
2. Traduce los textos de dentro.
3. En `index.html`, busca `<select id="lang">` y añade una línea más con el idioma nuevo.

Si el idioma se escribe de derecha a izquierda, como el árabe, añade su código en `assets/js/app.js`, en la línea donde aparece `'ar'`. La web se da la vuelta sola.

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
