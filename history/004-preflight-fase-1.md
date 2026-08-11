# 004 · Pre-Flight de la Fase 1

**Archivado el 2026-08-05.** Resultado de la pasada de aceptación (`brief-v0.md` §11) sobre las
12 páginas del sitio. Se archiva porque el estado ya está en verde; queda el método, para que la
próxima pasada no se improvise.

## Cómo se hizo

No página por página a ojo, sino con una auditoría inyectada en un **iframe dimensionado**. Un
iframe responde a las media queries según su propio ancho, así que sirve para medir 375px y
1440px sin redimensionar el navegador ni perder el estado.

Lo que mide en cada página:

- **Contraste** componiendo el alfa real sobre el primer ancestro opaco. No basta con leer la
  clase: `text-white/70` computa como `oklab(… / 0.7)` y un parser ingenuo lo lee como negro.
- **Área táctil** mínima de 44px, sólo en móvil, que es donde la regla aplica.
- **Tamaño mínimo** de 14px, que fija el manual de marca.
- Titulares de sección de más de 8 palabras, botones partidos en dos líneas (sólo escritorio),
  scroll horizontal, guiones largos en texto visible y apariciones de "Next Stop".

Dos cosas que hubo que enseñarle a distinguir, porque generaban falsos positivos:

1. **El texto sobre imagen.** En un hero, el overlay es un `div` hermano con `-z-10`, no un fondo
   de ancestro, así que la búsqueda del fondo opaco llegaba hasta el `body` blanco y reportaba
   1:1 sobre texto blanco perfectamente legible. Se detectan esas secciones y se excluyen; su
   contraste está medido analíticamente contra el peor caso de foto en el componente `Hero`.
2. **Los enlaces que no son botones.** La regla de "no partir en dos líneas" es para botones. Un
   enlace de índice con un título de sección largo puede partirse sin problema.

**El barrido corrió en inglés**, porque el navegador envía `Accept-Language: en` y el proxy
redirige. Es el caso más exigente, porque los textos ingleses son más largos que los españoles,
así que pasar ahí es un resultado más fuerte que pasar en español.

## Lo que encontró

| Página | Hallazgo | Arreglo |
|---|---|---|
| Todas | Los 7 enlaces del pie medían 23px | Constante `ENLACE_PIE` con `min-h-11`, para que el próximo enlace no nazca pequeño |
| `/paquetes/[slug]` | Migas a 18px | `min-h-11`, igual que ya tenía la página de destino |
| `/paquetes/[slug]` | **Precio y CTA bajo el pliegue en móvil** | Ver abajo |
| `/paquetes/[slug]` | Los dos CTA partían su texto en escritorio | Apilados siempre en esa columna |
| `/legal` | Los 6 enlaces del índice a 18px | `min-h-11` |
| `/legal` | Tres guiones largos en texto visible | Sustituidos por coma y paréntesis |
| `/lp/[campana]` | Un titular de 10 palabras | Acortado a 7 |

### El hallazgo que importaba

En la ficha de paquete, el bloque superior medía **1179px sobre un viewport de 812**: el precio y
el CTA quedaban fuera de la primera pantalla, en la página que más convierte del sitio.

Y no cabía de ninguna forma. Migas, titular, galería, precio con su bloque explicativo y dos CTA
son más de lo que entra en una pantalla de teléfono, por mucho que se recorte cada pieza: probando
`text-h2` en el titular seguía ocupando 3 líneas, porque el título tiene 52 caracteres y es el
ejemplo literal del brief.

Así que cedió el **orden**, no el contenido: en móvil el bloque de conversión va antes que la
galería. El visitante ve titular, precio y CTA, y la galería justo debajo. En escritorio, donde
las dos columnas caben, se recupera la disposición original.

Resultado: el CTA termina en 679px de 812 en móvil, y en 628 de 900 en escritorio.

## Lo que quedó fuera del alcance de la regla

- **Los enlaces del navbar miden 19px en escritorio.** No es un incumplimiento: el mínimo de 44px
  es una regla de móvil, y en móvil el nav colapsa a una hamburguesa de 44px cuyo panel da 61px
  por enlace.
- **El foco visible no se pudo disparar** en este entorno de automatización: ni `.focus()` ni el
  hint `focusVisible` activan `:focus-visible` en Chrome headless. Lo que sí se verificó es que la
  regla se sirve en el CSS compilado: `outline: 2px solid` blanco más `box-shadow` de 5px navy. Es
  un anillo doble, así que por construcción uno de los dos contrasta sobre cualquier fondo — el
  blanco sobre navy, el navy sobre superficies claras. **Queda por confirmar a ojo en un navegador
  real**, que es la única forma honesta de darlo por bueno.

## Estado final

Las 12 páginas pasan a 375px y 1440px sin ningún hallazgo, salvo el enlace de índice de `/legal`
que se parte en dos líneas y que no es un botón.

Sitemap con 17 URLs, sin `/design-system`, `/gracias` ni `/lp/`, y `robots.txt` bloqueando las
tres explícitamente.
