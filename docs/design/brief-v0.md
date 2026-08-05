# BroWay Adventures — Brief de diseño frontend (v0 / Lovable)

Prompts listos para generar el frontend del MVP (Fase 1). Derivado de
[`spec-tecnica.md`](../architecture/spec-tecnica.md),
[`mvp-features.md`](../product/mvp-features.md),
[`fases-entrega.md`](../product/fases-entrega.md) y
[`brand/manual-de-marca.pdf`](../brand/manual-de-marca.pdf).

---

## 0. Qué herramienta usar

**Recomendación: v0 (Vercel).** No es indiferente:

| | v0 | Lovable |
|---|---|---|
| Output nativo | Next.js **App Router** + Tailwind + shadcn/ui | Vite + React SPA (Next.js parcial/experimental) |
| Alineación de versiones | mismo ecosistema Vercel que Next.js 16 | desfase mayor |
| Coincide con `spec-tecnica.md` §2.1 | ✅ exacto | ❌ habría que reescribir routing, SSG/ISR y `next/image` |
| `next/image`, Metadata API, SSG | nativo | no |
| Deploy | Vercel (el hosting ya definido) | Netlify/propio |

El stack del proyecto ya está cerrado en Next.js App Router + Vercel. Lovable obligaría a portar
todo el routing y el renderizado — trabajo tirado. **Usa v0.** Si por alguna razón se usa Lovable,
sirve solo para explorar dirección visual, y el código se reescribe.

## 1. Cómo usar este brief

**No pegues todo de un golpe.** v0 degrada con prompts que piden 8 páginas: inventa componentes
duplicados y pierde los tokens. La secuencia correcta:

1. **Prompt 0** (tokens + componentes base) → primero, siempre. Es el checklist §7.4-7.5 del spec.
2. **Prompt 1** (layout: navbar, footer, WhatsApp flotante) → sobre los tokens ya aprobados.
3. **Prompts 2-6** (páginas) → uno por chat/iteración, reusando lo anterior.

En cada prompt nuevo, **pega antes el bloque "Reglas globales" (§2) y el bloque "Dirección de
diseño" (§2.bis)**. v0 no recuerda contexto entre chats distintos: §2 evita que escriba lo que
la marca prohíbe, §2.bis evita que entregue una plantilla genérica. Los dos son igual de
necesarios y §11 verifica ambos.

---

## 2. Reglas globales — pegar al inicio de CADA prompt

```text
CONTEXTO DE PROYECTO — BroWay Adventures

Agencia de viajes en Medellín, Colombia. El sitio NO es e-commerce ni motor de reservas:
es una máquina de captación de leads. El objetivo único es que el visitante escriba por
WhatsApp o deje un formulario corto. No hay carrito, no hay checkout, no hay inventario
en tiempo real.

STACK OBLIGATORIO
- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui.
- Server Components por defecto; "use client" SOLO donde haya interacción real.

REGLAS DE VERSIÓN — NO uses patrones viejos:
- Tailwind v4 se configura EN CSS, no en JS. NO generes tailwind.config.ts ni
  tailwind.config.js. NO uses @tailwind base/components/utilities. Usa:
      @import "tailwindcss";
      @theme { --color-brand-navy: #003062; ... }
  Los tokens declarados en @theme ya quedan disponibles como clase utilitaria
  (bg-brand-navy) y como var(--color-brand-navy). No los dupliques.
- Next.js 16: `params` y `searchParams` son PROMESAS. Toda página/layout que los use es
  async y hace await. El acceso síncrono ya no existe:
      export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
        const { locale } = await params;
  Lo mismo aplica a cookies() y headers().
- Next.js 16: el archivo de middleware se llama `proxy.ts`, no `middleware.ts`.
- React 19: `ref` es una prop normal. NO uses forwardRef.
- Imágenes con next/image siempre (nunca <img>). Usa placeholders de picsum.photos o
  similares con dimensiones explícitas.
- Sin librerías de animación pesadas (nada de framer-motion), sin librerías de carrusel,
  sin date-pickers. Si necesitas un carrusel, usa scroll-snap con CSS puro.
- Objetivo de rendimiento: LCP < 1s en móvil. El 83% del tráfico es móvil. Diseña
  MOBILE-FIRST de verdad: la vista de 375px es la principal, desktop es la adaptación.

IDENTIDAD DE MARCA
Nombre oficial: "BroWay Adventures" — B y W en mayúscula, siempre junto. NUNCA escribas
"Bro Way", "Broway", "Bro-Way", "BRO WAY", "Brodway" ni "Broadway".

Colores exactos (extraídos del logo oficial):
  --brand-navy:      #003062   (primario: fondos oscuros, títulos, texto sobre blanco)
  --brand-turquoise: #00AAC3   (secundario: acentos, íconos, subrayados, bordes activos)
  --brand-orange:    #FF6A03   (acento: CTA primario, destacados)
  --whatsapp:        #25D366   (SOLO el botón de WhatsApp, por reconocimiento del canal)

REGLAS DE CONTRASTE — verificadas, no negociables (requisito AA del spec):
  ❌ Naranja #FF6A03 con texto BLANCO = 2.87:1 → FALLA AA. No lo uses nunca.
  ✅ Naranja #FF6A03 con texto NAVY #003062 = 4.57:1 → botón CTA primario correcto.
  ❌ Verde WhatsApp #25D366 con texto blanco = 1.98:1 → FALLA. Usa texto navy (6.62:1).
  ✅ Navy #003062 con texto blanco = 13.13:1 → botón secundario / secciones oscuras.
  ✅ Turquesa #00AAC3 con texto navy = 4.71:1.
  ⚠️ Turquesa y naranja NO sirven como color de texto pequeño sobre blanco (2.8:1).
     Para texto naranja sobre blanco usa #C24A00; para turquesa usa #006B7D.

VERIFICA CONTRA LA SUPERFICIE REAL, NO SÓLO CONTRA BLANCO.
Este brief decía antes #007D91 para el turquesa de texto, y es correcto sobre
blanco (4.84:1). Pero el badge "Nacional" lo pinta sobre un tinte del propio
turquesa al 10%, que es MÁS CLARO que el blanco de al lado: ahí rendía 4.35:1 y
fallaba. Lo mismo pasaba con #B26A00 sobre su tinte (3.74:1).
Antes de dar por buena una combinación, mídela sobre las tres superficies claras
del sistema: blanco, #F4F7FA y el tinte al 10% del propio color.
Valores ya corregidos y medidos en `app/globals.css`.

Neutros: define una escala de grises fría (matiz azulado) coherente con el navy, no
grises puros. Fondo base blanco #FFFFFF, superficie alterna muy clara (#F4F7FA aprox).

Tipografía: el manual de marca NO especifica tipografías. Usa una sans-serif geométrica
legible de Google Fonts para todo (recomendado: "Outfit" o "Plus Jakarta Sans" para
títulos, "Inter" para cuerpo). Márcalo en el código con un comentario
// TODO: confirmar tipografía oficial con el dueño de marca.

VOZ Y TONO (del manual de marca)
Clara, Cercana, Serena, Inspiradora, Honesta, Útil. Habla de "tú". Arquetipo: el Cuidador
(protege, orienta, reduce la incertidumbre) + el Explorador. La regla maestra es: "hablar
como una persona que conoce el camino, no como una marca que necesita demostrar que lo
sabe todo".

Copy en ESPAÑOL (Colombia), nivel de lectura 5º-7º grado: frases cortas, sin tecnicismos,
sin jerga. Nada de anglicismos innecesarios.

PALABRAS RECOMENDADAS: claridad, acompañamiento, próxima parada, opciones, camino,
descubrir, elegir, preparar, experiencia, confianza, tranquilidad, "viajar a tu manera".

PROHIBIDO ESCRIBIR (el manual lo veta explícitamente):
  ✗ "la mejor oferta"           ✗ "precio garantizado"
  ✗ "viaja sin preocupaciones"  ✗ "cumplimos tus sueños"
  ✗ "últimos cupos" como recurso permanente
  ✗ "te resolvemos todo"        ✗ "financiamos" (no se otorga crédito)
  ✗ exceso de diminutivos o jerga
  ✗ CUALQUIER countdown, temporizador o escasez inventada. La urgencia falsa está
    prohibida por marca. Si hay escasez, es un dato real editable ("quedan 4 cupos
    para la salida del 15 de marzo"), nunca un timer que se reinicia.

CTAs APROBADOS (usa estos textos, no inventes otros):
  Primarios:   "Cotiza tu próxima parada" · "Cotiza por WhatsApp" ·
               "Habla con un asesor" · "Planeemos tu viaje"
  Secundarios: "Descubre las opciones" · "Ver itinerario día a día" ·
               "Consulta disponibilidad" · "Cuéntanos cómo quieres viajar"
  Microcopy de apoyo: "Respuesta en minutos, sin compromiso" ·
               "Te asesora un experto en viajes, no un bot" ·
               "Precio final claro antes de reservar"

FIRMA VERBAL "Next Stop": es una firma narrativa, NO parte del logo. Úsala como máximo
UNA vez por página (ej. un titular de sección "¿Cuál será tu Next Stop?"). Nunca la
traduzcas, nunca la mezcles con otras frases manuscritas, nunca la pongas junto al logo.

ENEMIGO DE MARCA: la improvisación, la presión comercial, la saturación visual y las
promesas genéricas. El diseño debe respirar: mucho aire, jerarquía clara, pocos elementos
compitiendo. NO hagas una página saturada de badges, banners y popups.

PREPARADO PARA i18n (importante)
El sitio será bilingüe (español por defecto sin prefijo, inglés en /en) con next-intl.
NO implementes next-intl todavía, pero NO dejes strings sueltos en el JSX: extrae TODO
el texto visible a un objeto `const copy = { ... }` al inicio de cada archivo, para que
migrarlo a messages/es.json sea mecánico. Ninguna cadena visible hardcodeada dentro del
markup.

DATOS LEGALES — NO INVENTES
El número de RNT, la dirección, el NIT, el teléfono y las afiliaciones (ANATO/IATA) NO
están confirmados. Usa literalmente el placeholder `RNT XXXXXX` y agrega
// TODO: VERIFICAR dato legal real antes de publicar
No copies números de RNT de ninguna otra agencia. No inventes cifras de "+10.000 viajeros
felices" ni reseñas ficticias con nombres reales: usa placeholders evidentes.
```

---

## 2.bis Dirección de diseño — declarar una vez, pegar en cada prompt

El bloque §2 dice qué **no** escribir. Este dice **cómo debe verse**. Sale de aplicar
[`.claude/skills/design-taste-frontend/SKILL.md`](../../.claude/skills/design-taste-frontend/SKILL.md)
(skill anti-slop de frontend) a este proyecto: en lugar de re-derivar la dirección visual en cada
prompt, se declara una sola vez aquí y el resto se deduce. El checklist mecánico que verifica
que el output la cumplió está en §11.

### Design Read

> Sitio de **captación de leads + credibilidad institucional** para una agencia de viajes
> colombiana, audiencia 83% móvil, con lenguaje **calmado y claro** (arquetipo Cuidador),
> sobre tokens propios de Tailwind v4 + shadcn/ui, con **motion mínimo**.

### Los tres diales

`DESIGN_VARIANCE: 6` · `MOTION_INTENSITY: 3` · `VISUAL_DENSITY: 4`

Estos números no son gusto, son consecuencia de restricciones ya cerradas:

- **VARIANCE 6, no 8.** El skill pondría 3-4 por "trust-first / regulado" (RNT, Ley 1581,
  ESCNNA) y 7-9 por "landing page"; el punto medio es lo correcto aquí. El enemigo de marca
  declarado es *la saturación visual* y la regla es *el diseño debe respirar*. 6 significa
  asimetría controlada (heroes partidos, columnas de ancho desigual, alineación a la
  izquierda) **sin** masonry, sin zonas vacías de 20vw, sin composiciones "de agencia".
- **MOTION 3.** Forzado por el objetivo de LCP < 1s en móvil y por la prohibición de
  librerías de animación (§2). El propio skill contempla esta salida: si no se puede
  entregar motion funcional, se baja el dial a 3 y se entrega una página estática limpia,
  en vez de dejar animaciones a medias. Efecto colateral deseable: el dial 3 desactiva de
  raíz el scroll-hijack, los marquees, las secciones pinned y la física magnética.
- **DENSITY 4.** La ficha de paquete tiene información que el usuario necesita para decidir
  (qué incluye / qué no, itinerario, vigencia, disclosure de precio). No es galería de arte.
  Pero 4 y no 7: espaciado de sección `py-16`/`py-24`, no interfaz de cabina.

### Overrides del skill (donde este proyecto gana)

El skill trae defaults fuertes que contradicen decisiones ya tomadas. Se resuelven así, y no
se vuelven a discutir prompt por prompt:

| Tema | Default del skill | Decisión de este proyecto | Por qué |
|---|---|---|---|
| Animación | Motion (`motion/react`) por defecto, GSAP para scroll | **Ninguna librería.** CSS puro + `scroll-snap` | LCP < 1s móvil; §2 lo prohíbe explícitamente |
| Iconos | Phosphor / HugeIcons / Radix / Tabler; Lucide desaconsejado | **`@phosphor-icons/react`**, `weight="regular"` fijo en todo el sitio | Ver §12.4: no hay familia oficial de marca todavía. Es la decisión más cara de revertir, por eso se toma antes de instalar shadcn |
| Modo oscuro | Obligatorio en sitios de consumo | **Solo modo claro**, declarado | Los ratios de contraste de `app/globals.css` están medidos sobre blanco, `#F4F7FA` y el tinte 10% de cada color. Un modo oscuro duplica esa matriz y hoy no aporta al objetivo de conversión |
| Tipografía | Inter desaconsejado como default | Outfit / Plus Jakarta (títulos) + Inter (cuerpo), provisional | Convergen: Outfit ya está en el pool que el skill aprueba. Sigue pendiente §12.1 |
| Em-dash | Cero `—` en todo texto visible | Se aplica a **`messages/*.json`**, no a estos `.md` | La regla apunta al copy renderizado. Los documentos internos mantienen su estilo |
| Serif | Muy desaconsejado salvo justificación editorial | No aplica: la marca es sans geométrica | — |

### Bloque para pegar (va junto a las reglas globales de §2)

```text
DIRECCIÓN DE DISEÑO

Diales: DESIGN_VARIANCE 6 / MOTION_INTENSITY 3 / VISUAL_DENSITY 4.
Asimetría controlada, movimiento mínimo, densidad media. El diseño debe respirar.

LAYOUT. Reglas duras: incumplir cualquiera es entregar trabajo roto.
- El HERO cabe en el viewport inicial: titular máx 2 líneas, subtítulo máx 20 palabras
  y máx 4 líneas, CTA visible sin hacer scroll. Padding superior máx pt-24 en desktop.
- El hero tiene máx 4 elementos de texto: (eyebrow O nada) + titular + subtítulo + CTAs.
  Los sellos de confianza (RNT, ANATO, IATA) van en una sección DEBAJO del hero, nunca
  dentro de él. Tampoco metas una micro-línea de texto bajo los CTAs.
- Usa min-h-[100dvh], NUNCA h-screen (la barra de Safari en iOS rompe el layout).
- La navegación cabe en UNA línea en desktop y mide máx 80px de alto.
- Usa CSS Grid para las columnas, no cálculos de flex con porcentajes.
- Máximo 2 secciones seguidas con el patrón imagen-a-un-lado / texto-al-otro. La tercera
  seguida está prohibida: rompe con una sección a ancho completo, una vertical o un grid.
- Ninguna familia de layout se repite en la página. Una home de 7-8 secciones usa al menos
  4 estructuras distintas. Prohibida la fila de 3 tarjetas idénticas como recurso genérico.
- EYEBROWS (la etiqueta pequeña en mayúsculas sobre un titular): máximo 1 cada 3 secciones,
  contando el hero. Si una sección lleva eyebrow, las 2 siguientes no. En la mayoría de los
  casos el titular solo basta: bórralo.
- Prohibido el encabezado de sección "titular grande a la izquierda + párrafo pequeño
  flotando a la derecha". Si hacen falta ambos, apílalos (titular arriba, cuerpo debajo,
  máx 65ch de ancho).
- Cada layout multicolumna declara explícitamente su colapso a una columna bajo 768px.

CONSISTENCIA. Bloquear y no variar:
- UN solo tema en toda la página (claro). Ninguna sección invierte a modo oscuro. Las
  secciones con fondo navy son un fondo de sección dentro del mismo tema, no otro tema.
- UN solo color de acento: el naranja es el CTA primario en TODAS las secciones. No
  aparece un CTA turquesa en la sección 5 ni un badge de otro color en el footer.
- UNA sola escala de radios (sm 6 / md 12 / lg 20 + full para pills). Sin radios ad-hoc.

IMÁGENES. Este es un producto visual, no un documento:
- Toda sección que pida imagen lleva foto real o placeholder
  https://picsum.photos/seed/{seed-descriptivo}/{w}/{h}, con un seed que describa la
  sección (ej. eje-cafetero-finca-cafe). El hero SIEMPRE lleva una imagen real: texto sobre
  un degradado no es un hero, es un placeholder.
- Prohibido dibujar SVG decorativos a mano (ilustraciones, marcas, mockups).
- Prohibido simular capturas de pantalla o interfaces con <div> apilados.
- Iconos SOLO de @phosphor-icons/react con weight="regular". Nunca escribas paths de SVG
  a mano ni mezcles familias de iconos.

MOVIMIENTO (dial 3):
- Sin framer-motion, sin motion, sin GSAP, sin librerías de carrusel.
- Sin window.addEventListener('scroll'). Si necesitas detectar visibilidad, IntersectionObserver.
- Sin marquees, sin scroll-hijack, sin secciones pinned, sin parallax, sin loops infinitos.
- Solo transiciones CSS en :hover / :focus-visible / :active, y feedback táctil en :active
  (translate-y-[1px] o scale-[0.98]) porque el tráfico es móvil.
- Todo lo que se mueva respeta prefers-reduced-motion.

DENSIDAD Y COPY:
- Subpárrafo por sección: máx 25 palabras. Titular de sección: máx 8 palabras.
- Una lista de más de 5 ítems (ej. "qué incluye") NO se resuelve con <ul> y una línea
  divisoria bajo cada fila. Agrupa en 2-3 bloques temáticos, o pasa a grid de tarjetas.
- Testimonios: máx 3 líneas de cita, atribución con nombre + rol (nunca solo nombre).
- Estados completos, no solo el estado exitoso: carga (skeleton con la forma final del
  contenido, no un spinner), vacío y error inline en formularios.

SEÑALES DE "HECHO POR IA". Prohibidas todas:
- Eyebrows numerados: "01 / DESTINOS", "002 · Paquetes", "06 · cómo funciona".
- Puntitos de color decorativos antes de items de nav, de lista o de badges.
- Indicadores de scroll: "Scroll", "↓ scroll", "Desliza para explorar", el mouse animado.
- Etiquetas o pills superpuestas sobre las fotos, y pies de foto decorativos tipo
  "Frame XII · 35mm" o "Registro no. 12". Si hace falta pie, que sea funcional y vaya
  debajo de la imagen.
- Franjas decorativas bajo el hero tipo "VIAJA. DESCUBRE. VUELVE.".
- Etiquetas de versión o build ("v1.4.2", "BETA") en un sitio de marketing.
- Contadores de stock falsos ("Reserva 412 de 800") y cualquier temporizador.
- Barras de progreso con fondo relleno como comparador visual.
- Franjas atmosféricas de ciudad/hora/clima ("Medellín 14:23 · 24°C"). La dirección real
  de la agencia en el footer sí; la decoración ambiental no.
- Nombres y datos genéricos: "Juan Pérez", "+57 300 123 4567", "99.9%", "+10.000 viajeros".
- Verbos de relleno: "potencia", "eleva", "transforma", "sin fricción", "revoluciona".
- El guion largo (—) en cualquier texto visible. Usa punto, coma, dos puntos o paréntesis.
```

---

## 3. PROMPT 0 — Design system (ejecutar primero)

> Corresponde al checklist de Fase 0, puntos 4 y 5 de [`spec-tecnica.md`](../architecture/spec-tecnica.md) §7.

```text
[PEGAR AQUÍ EL BLOQUE "REGLAS GLOBALES" DE §2]

TAREA: construir SOLO el sistema de diseño — tokens y componentes base. Todavía NO
construyas ninguna página de contenido.

1) TOKENS
Crea `app/globals.css` con la configuración CSS-first de Tailwind v4. NO generes
tailwind.config.ts — en v4 no se usa. Estructura:

    @import "tailwindcss";

    @theme {
      /* tokens aquí */
    }

Cada token declarado en @theme genera automáticamente su clase utilitaria y su CSS
variable, así que no hay que repetirlos en ningún archivo de config.

- Color: los 4 de marca + escala de neutros fría de 50 a 900 + estados (success, error,
  warning, info). Incluye las variantes accesibles de naranja (#C24A00) y turquesa
  (#007D91) para texto sobre fondo claro.
  Nómbralos con el prefijo que Tailwind v4 espera: --color-brand-navy, --color-brand-orange,
  --color-whatsapp, etc.
- Tipografía: escala mobile-first. Define tamaños para móvil primero y su escalado a
  desktop con clamp(). Niveles: display, h1, h2, h3, body-lg, body, body-sm, caption.
  Pesos: 400 / 500 / 600 / 700.
- Espaciado: escala base 4px (4, 8, 12, 16, 24, 32, 48, 64, 96).
- Radios: solo 3 valores (sm 6px, md 12px, lg 20px) + full para pills.
- Sombras: solo 3 valores (sm, md, lg), suaves, con tinte azulado no negro puro.
- Breakpoints mobile-first: sm 640 / md 768 / lg 1024 / xl 1280.
  (En v4 los breakpoints también son tokens: --breakpoint-sm, --breakpoint-md, etc.)

2) COMPONENTES BASE (en `components/ui/`)
- Button: variantes `primary` (naranja, texto navy), `secondary` (navy, texto blanco),
  `outline` (borde navy), `ghost`, y `whatsapp` (verde #25D366, texto navy, con ícono de
  WhatsApp). Tamaños sm/md/lg. Estados hover, focus-visible (anillo visible, obligatorio
  para accesibilidad) y disabled. En móvil el área táctil mínima es 44x44px.
- Input, Textarea, Select: con label asociado por `htmlFor` (nunca placeholder como
  label), estado de error con mensaje y `aria-describedby`.
- Checkbox: SIN estado marcado por defecto. Debe soportar un label largo de varias
  líneas (lo necesita el consentimiento de datos de la Ley 1581).
- Card: contenedor genérico + variantes `DestinationCard` y `PackageCard`.
- Badge: para sellos de confianza (RNT, ANATO, IATA) y para etiquetas de destino
  ("Nacional", "Internacional", "Grupo pequeño").
- Accordion: para "qué incluye/no incluye" e itinerario. Sin JS de librería externa si
  se puede resolver con <details>/<summary> accesible.
- Section: wrapper con ancho máximo, padding responsive y variantes de fondo
  (blanco / superficie clara / navy oscuro).

3) PÁGINA DE DOCUMENTACIÓN
Crea `app/design-system/page.tsx`: una guía viva que renderiza cada token (muestras de
color con su hex y su ratio de contraste indicado) y cada componente con todas sus
variantes y estados. Añade `export const metadata = { robots: { index: false } }` — esta
página NO debe indexarse.

Entrega el código completo de app/globals.css (con el bloque @theme), cada componente y
la página /design-system. NO entregues ningún archivo tailwind.config.
```

---

## 4. PROMPT 1 — Layout global

```text
[PEGAR REGLAS GLOBALES §2]

Ya existe el design system (tokens + componentes base en components/ui/). Reúsalo, no
redefinas colores ni botones.

TAREA: el layout global en `components/layout/`, más `app/[locale]/layout.tsx`.

1) NAVBAR (`Navbar.tsx`)
- Logo BroWay Adventures a la izquierda. Usa /logo-broway.png como src, ratio horizontal,
  ancho mínimo 180px en desktop / 140px en móvil (respeta el mínimo del manual de marca).
  Zona de seguridad: deja un espacio libre alrededor equivalente a la mitad de la altura
  del logo. No lo pegues al borde.
- Links: Destinos · Paquetes · Cómo pagar · Nosotros · Contacto.
- A la derecha: selector de idioma (ES/EN, minimalista, tipo toggle de texto — NO uses
  banderas: una bandera no representa un idioma) y un botón `whatsapp` size sm con el
  texto "Cotiza por WhatsApp".
- Móvil: menú hamburguesa que abre un panel a pantalla completa, con el botón de
  WhatsApp fijo abajo del panel. Cierra con Escape y atrapa el foco mientras está
  abierto.
- Sticky al hacer scroll, con fondo sólido y sombra sm; en el tope de la página puede ser
  transparente sobre el hero.

2) FOOTER (`Footer.tsx`)
Fondo navy #003062, texto blanco. Cuatro columnas en desktop, acordeón/apilado en móvil:
- Marca: logo en blanco + una línea de propósito ("Hacer que viajar se sienta más claro,
  cercano y posible").
- Destinos y Paquetes (links).
- Empresa: Nosotros, Cómo pagar, Contacto, Blog (marcar "Próximamente", ruta reservada).
- Legal y contacto: enlaces a /legal, política de datos, términos, política de
  cancelación + datos de contacto placeholder.
Franja inferior obligatoria:
- Sello "RNT XXXXXX" visible (// TODO: VERIFICAR).
- Aviso ESCNNA en texto legible, exigido por la Ley 679 de 2001 a prestadores turísticos
  colombianos: rechazo a la explotación sexual comercial de niños, niñas y adolescentes.
- Mensaje anti-fraude, en tono sereno y sin alarmismo: invita a verificar el RNT de
  cualquier agencia antes de pagar.
- © BroWay Adventures.

3) BOTÓN WHATSAPP FLOTANTE (`WhatsAppFloating.tsx`)
- Fijo abajo a la derecha, visible en TODAS las páginas. En móvil, respeta el safe-area
  inferior del iPhone (env(safe-area-inset-bottom)).
- Recibe props `message` y `campaign` para construir el link wa.me con mensaje
  pre-llenado. Ejemplo del href:
  https://wa.me/57XXXXXXXXXX?text=Hola%2C%20quiero%20cotizar%20el%20paquete%20Eje%20Cafetero
- Deja el número como constante `WHATSAPP_NUMBER` en lib/config.ts con
  // TODO: número real.
- Al hacer click debe llamar a una función `trackWhatsAppClick(context)` importada de
  lib/tracking/events.ts. Créala como un stub que hace console.log y deja el TODO de
  GA4/Meta Pixel — el tracking real es otra tarea.
- No lo hagas un widget que se expande con un chat falso ni un popup automático: eso es
  presión comercial, prohibido por marca.

4) LANGUAGE SWITCHER (`LanguageSwitcher.tsx`)
Al cambiar de idioma debe mantener al usuario en la MISMA página (usa usePathname y
reescribe solo el prefijo de locale), nunca redirigir al home. Prepara la estructura de
rutas para `es` sin prefijo (por defecto) y `en` con prefijo /en.

Entrega los cuatro componentes + el layout que los compone.
```

---

## 5. PROMPT 2 — Home

```text
[PEGAR REGLAS GLOBALES §2]

Ya existen el design system y el layout global. Reúsalos.

TAREA: `app/[locale]/page.tsx` — la home. Objetivo: dar credibilidad institucional y
llevar a WhatsApp. Secciones en este orden exacto:

1) HERO
- Titular con la propuesta de valor en menos de 12 palabras, en el tono del Cuidador.
  Ejemplo de dirección (mejóralo): "Elige tu próximo viaje con claridad y compañía".
- Subtítulo de una línea que explique qué hace la agencia, sin promesas genéricas.
- Botón primario "Cotiza por WhatsApp" + secundario outline "Descubre las opciones".
- Microcopy bajo los botones: "Respuesta en minutos, sin compromiso".
- Imagen de fondo con next/image `priority` y `sizes` correcto (es el LCP). Overlay navy
  con opacidad para garantizar contraste del texto — verifica que el texto quede sobre
  4.5:1 real.
- Prueba social ABOVE THE FOLD: una franja discreta con los sellos RNT / ANATO / IATA
  (placeholders) y una línea tipo "Agencia registrada en Medellín".

2) DESTINOS DESTACADOS
Grid de 6 DestinationCard. En móvil: scroll horizontal con scroll-snap (CSS puro, sin
librería). Cada card: imagen, nombre del destino, badge Nacional/Internacional, "desde
$X.XXX.XXX COP" y un link "Ver opciones". Usa destinos colombianos e internacionales
plausibles como placeholder (Eje Cafetero, San Andrés, Santa Marta, Cartagena, Cancún,
Punta Cana).

3) CÓMO FUNCIONA — 3 pasos
Refleja el ADN de marca: (1) Cuéntanos cómo quieres viajar · (2) Te damos opciones claras
· (3) Viajas acompañado. Íconos de línea simples en turquesa. Sin saturación.

4) POR QUÉ BROWAY
Cuatro bloques con los valores del manual: Claridad, Cercanía, Confianza, Responsabilidad.
Una frase corta por bloque, redactada como beneficio para el viajero, no como palabra
suelta.

5) FRANJA "NEXT STOP"
Sección de ancho completo con fondo turquesa #00AAC3 y texto navy. Titular:
"¿Cuál será tu Next Stop?" (esta es la ÚNICA aparición de "Next Stop" en toda la página).
CTA "Planeemos tu viaje".

6) TESTIMONIOS
Tres testimonios en cards. Marca claramente los datos como placeholder (nombres tipo
"Nombre Apellido — Viajó a X"). No inventes reseñas de personas reales ni pongas logos
de Google Reviews si aún no hay integración.

7) BLOQUE DE CONFIANZA / ANTI-FRAUDE
Explica en tono sereno cómo verificar que una agencia es legal en Colombia (RNT), sin
generar miedo. Enlaza a /nosotros y /legal.

8) CTA FINAL
Sección navy con el CTA primario a WhatsApp y el formulario corto como alternativa
(link a /contacto).

SEO: exporta `metadata` con title y description en español, y añade JSON-LD de
`LocalBusiness` con los datos como placeholder marcado con TODO.
```

---

## 6. PROMPT 3 — Ficha de paquete (la página que más convierte)

```text
[PEGAR REGLAS GLOBALES §2]

TAREA: `app/[locale]/paquetes/[slug]/page.tsx` + los componentes de sección que necesite.
Esta es la página de mayor impacto en conversión: sigue la anatomía al pie de la letra.

Datos: define un tipo TypeScript `Package` y un mock en lib/mock/packages.ts (la base de
ofertas se conecta después). Campos: slug, titulo, destino, duracionDias, beneficioCorto,
precioDesde, moneda, imagenes[], highlights[], itinerario[{dia,titulo,descripcion}],
incluye[], noIncluye[], fechasSalida[{fecha,cuposDisponibles}], politicaCancelacion,
faq[{pregunta,respuesta}].

MÁS estos campos, que NO son opcionales — un paquete publicado es una OFERTA con
trazabilidad y vigencia:
  offerId: string          // identificador único de la oferta
  ciudadOrigen: string     // "desde Bogotá" cambia el precio; nunca lo omitas
  ocupacionBase: string    // la ocupación con la que se calculó el "desde" (ej. "doble")
  vigenciaHasta: string    // ISO
  validadaEl: string       // ISO — última verificación humana de la tarifa
  estado: "vigente" | "vencida" | "borrador"

BLOQUE DE DISCLOSURE DEL PRECIO (componente `PriceDisclosure`, obligatorio)
Va pegado al precio, con peso tipográfico legible — NO en letra chica gris de 11px.
Contiene: "desde $X por persona" + ciudad de salida + noches + ocupación base + qué
incluye + "Tarifa verificada el [validadaEl], sujeta a disponibilidad y reconfirmación"
+ RNT XXXXXX. Es requisito de la normativa de publicidad para prestadores turísticos, y
además es coherente con el valor de marca de honestidad: el "desde" nunca puede servir
para esconder costos.

ESTADO DE TARIFA VENCIDA
Si `estado !== "vigente"` o `vigenciaHasta` ya pasó, la página NO muestra el precio como
si fuera comprable y NO devuelve 404. Renderiza un estado explícito: "Esta tarifa estuvo
vigente hasta el [fecha]. Te preparamos una actualizada", con el CTA de WhatsApp de
recotización (mensaje pre-llenado que incluye el offerId). Quien llega a una oferta
vencida sigue siendo un lead con intención alta — no lo pierdas.
Ojo: esto NO es urgencia falsa. Es un dato real y verificable, no un contador que se
reinicia. Los contadores siguen prohibidos.

Un paquete con `estado: "borrador"` nunca se renderiza en producción.

ESTRUCTURA:

1) ABOVE THE FOLD (crítico — debe caber en 375x667 sin scroll para lo esencial)
- Breadcrumb: Inicio > Paquetes > [nombre].
- H1: destino + tipo de experiencia + beneficio, MENOS de 12 palabras.
  Ejemplo: "Eje Cafetero 4 días: café y naturaleza con guía local".
- Galería: imagen principal grande + miniaturas. En móvil, scroll-snap horizontal.
  Sin lightbox de librería externa.
- Bloque de precio: "desde $X.XXX.XXX COP por persona" — el "desde" y el "por persona"
  deben ser tipográficamente evidentes, nunca letra chica engañosa.
- Duración y próxima fecha de salida.
- CTA primario "Cotiza por WhatsApp" (mensaje pre-llenado que incluye el nombre del
  paquete) + secundario "Ver itinerario día a día" que hace scroll suave a la sección.

2) BARRA STICKY DE CONVERSIÓN (solo móvil)
Barra fija inferior con el precio "desde" a la izquierda y el botón WhatsApp a la derecha.
Aparece al hacer scroll pasado el hero. Coexiste con el botón flotante: cuando la barra
está visible, el flotante se oculta (no dupliques CTAs apilados).

3) HIGHLIGHTS
Lista de 4-6 bullets con lo mejor del viaje, arriba y escaneable. Íconos de línea
turquesa.

4) ITINERARIO DÍA A DÍA
Acordeón, un panel por día, con el día 1 abierto por defecto. Máximo 2-3 experiencias
por día. Accesible por teclado.

5) QUÉ INCLUYE / QUÉ NO INCLUYE
Dos columnas en desktop, apiladas en móvil. Check turquesa vs. equis en gris (NO uses
rojo: no es un error, es información). Esta sección es de gestión de expectativas —
redáctala con honestidad, es un valor de marca.

6) FECHAS DE SALIDA Y CUPOS
Tabla o lista de fechas con cupos reales disponibles. Si quedan pocos, muéstralo como
dato ("Quedan 4 cupos"), NUNCA como countdown ni con lenguaje de presión. Prohibido
cualquier temporizador.

7) FORMAS DE PAGO
Explica el abono del 30% para separar y el saldo en cuotas. Texto exacto a usar:
"Sepáralo con el 30% y paga el saldo en cuotas". NO escribas "financiamos" ni "crédito"
(la agencia no otorga crédito). Aclara que el pago en línea se coordina con un asesor
por WhatsApp.

8) POLÍTICA DE CANCELACIÓN + FAQ
FAQ en acordeón, con JSON-LD `FAQPage`.

9) FORMULARIO CORTO (alternativa a WhatsApp)
Máximo 4 campos visibles, y son ESTOS — alimentan el scoring del CRM, no se eligen por
gusto: Nombre · WhatsApp/teléfono · Ciudad de salida · Fecha aproximada + nº de viajeros.
El destino y el offerId van en campos ocultos, tomados del contexto de la página: el
asesor no debe volver a preguntar qué oferta vio el visitante.
NO pidas presupuesto en el formulario (alta fricción; lo pregunta el asesor en
conversación). NO pidas nunca ingresos, estrato ni capacidad crediticia.
Más el checkbox de consentimiento (ver reglas abajo). Botón "Cuéntanos cómo quieres
viajar". Al enviar con éxito, redirige a /gracias.

10) TRUST BADGES + PAQUETES RELACIONADOS

CHECKBOX DE CONSENTIMIENTO — REQUISITO LEGAL (Ley 1581 de 2012), no es opcional:
- NO puede venir pre-marcado. Nunca `defaultChecked`.
- El envío del formulario está deshabilitado hasta que se marque, y el servidor RECHAZA
  el envío si llega sin él. Enviar el formulario no implica consentimiento por sí solo.
- Texto: autorización expresa para el tratamiento de datos personales, con la finalidad
  declarada y un enlace a /legal. La finalidad debe cubrir explícitamente la GESTIÓN DE
  LA SOLICITUD, la COTIZACIÓN, el SEGUIMIENTO, el envío de INFORMACIÓN COMERCIAL por
  WhatsApp/llamada/correo y la PUBLICIDAD PERSONALIZADA. Decir solo "contacto comercial
  para asesoría de viaje" NO alcanza si los leads van a alimentar audiencias de Meta.
  Marca el texto con // TODO: validar redacción final con abogado colombiano.
- Debe mencionar el derecho a consultar, actualizar y suprimir los datos, y a REVOCAR la
  autorización, indicando el canal para hacerlo.
- El formulario envía, además de los campos visibles, el registro de evidencia del
  consentimiento: texto aceptado, versión de la política (constante `POLICY_VERSION` en
  lib/consent/), fecha/hora, formulario de origen y canales autorizados. Ver
  `spec-tecnica.md` §8.3 para el shape exacto del payload.

SEO: metadata dinámica por paquete + JSON-LD `TouristTrip` y `Product`+`Offer` con el
precio, y `BreadcrumbList`.
```

---

## 7. PROMPT 4 — Landing de campaña

```text
[PEGAR REGLAS GLOBALES §2]

TAREA: `app/[locale]/lp/[campana]/page.tsx`.

Es una landing para tráfico pago (Meta, Google, TikTok). El principio rector es MESSAGE
MATCH: debe leerse como la continuación exacta del anuncio que trajo al usuario. Si no
coincide, se pierde entre 40% y 60% de los visitantes.

DIFERENCIAS CLAVE contra el resto del sitio:
- SIN navbar de navegación completa: solo el logo y el botón de WhatsApp. Cero links que
  saquen al usuario del flujo. Sin menú.
- Footer mínimo: RNT, ESCNNA, legal. Nada más.
- Una sola idea, un solo CTA repetido 3-4 veces a lo largo del scroll.
- Todo el contenido debe venir de props/config (`lib/mock/campaigns.ts`), para poder
  lanzar una campaña nueva sin tocar código.

ESTRUCTURA:
1. Hero con el MISMO titular, oferta e imagen del anuncio. Video vertical si existe
   (usa <video> nativo con poster, playsInline, muted, sin autoplay con sonido).
2. Prueba social inmediata bajo el hero (sellos + una línea de confianza).
3. Qué incluye — 4-6 bullets escaneables.
4. CTA intermedio a WhatsApp.
5. Itinerario resumido (no día a día completo: es una landing, no la ficha).
6. Formulario corto de 3 campos + checkbox de consentimiento no pre-marcado.
7. FAQ breve (4 preguntas que resuelvan la objeción principal).
8. CTA final.

TRACKING DE CAMPAÑA:
- Lee los UTMs de la URL (utm_source, utm_medium, utm_campaign, utm_content) y
  persístelos en sessionStorage con un helper en lib/tracking/utm.ts.
- El mensaje pre-llenado de wa.me debe incluir el identificador de campaña, para
  trazabilidad del origen del lead. Ejemplo:
  "Hola, vengo de la promo de Eje Cafetero y quiero cotizar" + un código de campaña.
- Marca la página con `robots: { index: false }` — las landings de pauta no se indexan
  para no competir con las páginas SEO.
```

---

## 8. PROMPT 5 — Destinos (listado + detalle)

```text
[PEGAR REGLAS GLOBALES §2]

TAREA: dos rutas.

A) `app/[locale]/destinos/page.tsx` — listado
- Hero corto con titular y una línea.
- Filtros simples por tipo (Todos / Nacionales / Internacionales) resueltos con estado
  local — sin librería, sin llamadas al servidor.
- Grid responsive de DestinationCard: 1 columna en móvil, 2 en tablet, 3 en desktop.
- CTA de WhatsApp al final.

B) `app/[locale]/destinos/[slug]/page.tsx` — página de destino
Está optimizada para búsquedas de alta intención ("viaje a Eje Cafetero 4 días"), así
que el contenido editorial pesa:
- Hero con imagen del destino y H1 con el nombre del destino.
- Introducción editorial de 2-3 párrafos: qué es, por qué ir, para quién es. Tono
  Explorador: inspira sin exagerar.
- "Mejor época para viajar" — bloque informativo útil, no comercial.
- Paquetes disponibles en ese destino: grid de PackageCard que enlaza a /paquetes/[slug].
- "Qué hacer" — 4-6 experiencias destacadas.
- FAQ del destino con JSON-LD FAQPage.
- CTA a WhatsApp con mensaje pre-llenado que incluye el destino.

SEO: metadata dinámica por destino, BreadcrumbList, y contenido lo bastante sustancial
para posicionar (no una página vacía con solo cards).
```

---

## 9. PROMPT 6 — Nosotros, Contacto, Cómo pagar, Gracias, FAQ y Legal

```text
[PEGAR REGLAS GLOBALES §2]

TAREA: las páginas institucionales. Son las que dan credibilidad — el objetivo
declarado del MVP es "dar seriedad a la empresa".

A) `app/[locale]/nosotros/page.tsx`
- Historia real de marca (del manual): BroWay nació de una amistad que se convirtió en
  hermandad. Dos fundadores con la misma pasión: viajar, descubrir y ayudar a otros a
  vivir nuevas experiencias. "Bro" es el vínculo, "Way" es el camino.
  NO uses "hermanos de aventuras" como eslogan: el manual dice que explica el origen pero
  no forma parte del nombre.
- Propósito, misión y visión, redactados como texto de sitio (no como bullets de
  presentación corporativa):
  · Propósito: hacer que viajar se sienta más claro, cercano y posible para más personas.
  · Misión: orientar y acompañar a viajeros en Colombia en la elección de experiencias
    nacionales e internacionales.
  · Visión: ser una marca de viajes reconocida en Colombia por la confianza que genera.
- Valores: Claridad, Confianza, Cercanía, Responsabilidad, Curiosidad, Consistencia.
- Bloque de legalidad DESTACADO: RNT XXXXXX (// TODO: VERIFICAR), afiliaciones, dirección
  en Medellín. Este bloque es la razón de ser de la página.
- CTA a WhatsApp.

B) `app/[locale]/contacto/page.tsx`
- Dos vías claras y equilibradas: WhatsApp (primaria, destacada) y formulario corto
  (alternativa para quien no quiere chatear).
- Formulario de 4 campos máximo + checkbox de consentimiento NO pre-marcado.
- Horario de atención, dirección y mapa embebido de forma diferida (iframe con
  loading="lazy", nunca bloqueante del LCP).
- Estados del formulario: idle, enviando, éxito y error, con mensajes en el tono sereno
  de la marca.
- El submit hace POST a /api/lead (créalo como stub que valida en el servidor y devuelve
  200 con un TODO de integración al CRM).

C) `app/[locale]/como-pagar/page.tsx`
- Explica el abono del 30% para separar y el saldo en cuotas, con total transparencia.
- Medios de pago aceptados (placeholder).
- Qué pasa después de pagar el abono.
- PROHIBIDO decir "financiamos", "crédito" o "sin intereses garantizados" si no está
  confirmado. Marca con TODO cualquier condición comercial no verificada.

D) `app/[locale]/gracias/page.tsx` — confirmación post-lead
Es una página corta pero importante: es donde se registra la conversión limpia y donde se
evita que el lead se enfríe entre el envío y la primera respuesta del asesor.
- Confirmación serena, sin euforia: "Listo, recibimos tu solicitud".
- EXPECTATIVA CONCRETA de respuesta ("Te escribimos por WhatsApp en menos de X minutos en
  horario de atención"). // TODO: confirmar el tiempo real con la operación — no prometas
  un número que la agencia no pueda cumplir, y NO escribas "24/7".
- Qué pasa ahora, en 2-3 pasos cortos.
- CTA para adelantar la conversación por WhatsApp, con mensaje pre-llenado que conserve el
  contexto (destino/offerId de la página de origen).
- Enlaces suaves a /destinos y /faq para quien quiera seguir explorando.
- `robots: { index: false }` — no debe indexarse.
- Llama a `trackLead(context)` de lib/tracking/events.ts (stub, igual que el de WhatsApp).
- NO pongas aquí un segundo formulario ni pidas más datos.

E) `app/[locale]/faq/page.tsx` — preguntas frecuentes globales
Resuelve las objeciones transversales (no las de un paquete concreto, que viven en su
ficha): cómo se reserva, cómo se paga el 30%, qué pasa si hay que cambiar fechas, cómo
verificar que la agencia es legal, documentación para viajar, y cómo tratamos los datos
personales. Acordeón accesible + JSON-LD FAQPage. CTA a WhatsApp al final.

F) `app/[locale]/legal/page.tsx`
- Navegación por secciones (índice lateral en desktop, acordeón en móvil):
  1. Política de tratamiento de datos personales (Ley 1581 de 2012): finalidad,
     responsable, derechos del titular (consultar, actualizar, suprimir), canal para
     ejercerlos, derecho a REVOCAR la autorización, y aviso de transferencia
     internacional — el CRM (GoHighLevel) está fuera de Colombia, así que esta cláusula
     aplica y no es hipotética.
  2. Términos y condiciones.
  3. Política de cancelación y cambios.
  4. Aviso ESCNNA (Ley 679 de 2001).
  5. Registro Nacional de Turismo (RNT).
  6. Registro de Números Excluidos (RNE): explica que la persona puede excluirse de
     mensajería comercial y cómo hacerlo. Vigente desde abril de 2024.
- Muestra la VERSIÓN y la fecha de la política de datos de forma visible (ej. "Versión 1 —
  vigente desde [fecha]"): es lo que permite acreditar después qué texto aceptó cada
  persona. Debe coincidir con la constante POLICY_VERSION que envía el formulario.
- Nota visible: la versión en ESPAÑOL es la legalmente vinculante; la traducción al
  inglés es informativa y no la sustituye.
- TODO EL CONTENIDO LEGAL VA COMO PLACEHOLDER ESTRUCTURADO con un aviso claro en el
  código: // TODO: texto legal debe ser redactado/validado por un abogado antes de
  publicar. No redactes cláusulas legales definitivas.
```

---

## 10. Qué NO pedirle a v0

Esto sale del alcance de la herramienta o de la Fase 1 — pedirlo genera código que hay que
borrar:

| No pedir | Por qué | Dónde va |
|---|---|---|
| Integración real de `next-intl` | v0 la implementa mal y rompe el routing | Tarea de desarrollo, checklist §7.2 del spec |
| Conexión al CMS (Sanity/Contentful/Strapi) | El CMS aún no está elegido (`mvp-features.md` §Riesgos) | Fase 0-1, tras decidir |
| Meta CAPI / TikTok Events API | Son API routes server-side | **Fase 2** |
| Pasarela de pago (Wompi/PayU) | No es MVP | **Fase 2** |
| Quiz "encuentra tu viaje ideal" | Fuera del alcance MVP | **Fase 2** |
| Blog | Ruta reservada, sin contenido | **Fase 2** |
| Storybook | Sobre-ingeniería explícita en el spec §4.4 | **Fase 2-3** |
| Textos legales definitivos | Riesgo legal real | Abogado |
| Countdown / escasez dinámica | Prohibido por marca y por el research | Nunca (o dato real editable) |
| Iconos de `lucide-react` | shadcn/ui los trae por defecto; la familia del proyecto es Phosphor | Cambiar los imports al integrar, §2.bis |

---

## 11. Pre-Flight — checklist de aceptación antes de llevar el output al repo

Cuatro bloques. **A** y **C** son los que se rompen solos; **B** es lo que separa un sitio
profesional de una plantilla; **D** es lo que tiene consecuencia legal o comercial. Si una
casilla no se puede marcar honestamente, el output no está listo.

Los bloques A, C y D son de este proyecto. El bloque B viene del Pre-Flight del skill
[`design-taste-frontend`](../../.claude/skills/design-taste-frontend/SKILL.md) §14, podado a
lo que aplica con los diales de §2.bis (6 / 3 / 4): se omitieron las casillas de modo oscuro,
serif, paletas premium-consumer, GSAP y marquees porque las decisiones de §2.bis las dejan sin
objeto. La mayoría de este bloque es **contable**, no opinable: se verifica con un `grep` o
contando elementos en la página.

### A. Versiones — lo primero que hay que revisar

Los generadores arrastran patrones de Tailwind v3 y Next.js 14 porque son los que dominan sus
datos de entrenamiento. Da por hecho que tendrás que corregir esto aunque el prompt lo prohíba:

- [ ] No existe `tailwind.config.ts` ni `tailwind.config.js` en el output.
- [ ] El CSS usa `@import "tailwindcss"`, no `@tailwind base/components/utilities`.
- [ ] Los tokens están en un bloque `@theme`, no en un objeto JS.
- [ ] Las páginas que usan `params` son `async` y hacen `await params`.
- [ ] No hay `forwardRef` en ningún componente (React 19 no lo necesita).
- [ ] Si generó un archivo de middleware, se llama `proxy.ts`.
- [ ] `package.json` declara `packageManager: "pnpm@10.34.3"` y `engines.node`.

### B. Anti-slop — layout, consistencia, imágenes y movimiento

**Hero y navegación**

- [ ] El hero entra completo en el viewport inicial: titular ≤ 2 líneas, subtítulo ≤ 20
      palabras y ≤ 4 líneas, CTA visible sin scroll. Verificado a 375px **y** a 1440px.
- [ ] Padding superior del hero ≤ `pt-24` en desktop. El contenido no flota a media pantalla.
- [ ] El hero tiene como máximo 4 elementos de texto. Los sellos RNT/ANATO/IATA y cualquier
      prueba social están en una sección **debajo** del hero, no dentro.
- [ ] `min-h-[100dvh]`, nunca `h-screen`.
- [ ] La navegación cabe en una sola línea en desktop y mide ≤ 80px de alto.
- [ ] Ningún `w-[calc(33%-1rem)]`: las columnas son CSS Grid.

**Repetición de estructura** (lo que hace que un sitio "se sienta" plantilla)

- [ ] Ninguna familia de layout se repite. Una home de 7-8 secciones usa ≥ 4 estructuras
      distintas.
- [ ] No hay 3 secciones seguidas con el patrón imagen-a-un-lado / texto-al-otro.
- [ ] No hay una fila de 3 tarjetas idénticas como recurso genérico.
- [ ] **Contar eyebrows** (etiquetas pequeñas en mayúsculas sobre un titular; firma CSS
      típica `uppercase tracking-[...]`). El total en la página es ≤ techo(nº de secciones / 3),
      contando el hero como uno.
- [ ] Ninguna sección usa el encabezado "titular grande a la izquierda + párrafo pequeño
      flotando a la derecha".
- [ ] Cada layout multicolumna declara su colapso a una columna bajo 768px en el mismo componente.

**Consistencia bloqueada**

- [ ] Un solo tema en toda la página. Ninguna sección invierte a modo oscuro.
- [ ] Un solo color de acento: el naranja es el CTA primario en todas las secciones.
- [ ] Una sola escala de radios (6 / 12 / 20 + full). Sin valores ad-hoc por componente.
- [ ] Ningún CTA repite intención con otro texto: "Cotiza por WhatsApp" y "Habla con un
      asesor" no conviven como el mismo botón en nav, hero y footer. Un texto por intención.
- [ ] Ningún texto de botón se parte en dos líneas en desktop.

**Imágenes e iconos**

- [ ] El hero tiene una imagen real. Texto sobre degradado no cuenta.
- [ ] Cada imagen usa foto real o `picsum.photos/seed/{seed-descriptivo}/...` con un seed que
      describe la sección. Ningún seed genérico tipo `1`, `abc`, `image`.
- [ ] Ningún SVG decorativo dibujado a mano (ilustraciones, marcas, mockups).
- [ ] Ninguna captura de pantalla o interfaz simulada con `<div>` apilados.
- [ ] Iconos únicamente de `@phosphor-icons/react` con `weight="regular"`. Ninguna familia
      mezclada, ningún `path` de SVG escrito a mano.

**Movimiento (dial 3)**

- [ ] `package.json` no incluye `framer-motion`, `motion`, `gsap` ni librerías de carrusel.
- [ ] No aparece `window.addEventListener('scroll')` en ningún archivo.
- [ ] No hay marquees, scroll-hijack, secciones pinned, parallax ni animaciones en bucle.
- [ ] Todo interactivo tiene feedback táctil en `:active` (`-translate-y-[1px]` o `scale-[0.98]`).
- [ ] Cualquier transición respeta `prefers-reduced-motion`.
- [ ] Los `useEffect` con listeners o timers tienen función de limpieza.

**Densidad y estados**

- [ ] Ningún subpárrafo de sección supera 25 palabras; ningún titular de sección supera 8.
- [ ] Ninguna lista de más de 5 ítems se renderiza como `<ul>` con una línea divisoria bajo
      cada fila. "Qué incluye / qué no incluye" está agrupado o en grid de tarjetas.
- [ ] Los testimonios ocupan ≤ 3 líneas y su atribución lleva nombre **y** rol.
- [ ] Existen los estados de carga (skeleton con la forma del contenido final, no spinner),
      vacío y error inline en formularios.

**Señales de "hecho por IA"** (grep-ables)

- [ ] Cero `—` y cero `–` en `messages/*.json` y en cualquier string visible.
- [ ] Sin eyebrows numerados (`01 / DESTINOS`, `002 · Paquetes`).
- [ ] Sin puntos de color decorativos en nav, listas o badges.
- [ ] Sin indicadores de scroll ("Scroll", "↓", "Desliza para explorar", mouse animado).
- [ ] Sin pills superpuestos sobre las fotos ni pies de foto decorativos ("Frame XII · 35mm").
- [ ] Sin franja decorativa bajo el hero ("VIAJA. DESCUBRE. VUELVE.").
- [ ] Sin etiquetas de versión o build en un sitio de marketing.
- [ ] Sin barras de progreso con fondo relleno como comparador.
- [ ] Sin franjas de ciudad/hora/clima. La dirección real en el footer sí; la decoración
      ambiental no.
- [ ] **Relectura de todo string visible**: ninguna frase gramaticalmente rota, ninguna
      metáfora forzada, ningún dato inventado con falsa precisión.

### C. Contraste y accesibilidad — se rompe en silencio, verificar en el navegador

- [ ] Ningún botón naranja con texto blanco (falla contraste AA).
- [ ] Ningún botón de WhatsApp con texto blanco sobre verde.
- [ ] El color de texto de cada botón se verifica **en el navegador**, no leyendo el
      código. `cn()` puede borrar una clase sin avisar si tailwind-merge no conoce
      los tokens `--text-*` (ver `lib/utils.ts`): el botón navy llegó a producción
      con texto neutral-900 sobre navy, 1.19:1, y el código decía `text-white`.
- [ ] Cada token `--text-*` nuevo declarado en `@theme` está también en `FONT_SIZE_TOKENS`
      de `lib/utils.ts`. Sin eso, el fallo anterior se repite.
- [ ] Cada combinación de color se midió sobre **las tres superficies claras** del sistema
      (blanco, `#F4F7FA` y el tinte 10% del propio color), no solo sobre blanco.
- [ ] `focus-visible` visible en todos los interactivos (navegación por teclado),
      **comprobado también sobre las secciones navy y turquesa**, no sólo sobre
      blanco. Un anillo de un solo color no cumple el 3:1 en los tres fondos.
- [ ] Los campos de formulario, sus placeholders, textos de ayuda y mensajes de error pasan
      AA contra el fondo de **su** sección, no contra blanco.
- [ ] Área táctil mínima de 44x44px en móvil para todo interactivo.
- [ ] Ningún `<img>` — todo con `next/image` y `sizes` definido.
- [ ] La vista de 375px se ve bien sin scroll horizontal.

### D. Contrato de negocio, legal y marca

- [ ] El checkbox de consentimiento NO viene pre-marcado en ningún formulario, y su texto
      nombra explícitamente la publicidad personalizada.
- [ ] Todo precio publicado va acompañado del bloque `PriceDisclosure` (ciudad de salida,
      ocupación base, noches, fecha de validación, RNT) — ningún "desde $" suelto.
- [ ] El tipo `Package` incluye `offerId`, `ciudadOrigen`, `ocupacionBase`,
      `vigenciaHasta`, `validadaEl` y `estado`.
- [ ] Existe el estado de tarifa vencida y NO es un 404 ni un precio tachado.
- [ ] El formulario captura ciudad de salida, y destino/`offerId` van en campos ocultos
      desde el contexto de página.
- [ ] El formulario NO pide presupuesto, ingresos ni estrato.
- [ ] El envío exitoso redirige a `/gracias`, y `/gracias` no está indexada.
- [ ] Cero strings hardcodeados en el JSX (todos en el objeto `copy`).
- [ ] Ningún número de RNT, NIT o teléfono inventado — todos placeholder con TODO.
- [ ] "BroWay Adventures" bien escrito en todas partes.
- [ ] "Next Stop" aparece máximo una vez por página.
- [ ] Ninguna palabra de la lista prohibida (§2) en el copy.
- [ ] Ningún countdown ni temporizador.

---

## 12. Pendientes de marca que bloquean el diseño final

El manual de marca v2.0 **no incluye** (a pesar de anunciarlas en su índice) estas
secciones. Hay que resolverlas con quien mantiene la marca antes de cerrar el design
system:

1. **Tipografías oficiales** — se está usando una sustituta de Google Fonts.
2. **Códigos de color exactos** — los hex de este brief se extrajeron del PNG del logo, no
   de una guía oficial. Falta confirmar si hay valores Pantone/CMYK definidos.
3. **Lineamientos de fotografía** — estilo, tratamiento, qué se puede y qué no. Mientras
   tanto rige la regla de §2.bis: fotografía real o placeholder de `picsum.photos` con seed
   descriptivo, nunca ilustración SVG dibujada a mano.
4. **Iconografía** — familia de íconos oficial. **Decisión técnica provisional tomada:**
   `@phosphor-icons/react` con `weight="regular"` en todo el sitio (§2.bis). Se decidió antes
   de instalar shadcn/ui a propósito, porque shadcn arrastra `lucide-react` y cambiar de
   familia con componentes ya escritos obliga a tocar cada import. Si la marca define otra
   familia, se cambia el paquete y el prop de peso en un solo lugar; si define íconos
   propios, se reemplazan solo los de marca y Phosphor queda para los de interfaz.
5. **Archivos vectoriales del logo** (SVG) en sus 4 versiones: horizontal, vertical,
   isotipo y favicon. Hoy solo hay un PNG; el favicon debe ser el símbolo solo, nunca el
   logo completo reducido.
