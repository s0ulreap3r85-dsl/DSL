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

## Aviso importante sobre el panel

El panel guarda **solo los campos declarados** en `admin/config.yml`. Si el contenido tiene un campo que no está declarado ahí, desaparece la primera vez que alguien pulse guardar, y sin avisar de nada.

Por eso, cada vez que se añada un campo nuevo al contenido hay que declararlo también en el panel. Para comprobarlo:

```
python3 tools/revisar-campos.py
```

Si algo falta, lo dice y explica dónde se arregla.

## Cómo cambiar los textos

Cada fichero `content/site.XX.json` tiene la portada y las páginas. Se edita el texto entre comillas y ya está.

Para añadir un punto a una guía, se añade un elemento más a su lista. La numeración se calcula sola, así que no hay que renumerar nada.

Las secciones marcadas con `"type": "soon"` son las que todavía no tienen contenido. En cuanto se sustituyan por una lista, dejan de mostrar el aviso.

## Cómo cambiar una imagen de tarjeta

Desde el panel de edición, en el apartado Imágenes.

**Dos avisos que importan.**

No renombres ni edites imágenes desde la interfaz web de GitHub. GitHub trata esos ficheros como texto y los destruye, dejándolos en dos bytes. Si hay que renombrar una imagen, se borra y se vuelve a subir con el nombre bueno, o se avisa para hacerlo bien.

Sube imágenes ya recortadas y de tamaño razonable. El panel guarda el fichero tal cual, sin encogerlo. Una foto de 3 MB en una tarjeta hace que la web tarde en abrir en el móvil. Lo ideal son imágenes cuadradas de unos 800 píxeles. Se puede elegir una de las que ya están subidas o subir una nueva. Lo mejor son imágenes cuadradas.

A mano se hace en `content/tarjetas.json`, que guarda la ruta de la imagen de cada tarjeta. Si la ruta acaba en `-800.webp`, la web busca sola la versión de 400 para los móviles.

## Cómo se publica

La web está en Cloudflare, en **https://dsl.dsl770.workers.dev**

Cada cambio que llega a la rama `main` se publica solo en un par de minutos. No hay que hacer nada más.

El fichero `wrangler.toml` dice cómo se monta: el worker de `worker/index.js` sirve los ficheros del sitio y además atiende las dos rutas del panel de edición. El fichero `.assetsignore` marca lo que no se publica, como el README o las herramientas.

## Panel de edición

En **https://dsl.dsl770.workers.dev/admin** hay un panel con formularios para cambiar los textos sin tocar código. Por detrás guarda los cambios en este repositorio, así que todo queda registrado y se puede deshacer.

Para que deje entrar falta un paso, que solo se hace una vez.

### Registrar la aplicación en GitHub

1. Entrar en `github.com/settings/developers` con la cuenta **s0ulreap3r85-dsl**, pestaña OAuth Apps, botón New OAuth App
2. Application name: `DsL 770 panel`
3. Homepage URL: `https://dsl.dsl770.workers.dev`
4. Authorization callback URL: `https://dsl.dsl770.workers.dev/callback`
5. Guardar, copiar el Client ID, y generar un Client Secret

### Guardar las credenciales en Cloudflare

En el panel de Cloudflare, dentro del proyecto `dsl`, en Settings, apartado de variables:

* `GITHUB_CLIENT_ID` con el identificador, como texto normal
* `GITHUB_CLIENT_SECRET` con la clave, marcada como secreta
* `ORIGENES` con `https://dsl.dsl770.workers.dev`

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
