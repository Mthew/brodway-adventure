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

En cada prompt nuevo, **pega antes el bloque "Reglas globales" (§2)**. v0 no recuerda contexto
entre chats distintos.

---

## 2. Reglas globales — pegar al inicio de CADA prompt

```text
CONTEXTO DE PROYECTO — BroWay Adventures

Agencia de viajes en Medellín, Colombia. El sitio NO es e-commerce ni motor de reservas:
es una máquina de captación de leads. El objetivo único es que el visitante escriba por
WhatsApp o deje un formulario corto. No hay carrito, no hay checkout, no hay inventario
en tiempo real.

STACK OBLIGATORIO
- Next.js 14+ App Router, TypeScript, Tailwind CSS, shadcn/ui como base de componentes.
- Server Components por defecto; "use client" SOLO donde haya interacción real.
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
     Para texto naranja sobre blanco usa #C24A00; para turquesa usa #007D91.

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

## 3. PROMPT 0 — Design system (ejecutar primero)

> Corresponde al checklist de Fase 0, puntos 4 y 5 de [`spec-tecnica.md`](../architecture/spec-tecnica.md) §7.

```text
[PEGAR AQUÍ EL BLOQUE "REGLAS GLOBALES" DE §2]

TAREA: construir SOLO el sistema de diseño — tokens y componentes base. Todavía NO
construyas ninguna página de contenido.

1) TOKENS
Crea `styles/tokens.css` con CSS custom properties y mapéalos en `tailwind.config.ts`
para que se usen como clases utilitarias (bg-brand-navy, text-brand-orange, etc.):

- Color: los 4 de marca + escala de neutros fría de 50 a 900 + estados (success, error,
  warning, info). Incluye las variantes accesibles de naranja (#C24A00) y turquesa
  (#007D91) para texto sobre fondo claro.
- Tipografía: escala mobile-first. Define tamaños para móvil primero y su escalado a
  desktop con clamp(). Niveles: display, h1, h2, h3, body-lg, body, body-sm, caption.
  Pesos: 400 / 500 / 600 / 700.
- Espaciado: escala base 4px (4, 8, 12, 16, 24, 32, 48, 64, 96).
- Radios: solo 3 valores (sm 6px, md 12px, lg 20px) + full para pills.
- Sombras: solo 3 valores (sm, md, lg), suaves, con tinte azulado no negro puro.
- Breakpoints mobile-first: sm 640 / md 768 / lg 1024 / xl 1280.

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

Entrega el código completo de tokens.css, tailwind.config.ts, cada componente y la
página /design-system.
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

Datos: define un tipo TypeScript `Package` y un mock en lib/mock/packages.ts (el CMS se
conecta después). Campos: slug, titulo, destino, duracionDias, beneficioCorto,
precioDesde, moneda, imagenes[], highlights[], itinerario[{dia,titulo,descripcion}],
incluye[], noIncluye[], fechasSalida[{fecha,cuposDisponibles}], politicaCancelacion,
faq[{pregunta,respuesta}].

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
Máximo 4 campos: Nombre, WhatsApp/teléfono, Fecha aproximada de viaje, Número de
viajeros. Más el checkbox de consentimiento (ver reglas abajo). Botón "Cuéntanos cómo
quieres viajar".

10) TRUST BADGES + PAQUETES RELACIONADOS

CHECKBOX DE CONSENTIMIENTO — REQUISITO LEGAL (Ley 1581 de 2012), no es opcional:
- NO puede venir pre-marcado. Nunca `defaultChecked`.
- El envío del formulario está deshabilitado hasta que se marque.
- Texto: autorización expresa para el tratamiento de datos personales, con la finalidad
  declarada (contacto comercial para asesoría de viaje) y un enlace a /legal.
- Debe mencionar el derecho a consultar, actualizar y suprimir los datos.

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

## 9. PROMPT 6 — Nosotros, Contacto, Cómo pagar y Legal

```text
[PEGAR REGLAS GLOBALES §2]

TAREA: las cuatro páginas institucionales. Son las que dan credibilidad — el objetivo
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

D) `app/[locale]/legal/page.tsx`
- Navegación por secciones (índice lateral en desktop, acordeón en móvil):
  1. Política de tratamiento de datos personales (Ley 1581 de 2012): finalidad,
     responsable, derechos del titular (consultar, actualizar, suprimir), canal para
     ejercerlos, y aviso de transferencia internacional si el CRM está fuera de Colombia.
  2. Términos y condiciones.
  3. Política de cancelación y cambios.
  4. Aviso ESCNNA (Ley 679 de 2001).
  5. Registro Nacional de Turismo (RNT).
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

---

## 11. Checklist de revisión antes de aceptar el output

Cuando v0 entregue, verifica esto antes de llevarlo al repo:

- [ ] Ningún botón naranja con texto blanco (falla contraste AA).
- [ ] Ningún botón de WhatsApp con texto blanco sobre verde.
- [ ] `focus-visible` visible en todos los interactivos (navegación por teclado).
- [ ] Ningún `<img>` — todo con `next/image` y `sizes` definido.
- [ ] El checkbox de consentimiento NO viene pre-marcado en ningún formulario.
- [ ] Cero strings hardcodeados en el JSX (todos en el objeto `copy`).
- [ ] Ningún número de RNT, NIT o teléfono inventado — todos placeholder con TODO.
- [ ] "BroWay Adventures" bien escrito en todas partes.
- [ ] "Next Stop" aparece máximo una vez por página.
- [ ] Ninguna palabra de la lista prohibida (§2) en el copy.
- [ ] Ningún countdown ni temporizador.
- [ ] La vista de 375px se ve bien sin scroll horizontal.
- [ ] Sin framer-motion ni librerías de carrusel en `package.json`.

---

## 12. Pendientes de marca que bloquean el diseño final

El manual de marca v2.0 **no incluye** (a pesar de anunciarlas en su índice) estas
secciones. Hay que resolverlas con quien mantiene la marca antes de cerrar el design
system:

1. **Tipografías oficiales** — se está usando una sustituta de Google Fonts.
2. **Códigos de color exactos** — los hex de este brief se extrajeron del PNG del logo, no
   de una guía oficial. Falta confirmar si hay valores Pantone/CMYK definidos.
3. **Lineamientos de fotografía** — estilo, tratamiento, qué se puede y qué no.
4. **Iconografía** — familia de íconos oficial.
5. **Archivos vectoriales del logo** (SVG) en sus 4 versiones: horizontal, vertical,
   isotipo y favicon. Hoy solo hay un PNG; el favicon debe ser el símbolo solo, nunca el
   logo completo reducido.
