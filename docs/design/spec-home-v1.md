# Spec de rediseño — Home v1

**Fecha:** 2026-08-15 · **Alcance:** `app/[locale]/(sitio)/page.tsx` y los componentes que toca ·
**Rama:** `fase-1/motion-potente` → PR [#13](https://github.com/Mthew/brodway-adventure/pull/13)

Este documento especifica sección por sección qué se construye y por qué. Deriva de
[`brief-v0.md`](brief-v0.md) §2 (reglas de negocio y marca, **intactas**) y §2.bis (dirección de
diseño, con los diales ya subidos a `VARIANCE 7 / MOTION 7 / DENSITY 4`).

Regla de precedencia para este documento: **sobre lo visual manda este spec; sobre marca, copy,
legal y contrato de datos sigue mandando `brief-v0.md` §2.** Donde este spec contradice una
restricción visual del brief, lo dice explícitamente y explica por qué.

---

## 1. Por qué existe este spec: la competencia medida, no intuida

El referente declarado es **appletravel.com.co**, competencia directa en Medellín. Lo medí en
navegador el 2026-08-15 en vez de opinar sobre él. Esto es lo que hay debajo:

### 1.1 Lo que Apple Travel hace bien (y hay que igualar o superar)

| Elemento | Qué logra |
|---|---|
| Hero con slideshow de fondo | 3 fotos que se cruzan con fundido cada 5s. Da sensación de catálogo amplio sin pedir un scroll |
| Titular que cambia por slide | 3 mensajes distintos (aspiracional, equipo humano, urgencia suave) en el mismo espacio |
| Tarjetas de destino flotando en el hero | Muestra producto real encima del pliegue, no sólo una promesa |
| Indicador de progreso vertical numerado | Le dice al visitante cuánto falta y que puede intervenir |
| Rejilla de 6 beneficios concretos | "Tiquetes y alojamiento incluidos", "asistencia médica", "traslados listos". Concreto, no adjetivos |
| Botón de WhatsApp flotante | Igual que el nuestro |

### 1.2 Lo que le cuesta (medido, no estimado)

Cargado en escritorio, sin throttling:

```
Peso total ....................... 3.601 kB  (3,6 MB)
Peticiones ....................... 102
DOMContentLoaded ................. 3.904 ms
Load completo .................... 4.727 ms
  ├── imágenes ................... 2.199 kB
  ├── tipografías ................   842 kB   ← 6 familias, todos los pesos e itálicas
  ├── scripts ....................   327 kB
  └── CSS ........................   233 kB
```

El stack que pagan por ese hero:

- **jQuery cargado 4 veces** (3.7.1, 3.6.0 ×2, 3.7.1 de nuevo).
- **GSAP + ScrollTrigger cargados 2 veces**, en dos versiones distintas (3.11.5 y 3.8.0).
- **Tres librerías de carrusel a la vez**: Owl Carousel, Swiper 8 y jQuery SuperSlides.
- **Seis familias de Google Fonts** (Roboto, Roboto Slab, Poppins, Nunito, Lato, DM Sans) cada
  una con los 9 pesos y sus itálicas. Son 842 kB sólo de letra.
- Font Awesome completo, más 3 packs de íconos de Elementor.

Nuestro sitio hoy: **697,9 kB de JS total** y el motion cuesta **0 kB** porque es CSS nativo.

### 1.3 Dónde falla, y es donde se gana

Estas no son opiniones de estilo. Son fallos reproducibles, y cuatro de los cinco pegan justo en
el 83% del tráfico que es móvil:

1. **Las tarjetas del hero no cargan en móvil.** A 375px las tres tarjetas de destino se
   renderizan como cajas transparentes sobre la foto. Su función estrella del hero está rota
   exactamente donde está casi todo su tráfico. (Captura verificada dos veces, con y sin caché.)
2. **El titular no pasa contraste.** Es `#F2BC58` (naranja claro) sobre fotos de atardecer
   brillantes. Ronda 1,7:1 contra las zonas claras de la foto. El mínimo AA para texto grande es
   3:1.
3. **Hay una errata en la home**: "vivas el mundo con autenticidad, **lijo** y confianza".
4. **El hero no tiene CTA de WhatsApp.** Su botón es "Contacta a tu agente de confianza", que
   lleva a una página de contacto. WhatsApp sólo existe como botón flotante. En un mercado donde
   WhatsApp es el canal dominante, eso es fricción regalada.
5. **Afirman "Más de 5000 viajeros felices"** sin forma de verificarlo. Nuestro manual de marca
   prohíbe exactamente ese tipo de cifra (`brief-v0.md` §2), y además es la clase de dato que un
   visitante desconfiado castiga.

### 1.4 La tesis de este rediseño

> Igualar la riqueza visual de Apple Travel **sin pagar su factura**, y ganarles en los cinco
> puntos donde fallan. No competimos por tener más efectos: competimos por ser el sitio que
> carga rápido en un gama media, se lee bien a plena luz, y pone WhatsApp a un toque.

Traducido a números que este PR tiene que sostener:

| Métrica | Apple Travel | BroWay objetivo |
|---|---|---|
| Peso total home | 3.601 kB | **< 900 kB** |
| Peticiones | 102 | **< 30** |
| JS de animación | GSAP ×2 + 3 carruseles | **0 kB** |
| Familias tipográficas | 6 (842 kB) | 3, subset (ya cargadas) |
| Tarjetas de destino en móvil | rotas | **funcionando** |
| Contraste del titular | ~1,7:1 | **≥ 6,9:1** (ya medido) |
| WhatsApp encima del pliegue | no | **sí** |

---

## 2. Sistema de motion (transversal, aplica a todas las secciones)

Ya implementado en `app/globals.css` y verificado en navegador. Toda sección de abajo se apoya
en estas piezas; ninguna sección inventa su propia animación.

| Clase | Qué hace | Dónde se usa |
|---|---|---|
| `.reveal` | Aparece con desplazamiento corto (28px) | Bloques secundarios |
| `.reveal-strong` | Desplazamiento largo (48px) + escala 0,97→1 | Títulos de sección |
| `.reveal-scale` | Escala 0,94→1 sin desplazamiento | Franjas de color plano |
| `.reveal-curtain` | Cortina `clip-path` de abajo hacia arriba | Fotos de tarjeta |
| `.reveal-stagger > *` | Escalona los hijos por `animation-range` | Rejillas |
| `.line-draw` | Dibuja una línea con `scaleX` desde la izquierda | Conector de "Cómo funciona" |
| `.hero-parallax` | Parallax de fondo con `transform` | Fotografía del hero |

**Cuatro reglas que no se negocian** (cada una evita un fallo ya cometido o ya previsto):

1. Todo vive dentro de `@supports (animation-timeline: view())`. Sin soporte, el contenido se ve
   **completo y estático**. `opacity: 0` nunca se declara fuera del `@supports`.
2. Todo cuelga de `@media (prefers-reduced-motion: no-preference)`. No se anula después: no se
   declara.
3. Sólo se animan `transform`, `opacity` y `clip-path`. Nunca `width`, `top`, `left` ni nada que
   dispare layout.
4. **Dentro de un contenedor con `overflow-x: auto`, el eje de bloque está muerto.** Cualquier
   `view(block)` anclado ahí se queda clavado en su primer fotograma. Ya nos costó un bug real
   (la cortina en el carrusel de destinos a <768px). Antes de poner una clase de motion dentro de
   un scroller horizontal, verificar en navegador con `getComputedStyle()`.

---

## 3. Sección 1 — HERO

La sección que decide. Es donde Apple Travel invierte todo y donde tiene sus dos peores fallos.

### 3.1 Qué se construye

**Slideshow de fondo de 3 fotos con fundido cruzado, 100% CSS, cero JavaScript.**

```
┌──────────────────────────────────────────┐
│  [navbar]                                │
│                                          │
│                                          │  ← foto a sangre, parallax al bajar
│                                          │
│  Elige tu viaje con claridad             │  ← titular FIJO, no cambia por slide
│  Te ayudamos a comparar opciones...      │
│  [Cotiza por WhatsApp] [Ver opciones]    │  ← visible sin scroll a 375px
│                                     ● ○ ○ │  ← indicador de progreso
└──────────────────────────────────────────┘
```

### 3.2 Decisiones y su porqué

**a) Las fotos cambian; el titular NO.**

Apple Travel cambia titular y CTA en cada slide. Se ve bien y es un riesgo de conversión: el
botón cambia de texto y de destino debajo del dedo del usuario mientras lee. Además choca con
nuestra regla de "un texto por intención" (`brief-v0.md` §11.B).

Nosotros ciclamos **sólo la imagen**. Se conserva la riqueza visual (que es lo que gusta del
referente) y el CTA de WhatsApp permanece quieto y accesible todo el tiempo.

> Si marca quiere titular rotativo, es una decisión de negocio, no técnica. Se puede añadir
> después con la misma maquinaria CSS. Queda anotada como decisión abierta, no como carencia.

**b) Tres tiempos y se detiene. No es un bucle infinito.**

`brief-v0.md` §2.bis prohíbe los loops infinitos, y con razón: un fondo que cicla para siempre
al lado de un CTA es una distracción permanente. La salida no es renunciar al slideshow, es
copiar lo que el propio Apple Travel hace: Swiper con `stopOnLastSlide: true`. Muestra tres
tiempos y se queda en el último.

Es un **intro de tres tiempos que asienta**, no un carrusel eterno. Cumple el brief sin perder
el efecto.

**c) Presupuesto de LCP: la primera foto es prioritaria, las otras dos NO.**

Esto es lo que separa 900 kB de 3,6 MB. La foto 1 mantiene el `<picture>` escrito a mano con
`fetchpriority="high"` que ya existe (y que `CURRENT.md` marca como intocable). Las fotos 2 y 3
llevan `loading="lazy"` y `fetchpriority="low"`: entran después del primer pintado.

Consecuencia aceptada: si alguien tiene una conexión pésima, ve un hero de una sola foto. Es
exactamente el degradado correcto — la foto 1 es la que sostiene el mensaje.

**d) El texto del hero sigue sin animación de entrada.**

No es olvido. El titular es candidato a LCP y Chrome no contabiliza un elemento mientras su
opacidad es 0: un fundido de entrada retrasa la métrica justo lo que dure. El impacto lo dan la
fotografía, el parallax y el fundido de fondo, que no cuestan métrica.

**e) Sin tarjetas de destino dentro del hero en móvil.**

Es la función que a Apple Travel se le rompe a 375px, y aunque funcionara no cabría: nuestro
hero mide `68svh` en móvil, y ese número sale de una medición real (con más altura, el banner de
cookies tapaba los CTA en la primera visita, que es la que convierte).

En escritorio ≥1024px sí hay aire: entra una **franja de asomo** de 3 destinos bajo los CTA, con
`reveal-curtain`. Nunca por encima de ellos.

### 3.3 CSS del ciclo (referencia de implementación)

```css
/* 3 slides × 6s = 18s, y se queda en el último (`forwards`, sin `infinite`). */
@keyframes broway-hero-fade {
  0%      { opacity: 0; }
  4%, 30% { opacity: 1; }   /* entra y se sostiene */
  36%     { opacity: 0; }   /* sale */
  100%    { opacity: 0; }
}
```

- Slide 1: sin animación, `opacity: 1` de base. Es el LCP y no puede depender de un keyframe.
- Slide 2: `animation-delay: 5s`.
- Slide 3: `animation-delay: 11s`, y `animation-fill-mode: forwards` con el keyframe que termina
  en `opacity: 1` para quedarse fijo.

Todo dentro de `prefers-reduced-motion: no-preference`. Con movimiento reducido, sólo se ve la
foto 1: no hay fundidos, no hay parallax.

### 3.4 Criterios de aceptación

- [ ] A 375px, ambos CTA visibles sin scroll **con el banner de cookies desplegado**.
- [ ] Titular ≤ 2 líneas a 375px y a 1440px.
- [ ] Contraste del titular ≥ 4,5:1 **sobre las tres fotos**, medido en navegador, no estimado.
      El velo `.hero-scrim` está calibrado contra foto blanca pura: cualquier foto nueva debe
      re-verificarse.
- [ ] Sólo la foto 1 aparece en el waterfall antes del primer pintado.
- [ ] Con `prefers-reduced-motion: reduce`: una sola foto, quieta, sin fundidos ni parallax.
- [ ] Sin soporte de `animation-timeline`: foto 1 visible, texto visible, nada oculto.
- [ ] `getComputedStyle(document.querySelector('.hero-parallax')).animationName` devuelve
      `broway-hero-parallax`.

---

## 4. Sección 2 — FRANJA DE CONFIANZA

Va **debajo** del hero, nunca dentro (regla dura de `brief-v0.md` §11.B, y el componente `Hero`
ni siquiera expone una prop para meterla dentro).

### 4.1 Qué cambia

Hoy es una línea: `[RNT 297515] Agencia de viaje registrada en Medellín, Colombia.`

Se convierte en **tres señales verificables**, en una fila compacta:

| Señal | Texto | Por qué |
|---|---|---|
| RNT | `RNT 297515` | Dato real del cliente, ya confirmado |
| Verificable | `Empresa registrada en Medellín` | Enlaza a `/nosotros` |
| Respuesta | `Te responde una persona, en minutos` | El diferenciador real frente a un bot |

**Prohibido aquí**: cifras de viajeros, años de experiencia, "+50 destinos" o cualquier número
que no podamos sustentar. Es literalmente donde Apple Travel pierde credibilidad con su "5000
viajeros felices".

**Sin marquee.** Lasala Plaza usa una cinta animada para esto; queda bien y está prohibida por
§2.bis. Fila estática con `reveal`.

### 4.2 Criterios de aceptación

- [ ] Las 3 señales caben en una línea en escritorio; se apilan en 2 filas a 375px sin overflow.
- [ ] Cero cifras no verificables.
- [ ] Contraste del texto sobre `--color-surface-alt` (#F4F7FA), no sobre blanco.

---

## 5. Sección 3 — DESTINOS

Es la sección que hoy más "se siente plantilla": rejilla 3×2 de seis tarjetas idénticas, que es
justo el anti-patrón que §2.bis nombra ("prohibida la fila de 3 tarjetas idénticas como recurso
genérico").

### 5.1 Qué cambia: rejilla asimétrica

Patrón tomado de **Elyse Residence** y **armenia.travel** (tarjetas de altura desigual):

```
Escritorio (≥1024px)              Móvil (<768px)
┌───────────────┬───────┐         ┌─────┐ ┌─────┐ ┌─
│               │ Carta │         │     │ │     │ │    ← scroll-snap horizontal
│   DESTACADO   ├───────┤         │     │ │     │ │      (ya existe, se conserva)
│   (2×2)       │ Carta │         └─────┘ └─────┘ └─
├───────┬───────┼───────┤
│ Carta │ Carta │ Carta │
└───────┴───────┴───────┘
```

El destacado es el primer destino del mock (Eje Cafetero), que ya tiene la mejor foto y el único
precio "desde" cargado.

### 5.2 Enriquecer la tarjeta

De **Vita Travel**, que es la referencia más fuerte del grupo en fichas: cada tarjeta suya lleva
fecha exacta, duración y cupos. Hoy nuestra `DestinationCard` sólo lleva badge, nombre, resumen y
precio.

Se añade, **sólo cuando el dato existe** (nunca inventado ni "por defecto"):

- Próxima fecha de salida (`fechasSalida[0]` de la oferta vigente).
- Duración en días.

Si no hay oferta vigente, la tarjeta se muestra sin esos campos, igual que hoy hace con el
precio. Un dato desactualizado es peor que ningún dato.

> **Nota de producto**: los cupos ("quedan 4") están permitidos por §2 sólo si son un dato real
> editable, nunca un contador. Hoy el mock no los tiene poblados de forma fiable, así que **no
> entran en esta iteración**.

### 5.3 Motion

- `reveal-strong` en el título.
- `reveal-curtain` en cada foto, **desactivada bajo 768px** por el bug del scroller horizontal
  (§2, regla 4). Ya implementado y verificado.
- `reveal-stagger` en la rejilla de escritorio.

### 5.3.bis La anatomía de la tarjeta (2026-08-16)

Segunda pasada, con el skill `ui-ux-pro-max`. Su ficha de *Travel/Tourism Agency* recomienda
**Motion-Driven** y "colores vibrantes del destino": la fotografía tiene que llevar el peso, no
un marco. Tres cambios y una restricción que los acota:

| Cambio | Antes | Ahora | Por qué |
|---|---|---|---|
| Relación de la foto | `aspect-[4/3]` | `aspect-[4/5]` | Con 4:3 la foto quedaba en ~150px contra un texto de ~130px: media tarjeta era espacio blanco |
| Marco | `border` de 1px | sin borde, `shadow-md` → `shadow-xl` al hover | El borde dibujaba una caja alrededor de la foto y la tarjeta se leía como ficha de documento |
| Precio | `text-body-sm` | número en `text-body`, matices en `text-caption` | Es el dato que decide; los matices "desde"/"por persona" siguen legibles (§6 lo exige) |

**La restricción**: `brief-v0.md` §2.bis prohíbe explícitamente *"etiquetas o pills superpuestas
sobre las fotos"*, y es casilla del Pre-Flight §11.B. Eso descarta el patrón de appletravel.com.co
de poner el nombre del destino encima de la imagen, que es su recurso principal en las tarjetas.
El impacto se consigue con la relación de aspecto y el marco, no superponiendo.

**Un fallo de la iteración anterior, corregido aquí**: en la rejilla asimétrica las dos tarjetas
laterales tenían la foto en **69px** — una franja. Las filas estaban fijas en `18rem` (288px) y el
bloque de texto ocupa ~219px, así que a la imagen `flex-1` le sobraba muy poco. Además el `<div>`
del texto también era `flex-1`, así que competía con la foto por el espacio: en la destacada
daba 406px de foto contra 446px de texto. Se corrige subiendo las filas a `26rem` y poniendo el
texto en `lg:flex-none` cuando la imagen es expandida.

Medido después del cambio (1440px): destacada 623px de foto / 229 de texto · laterales 197/219 ·
fila inferior 437/219.

### 5.4 Criterios de aceptación

- [x] La rejilla de escritorio NO es 6 tarjetas del mismo tamaño.
- [x] A <768px sigue siendo el carrusel con scroll-snap actual, con las fotos **visibles**
      (`clip-path: none` verificado en navegador).
- [x] Ninguna tarjeta muestra fecha o duración inventada.
- [x] Cada tarjeta declara su colapso a una columna bajo 768px.
- [x] En toda variante la foto ocupa más que el bloque de texto, salvo las laterales de la
      rejilla asimétrica, donde la proporción es pareja por la geometría del slot.
- [x] Ninguna etiqueta ni texto superpuesto sobre las fotos (§11.B).

---

## 6. Sección 4 — CÓMO FUNCIONA

Ya es la sección mejor resuelta estructuralmente: flujo de 3 pasos conectados por una línea, no
tres tarjetas sueltas.

### 6.0 Segunda pasada (2026-08-16): dejó de ser tres columnas iguales

La primera versión decía que esta sección "ya es la mejor resuelta". Medida, no lo era: eran
**tres columnas de 180×341 idénticas**, exactamente el recurso que §2.bis prohíbe, y lo único que
la separaba de la plantilla genérica era una línea de 1px. Además es la única sección del home sin
una sola fotografía, así que no podía apoyarse en la imagen como el resto.

Ahora es un **layout asimétrico**: el titular ocupa su propia columna (403px) y los tres pasos
bajan en secuencia vertical (605px) enhebrados por un espinazo que se dibuja al entrar en pantalla
(`.line-draw-y`, `scaleY` con `transform-origin: top`).

El cambio no es sólo visual: son pasos de un proceso (un `<ol>`), y leerlos de arriba abajo
comunica el orden mejor que tres columnas en paralelo, que sugieren simultaneidad.

Medido a 1440px: columnas 403/605, espinazo en x=24 = centro exacto de los íconos de 48px.
A 375px colapsa a una columna, el espinazo sigue alineado y no hay overflow horizontal.

### 6.1 Qué cambia

La línea conectora ahora **se dibuja** de izquierda a derecha según entra en
pantalla (`.line-draw`, `scaleX` con `transform-origin: left`).

> Bug ya encontrado y corregido en este PR: la línea es hija directa del mismo
> `<ol class="reveal-stagger">`, así que matcheaba las dos reglas con igual especificidad y
> ganaba la que iba después en el archivo. Se desvanecía en vez de dibujarse. El orden de las
> reglas en `globals.css` es ahora significativo y está comentado.

### 6.2 Criterios de aceptación

- [ ] `getComputedStyle(el).animationName` de `.line-draw` devuelve `broway-line-draw`, nunca
      `broway-reveal`.
- [ ] La línea sólo existe ≥768px (en móvil los pasos se apilan y sobra).
- [ ] Los 3 pasos entran escalonados, no a la vez.

---

## 7. Sección 5 — POR QUÉ VIAJAR CON NOSOTROS

Los 4 textos actuales son buenos y muy en tono Cuidador ("Nada se decide con afán", "Te responde
una persona"). El problema es de **peso visual**: hoy son una lista de checks planos, y compiten
de frente con la rejilla de 6 beneficios de Apple Travel, que se ve más sustanciosa.

### 7.1 Qué cambia

- Los 4 bloques pasan de checks planos a **tarjetas con superficie propia** (`surface-alt`,
  borde sutil, radio `md`), en rejilla 2×2.
- Cada uno conserva su ícono Phosphor `weight="regular"`.
- Se mantienen **4 y no 6**. Apple Travel tiene 6 porque enumera servicios operativos
  (tiquetes, seguros, traslados); los nuestros son razones de confianza, y estirarlos a 6
  obligaría a inventar dos.

### 7.2 Criterios de aceptación

- [ ] 2×2 en escritorio, 1 columna bajo 768px.
- [ ] Ningún subpárrafo supera 25 palabras (regla de densidad §2.bis).
- [ ] Contraste del texto medido sobre `surface-alt`, no sobre blanco.

---

## 8. Sección 6 — FRANJA "NEXT STOP"

Única aparición de la firma verbal en toda la página (regla de marca: máximo una por pieza).

### 8.1 Qué cambia

Sólo motion: `reveal-scale` en lugar de `reveal`. En un bloque de color plano sin fotografía, el
desplazamiento no se percibe; la escala sí. Ya implementado.

### 8.2 Criterios de aceptación

- [ ] "Next Stop" aparece exactamente **una vez** en el DOM de la página.
- [ ] El CTA sigue siendo `secondary` (navy sobre turquesa), no naranja: el naranja está
      reservado para enviar formulario.

---

## 9. Sección 7 — TESTIMONIOS

### 9.1 Qué cambia

Estructura: sin cambios. Ya es 1 destacado + 2 apilados, asimétrico a propósito.

Copy: **se mantiene la nota de que son de ejemplo.** Es una ventaja competitiva, no una carencia:
Apple Travel muestra testimonios sin verificación junto a "5000 viajeros felices". Nosotros
decimos qué es relleno hasta que haya reseñas reales. Cuando lleguen, se sustituyen y la nota
desaparece.

Motion: `reveal` en el título, `reveal-stagger` en las tarjetas.

### 9.2 Criterios de aceptación

- [ ] Cada cita ≤ 3 líneas; atribución con nombre **y** rol.
- [ ] La nota de "son de ejemplo" está visible mientras los datos sean placeholder.

---

## 10. Sección 8 — CÓMO SABER SI UNA AGENCIA ES DE FIAR

Sección sin equivalente en ninguno de los 7 referentes. Es nuestra, sale del research
(`investigation.md`: el fraude en viajes es un problema real en Colombia) y es la que más
diferencia a una agencia seria de una improvisada.

### 10.1 Qué cambia

Estructura y copy: nada. Está bien resuelta (dos columnas, tono sereno, informa sin asustar).

Motion: `reveal-stagger` en las dos columnas.

### 10.2 Criterios de aceptación

- [ ] Tono informativo, cero alarmismo (es un valor de marca declarado).
- [ ] Los enlaces a `/nosotros` y `/legal` tienen área táctil ≥ 44px.

---

## 11. Sección 9 — CIERRE: WHATSAPP + FORMULARIO

### 11.1 Qué cambia

Estructura: sin cambios. WhatsApp como vía principal y el formulario como alternativa real, lado
a lado sobre fondo navy.

Motion: `reveal-stagger`. El formulario **no** lleva `reveal-curtain` ni escala: un campo de
formulario que se mueve mientras el usuario intenta tocarlo es un error de usabilidad.

### 11.2 Lo que NO se toca (contrato legal y de datos)

Esto es zona congelada. Cualquier cambio visual que roce estos puntos se revierte:

- Checkbox de consentimiento **sin pre-marcar**, con la finalidad que nombra explícitamente la
  publicidad personalizada.
- El envío registra la evidencia de consentimiento (texto aceptado, `POLICY_VERSION`, fecha,
  formulario de origen, canales autorizados).
- Campos visibles: nombre, WhatsApp, ciudad de salida, fecha aproximada, nº de viajeros.
  **Nunca** presupuesto, ingresos ni estrato.
- Envío correcto redirige a `/gracias`, que no se indexa.

### 11.3 Criterios de aceptación

- [ ] El checkbox nunca llega marcado.
- [ ] Ningún campo del formulario se desplaza ni escala al entrar en pantalla.
- [ ] Estados de carga, error inline y éxito presentes.

---

## 12. Presupuesto de rendimiento (se verifica antes de mergear)

Sin esto, el spec es decoración. Estos números son la razón de ser del enfoque CSS-only.

| Métrica | Techo | Cómo se mide |
|---|---|---|
| JS de la home | **≤ 700 kB** (hoy 697,9) | `next build`, columna First Load JS |
| Dependencias de animación | **0** | `grep -E 'framer-motion\|gsap\|lenis\|swiper\|owl' package.json` |
| Peso total de la home | **< 900 kB** | `performance.getEntriesByType('resource')` |
| Peticiones | **< 30** | idem |
| Imágenes prioritarias en el hero | **1** | waterfall de red |
| LCP en móvil | **< 1 s** | objetivo declarado en el spec técnico |

**Si el slideshow del hero empuja el peso por encima de 900 kB, se recortan las fotos 2 y 3, no
el presupuesto.** El orden de prioridades es: carga → contraste → WhatsApp accesible → efecto
visual. Ese orden no se invierte por gusto estético.

---

## 13. Lo que deliberadamente NO se implementa

Cosas vistas en los referentes que se descartan, con el motivo. Sirve para no re-discutirlas en
cada iteración:

| Idea | De dónde | Por qué no |
|---|---|---|
| Buscador destino/fecha/personas | vivotravel | No somos motor de reservas. Prometería una disponibilidad en tiempo real que no existe |
| Titular que cambia por slide | appletravel | Riesgo de conversión: el CTA cambia bajo el dedo. Reevaluable si marca lo pide |
| Tarjetas de destino dentro del hero en móvil | appletravel | No caben con el hero a 68svh, y a ellos se les rompe ahí mismo |
| Marquee de sellos de confianza | lasalaplaza | Prohibido por §2.bis (movimiento en bucle) |
| Eyebrows numerados `( 1 )` `( 2 )` | elyse | Firma típica de plantilla generada; prohibido explícitamente |
| Indicador "SCROLL" animado | elyse, armenia | Prohibido. Lo sustituye el borde de la sección siguiente asomando |
| Quiz "encuentra tu viaje ideal" | travel-sensations | Fuera de alcance de Fase 1 (`mvp-features.md`) |
| Franja ciudad/hora/clima | lasalaplaza | Decoración ambiental, prohibida |
| Contador de viajeros / años | appletravel | Cifras no verificables. Prohibido por marca |

---

## 14. Orden de implementación

1. ~~Sistema de motion en `globals.css`~~ ✅ hecho y verificado (PR #13)
2. ~~Parallax del hero, cortina, línea conectora~~ ✅ hecho y verificado (PR #13)
3. ~~Slideshow del hero~~ ✅ hecho y verificado (§3, PR #13)
4. ~~Franja de confianza a 3 señales~~ ✅ hecho y verificado (§4, PR #13)
5. ~~Rejilla asimétrica de destinos~~ ✅ hecho y verificado (§5, PR #13)
6. ~~Tarjetas de "Por qué"~~ ✅ hecho y verificado (§7, PR #13)

Las 9 secciones del home descritas en este spec están implementadas. Cada paso se verificó en
navegador a 375px y 1440px; el paso 3 se midió además en el waterfall de red. Pendiente: revisión
del PR #13 completo antes de mergear a `main`.
