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
content/site.es.json    Todo el contenido en español, y uno igual por idioma
content/media.json      Qué imagen lleva cada tarjeta
assets/css/base.css     La estructura, común a los cinco diseños
assets/css/tema-N.css   La identidad de cada diseño
assets/js/core.js       Carga el contenido, detecta el idioma, y pinta
index.html              La portada, casi vacía a propósito
d/1 ... d/5             Los cinco diseños en pruebas
```

**Cómo funciona.** Hay una portada con la imagen de cabecera y una rejilla de tarjetas. Cada tarjeta lleva a su sección, y la dirección cambia a algo como `#/basicas`, así que las secciones se pueden enlazar y compartir por separado.

El idioma se detecta solo a partir del navegador del visitante y se recuerda para la próxima visita. Todo el contenido está en los cinco idiomas, así que nadie ve una mezcla.

## Cómo cambiar los textos

Cada fichero `content/site.XX.json` tiene la portada y las páginas. Se edita el texto entre comillas y ya está.

Para añadir un punto a una guía, se añade un elemento más a su lista. La numeración se calcula sola, así que no hay que renumerar nada.

Las secciones marcadas con `"type": "soon"` son las que todavía no tienen contenido. En cuanto se sustituyan por una lista, dejan de mostrar el aviso.

## Cómo cambiar una imagen de tarjeta

En `content/media.json`, el bloque `tarjetas` dice qué imagen usa cada sección. Para cambiarla, se pone el nombre de otra de las que hay en `assets/img/`, sin el tamaño ni la extensión.

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

* [ ] Imagen propia para la tarjeta de Anuncios, ahora usa el emblema
* [ ] Contenido de Normas, Anuncios, y Duelo de alianzas
* [ ] Confirmar si hacen falta más idiomas, ahora hay cinco
* [ ] Que el autor revise la tabla española de cuarteles generales
* [ ] Cifras reales de la cabecera, ahora dicen servidor, temporada, guías, e idiomas
* [ ] Poner el enlace de invitación de Discord, ahora apunta a ninguna parte
* [ ] Confirmar el horario real de la guerra, el contador asume viernes a las 21:00
* [ ] Conectar Cloudflare Pages y quitar la etiqueta MAQUETA de la cabecera
