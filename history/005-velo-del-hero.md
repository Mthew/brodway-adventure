# 005 · El velo del hero: de navy opaco a negro neutro

**Fecha:** 2026-08-16 · **Rama:** `fase-1/hero-impacto`

Archivado de `CURRENT.md` porque ya no describe una decisión abierta: la medición está hecha y
los valores viven en `app/globals.css`. Se conserva porque explica **por qué** las paradas del
degradado son las que son, y ese razonamiento no cabe en un comentario corto.

## El punto de partida era una premisa falsa

El encargo fue "los referentes no ponen overlay sobre la foto, por eso su hero pega más; quítalo".
Medidos en el navegador, los dos **sí** ponen:

| Sitio | Velo real |
|---|---|
| vivotravel.com.co | `bg-black/40` plano sobre toda la foto **+** degradado inferior de 192px a `slate-900` |
| appletravel.com.co | `::before` con `linear-gradient(150deg, #000 0%, rgba(179,179,179,.25) 100%)` a `opacity: .5` |

Quitar el velo no era una opción: rompe el 4.5:1 de AA, que es requisito del spec y prioridad 1
del skill `ui-ux-pro-max`. Pero el síntoma que motivó el encargo era real. La causa era otra.

## Las dos causas reales

**1. Teñido en vez de neutro.** El nuestro era navy (`--color-brand-navy`). Un lavado navy sobre
una foto de montaña verde no la oscurece: le cambia el matiz y la vuelve azul-gris, así que daba
igual qué foto se pusiera debajo. El negro sólo baja la luminosidad y respeta el color propio de
la imagen. Ésa es la razón perceptual por la que el velo ajeno "parece que no existe".

**2. Llegaba a opaco.** La primera parada era `var(--color-brand-navy)` sin alfa, es decir navy
puro al 0% de altura. La franja inferior del hero no era una foto velada: era un rectángulo de
color plano, sin un solo pixel de fotografía. Ninguno de los dos referentes pasa del 50% en
ningún punto de su imagen.

## La salida: concentrar el velo, no quitarlo

Negro neutro, nunca opaco, y con las paradas puestas donde vive el texto para que la mitad
superior de la foto quede casi limpia.

**Un intento descartado, y vale la pena recordarlo:** el primer diseño fue una diagonal
`to top right`, aprovechando que en escritorio el texto vive abajo a la izquierda. Medida,
falla — el bloque de texto llega hasta el 59% del ancho y ahí la diagonal ya sólo daba 0.34 de
alfa: **2.38:1 en el titular y 2.84:1 en el subtítulo** sobre el peor caso. El velo vertical
protege todo el ancho de la franja de texto, que es lo que hace falta, y el impacto se recupera
igual porque arriba no tapa nada.

## Por qué hay paradas distintas en móvil y escritorio

No es refinamiento estético, es geometría. El hero móvil mide 68svh (552px en un iPhone de 812) y
los dos CTA se apilan en vertical, así que el bloque de texto **empieza al 72% de la altura**. Con
las paradas de escritorio el titular caía a 1.69:1. En escritorio el hero mide 88svh y el texto
arranca al 50%, así que el velo puede soltarse mucho antes.

## El peor caso del sitio no es la home

Es la cabecera de `/destinos/[slug]`: mide 62svh en vez de 88svh, así que su **miga de pan**
arranca al 56% de la altura, más arriba que ningún otro texto sobre foto del sitio. Con las
paradas pensadas sólo para la home caía a 3.48:1. La parada del 58% en escritorio existe por esa
página, no por la home.

Ya era el peor caso antes de este rediseño (el CSS anterior lo documentaba en 6.36:1).

## Medición final

Todo sobre el peor caso posible: **foto blanca pura debajo**, que es la garantía que este repo se
fijó para no tener que re-verificar cada vez que marketing cambia una imagen.

| Página | Viewport | Peor elemento | Ratio | Exige |
|---|---|---|---|---|
| `/` | 375px | titular (37.5px) | 4.87:1 | 3:1 |
| `/` | 1440px | titular (72px) | 6.27:1 | 3:1 |
| `/destinos/[slug]` | 375px | miga (15px) | 6.57:1 | 4.5:1 |
| `/destinos/[slug]` | 1440px | miga (15px) | 5.49:1 | 4.5:1 |

Cero fallos en las cuatro combinaciones. Método: leer el degradado ya computado del navegador,
interpolar el alfa en la posición vertical exacta de cada elemento de texto, y componer contra
blanco puro. No se estimó a ojo — el cálculo a ojo ya se equivocó una vez en este archivo.

**Al mover cualquier parada hay que repetir las cuatro medidas, no sólo la de la home.**
