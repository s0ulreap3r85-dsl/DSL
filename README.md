# [DsL] Demon Slayer League · Servidor 770

Web oficial del clan, para el juego Last Z: Survival Shooter.

Sitio estático, sin base de datos y sin servidor. Se publica gratis, carga en menos de un segundo, y funciona igual de bien en el móvil que en el ordenador.

> **Estado actual: contenido real, diseño por decidir.** Las guías son las del clan, escritas por FrosSit0. Lo que sigue sin ser real es el contador de la guerra y las cifras de la cabecera.

## Aviso sobre la tabla de cuarteles generales

Las versiones inglesa, alemana, y francesa de la infografía coinciden entre sí y siguen un ciclo regular de cinco edificios. La versión española se desalinea a partir del nivel 11, y además llama Campamento de Francotiradores al nivel 15 donde las otras tres dicen Campamento de Tiradores.

La web usa la secuencia de las tres versiones coincidentes. Conviene que el autor lo confirme y corrija la infografía española.

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

## Las imágenes

Están en `assets/img/`, ya optimizadas. Las originales pesaban casi 10 MB entre todas, y comprimidas se quedan en 2 MB, con dos tamaños de cada una para que el móvil se descargue la pequeña.

```
banner-1920.webp / banner-960.webp     El banner del clan
emblema-800.webp / emblema-160.webp    El escudo, también se usa de icono
textura.webp                           El fondo metálico
normas / guias / academia / guerra     Las cuatro ilustraciones
compartir.jpg                          La imagen que sale al pegar el enlace
icono-192.png / icono-512.png          Iconos de la pantalla de inicio del móvil
```

Qué ilustración va en cada sección se decide en `content/media.json`. El texto alternativo de cada imagen, el que leen los buscadores y los lectores de pantalla, va traducido en cada `content/site.XX.json`.

Para cambiar una imagen basta con sustituir el fichero manteniendo el nombre. Si es una foto nueva, hay que generar los dos tamaños en formato webp.

**Pendiente al cambiar de dirección:** la etiqueta `og:image` de cada `index.html` lleva la dirección completa escrita a mano. Cuando la web pase a Cloudflare hay que actualizarla, si no la vista previa al compartir el enlace seguirá apuntando a la dirección vieja.

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

* [ ] Confirmar si hacen falta más idiomas, ahora hay cinco
* [ ] Que el autor revise la tabla española de cuarteles generales
* [ ] Cifras reales de la cabecera, ahora dicen servidor, temporada, guías, e idiomas
* [ ] Poner el enlace de invitación de Discord, ahora apunta a ninguna parte
* [ ] Confirmar el horario real de la guerra, el contador asume viernes a las 21:00
* [ ] Conectar Cloudflare Pages y quitar la etiqueta MAQUETA de la cabecera
