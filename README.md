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

La web se publica en Cloudflare Pages. Cada cambio que llega a la rama `main` se publica solo en un par de minutos, sin hacer nada más.

Puesta en marcha, una sola vez, y la hace el propietario del repositorio:

1. Crear cuenta gratuita en `dash.cloudflare.com`
2. Entrar en Workers and Pages, pulsar Create, luego Pages, luego Connect to Git
3. Autorizar este repositorio
4. Dejar vacías las opciones de compilación, es un sitio estático sin compilación
5. Guardar

Queda publicada en una dirección del tipo `dsl-770.pages.dev`.

**Después de publicar en Cloudflare** hay que actualizar la etiqueta `og:image` de `index.html`, que lleva la dirección escrita a mano. Si no, la vista previa al compartir el enlace seguirá apuntando a la dirección vieja.

## Panel de edición

En `/admin` hay un panel con formularios para cambiar los textos sin tocar código. Por detrás guarda los cambios en este repositorio, así que todo queda registrado y se puede deshacer.

Para que funcione hacen falta dos cosas más, y las dos son gratis.

### 1. Registrar la aplicación en GitHub

1. Entrar en `github.com/settings/developers`, pestaña OAuth Apps, botón New OAuth App
2. Nombre: `DsL 770 panel`
3. Homepage URL: la dirección de la web
4. Authorization callback URL: `https://dsl770-acceso.TUCUENTA.workers.dev/callback`
5. Al guardar, GitHub da un Client ID y permite generar un Client Secret. Copiar los dos.

### 2. Publicar el servicio de acceso

El código está en `tools/acceso/`. Se publica en Cloudflare Workers:

1. En Cloudflare, Workers and Pages, Create, Worker
2. Nombre: `dsl770-acceso`
3. Pegar el contenido de `tools/acceso/worker.js` y desplegar
4. En Settings, Variables, añadir:
   * `GITHUB_CLIENT_ID` con el identificador
   * `GITHUB_CLIENT_SECRET` con la clave, marcada como secreta
   * `ORIGENES` con la dirección de la web

Por último, en `admin/config.yml` sustituir `https://PENDIENTE.workers.dev` por la dirección real del worker.

A partir de ahí, quien entre en `/admin` con una cuenta de GitHub que tenga permiso en el repositorio puede editar la web.

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
