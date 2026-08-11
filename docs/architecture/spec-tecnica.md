# BroWay Adventures — Especificación Técnica del Sitio Web

**Stack:** Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + componentes propios, sobre Vercel
**Runtime:** Node.js 24.14.1 · **Gestor de paquetes:** pnpm 10.34.3
**Requisitos transversales desde Fase 0:** sitio multilenguaje (Español/Inglés) y sistema de diseño propio, escalable según la fase del proyecto.

Este documento complementa `sistema-comercial.md` (el roadmap comercial del cliente, del cual este sitio es una pieza — ver §8), `investigation.md` (research), `mvp-features.md` (features del MVP) y `fases-entrega.md` (roadmap por fases). Aquí se define **cómo se construye técnicamente**, no qué se construye — ese "qué" no cambia; lo que se agrega es que el multilenguaje y el design system dejan de ser features de fase 2 y pasan a ser cimientos desde el día 1.

---

## 1. Por qué i18n y design system van en Fase 0

- **Multilenguaje:** el informe identifica destinos internacionales y un modelo de pauta que puede escalar fuera de Colombia. Añadir un segundo idioma después de lanzar obliga a re-arquitecturar rutas, SEO (hreflang) y el modelo de contenido del CMS — más costoso que planearlo desde el inicio. Con `next-intl` y rutas por locale, el costo marginal de agregar EN sobre una base ya preparada es bajo.
- **Sistema de diseño:** el informe es enfático en velocidad móvil (83% del tráfico, sub-1s ideal) y en *message match* entre anuncio y landing. Sin tokens y componentes consistentes desde el inicio, cada landing nueva de campaña se construye ad-hoc, se degrada la velocidad y la coherencia visual — justo lo que el informe marca como causa de abandono. No implica construir un design system "enterprise" en el MVP; implica que la Fase 0 defina las fundaciones correctas para que crecer no signifique reescribir.

---

## 2. Arquitectura técnica

### 2.0 Versiones fijadas del entorno

Estas versiones no son "mínimos sugeridos": son las versiones con las que se construye y se
despliega. Fijarlas evita que un `pnpm install` en otra máquina resuelva un árbol distinto.

| | Versión | Cómo se fija |
|---|---|---|
| Node.js | **24.14.1** | `.nvmrc` + `engines.node` en `package.json` + versión de Node en Vercel |
| pnpm | **10.34.3** | `packageManager` en `package.json` (Corepack lo respeta automáticamente) |
| Next.js | **16.x** | dependencia exacta |
| React / React DOM | **19.x** | dependencia exacta |
| Tailwind CSS | **4.x** | dependencia exacta |

```jsonc
// package.json (fragmento)
{
  "packageManager": "pnpm@10.34.3",
  "engines": { "node": ">=24.14.1 <25" }
}
```

Habilitar Corepack (`corepack enable`) para que la versión de pnpm se tome del campo
`packageManager` y nadie tenga que instalarla a mano. En Vercel, fijar la versión de Node en
la configuración del proyecto para que coincida con `.nvmrc`.

### 2.1 Stack base

| Capa | Herramienta | Fase |
|---|---|---|
| Runtime | Node.js 24.14.1 | 0 |
| Gestor de paquetes | pnpm 10.34.3 (vía Corepack) | 0 |
| Framework | Next.js 16 (App Router, Turbopack) | 0 |
| Librería UI | React 19 | 0 |
| Hosting | Vercel (Edge Network, Image Optimization) | 0 |
| i18n | `next-intl` | 0 |
| Estilos / tokens | Tailwind CSS v4 (configuración CSS-first con `@theme`) | 0 |
| Componentes UI | Componentes propios sobre `cva` + `cn()` (convenciones de shadcn, sin su CLI — ver §4.1) | 0 |
| CMS headless | **Sin CMS en Fase 1.** El cliente confirmó el 2026-08-05 que no existe ninguno; el contenido editorial vive en el repo tras `lib/destinations/` y `lib/campaigns/`. Se reevalúa en Fase 2 | 2 |
| Base de ofertas | **No existe todavía** (confirmado 2026-08-05). Las tarifas viven en el repo tras `lib/offers/`, con su ciclo de vida completo: `offerId`, `vigenciaHasta` y `validadaEl` siguen siendo obligatorios | 1 |
| CRM | **GoHighLevel** (Starter + add-on de WhatsApp) — fuera de este repo, lo monta el proveedor del sistema comercial | 1 (en paralelo) |
| Formularios/Leads | API routes → webhook a GoHighLevel (§8) | 0-1 |
| Pagos | Wompi o PayU | 2 |
| Tracking server-side | Meta CAPI, TikTok Events API (API routes) — solo el evento `Lead`; el embudo posterior lo emite el CRM (§8.5) | 2 |
| Documentación del design system | Página `/design-system` interna | 0-1 → Storybook en Fase 2-3 |

### 2.1.1 Consecuencias de Next.js 16 que afectan al código desde el día 1

No son detalles de actualización: cambian cómo se escribe el código base, así que hay que
construirlo así desde el inicio en lugar de migrarlo después.

- **`params` y `searchParams` son asíncronos.** El acceso síncrono fue eliminado por
  completo. Toda página, layout y route handler que los use debe declararse `async` y
  hacer `await`. Igual para `cookies()` y `headers()`. Como el sitio entero vive bajo
  `app/[locale]/...`, esto aplica a **todas** las páginas:

  ```tsx
  export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    // ...
  }
  ```

- **`middleware.ts` se llama ahora `proxy.ts`.** Relevante porque la detección de idioma de
  `next-intl` (§3.3) vive justamente ahí.
- **Turbopack es el bundler por defecto** en `next dev` y `next build`; webpack ya no lo es.
  No agregar configuración de webpack salvo necesidad comprobada.
- **Cache Components y la directiva `use cache`** reemplazan el modelo de caché anterior.
  Revisar cómo se expresa el ISR (§2.2) al configurar el proyecto.

### 2.2 Renderizado

- Páginas de contenido (home, destinos, paquetes, blog, legal): **SSG con ISR** (revalidate periódico, ej. cada hora, o on-demand revalidation al publicar en el CMS).
- Landings de campaña (`/lp/[campana]`): SSG con ISR, para poder editar copy/oferta sin redeploy.
- Formularios y checkout: rutas dinámicas / API routes (server-side).

---

## 3. Internacionalización (i18n) — Fase 0

### 3.1 Estrategia de routing

Prefijo de locale en todas las rutas, con `es` como idioma por defecto y `en` como secundario (estrategia "as-needed" de `next-intl`: `es` sin prefijo, `en` con prefijo `/en`):

```
/                              → Home (es, por defecto)
/en                            → Home (en)
/destinos/eje-cafetero         → es
/en/destinos/eje-cafetero      → en
/lp/meta-eje-cafetero          → es
/en/lp/meta-eje-cafetero       → en
```

Justificación: la audiencia primaria es hispanohablante en Colombia; no forzar `/es/` en cada URL evita fricción SEO y de campaña (los links de anuncios en Español quedan más cortos y limpios).

**Slugs:** en el MVP, mismo slug en ambos idiomas (`/destinos/eje-cafetero` y `/en/destinos/eje-cafetero`) para simplificar el modelo de contenido y no duplicar mantenimiento de URLs. Slugs localizados (`/en/destinations/coffee-region`) se evalúan en Fase 2 si el SEO en inglés lo justifica.

### 3.2 Librería recomendada: `next-intl`

- Integración nativa con App Router (Server Components).
- Manejo de mensajes de UI (`messages/es.json`, `messages/en.json`) para textos fijos (botones, labels, footer, legal boilerplate).
- El contenido editorial (destinos, paquetes, blog) **no** vive en estos JSON — vive en el CMS con su propio modelo multilenguaje (ver 3.4).

### 3.3 Selector y detección de idioma

- El **`proxy.ts`** de Next.js (lo que hasta la v15 era `middleware.ts`) detecta `Accept-Language` del navegador en la primera visita y redirige al locale correspondiente (fallback a `es`). Verificar que la versión de `next-intl` que se instale ya soporte esta convención de Next.js 16.
- Selector de idioma visible en header/footer; la elección se persiste en cookie (`NEXT_LOCALE`) para visitas futuras.
- El cambio de idioma debe mantener al usuario en la misma página (no rebota al home) — crítico para no romper el *message match* de una landing de campaña.

### 3.4 Contenido multilenguaje en el CMS

- El modelo de datos de destinos, paquetes y blog debe soportar campos traducibles desde el schema inicial (no como campo "extra" después):
  - Sanity: plugin de i18n (documentos con campo `language` o `sanity-plugin-internationalized-array`).
  - Contentful: locales nativos por espacio (`es-CO` / `en-US`).
  - Strapi: plugin i18n oficial.
- Campos que **sí** deben traducirse: título, descripción, highlights, itinerario, qué incluye/no incluye, FAQ, meta title/description.
- Campos que **no** se traducen: precio, fechas, slug (en MVP), imágenes (a menos que el copy esté embebido en la imagen).

### 3.5 SEO multilenguaje

- Etiquetas `hreflang` alternas (`es`/`en`/`x-default`) generadas automáticamente por `next-intl` + Metadata API en cada página.
- Sitemap.xml con entradas para ambos locales.
- Meta title/description traducidos por página (desde el CMS, no genéricos).

### 3.6 WhatsApp y CTAs localizados

- El mensaje pre-llenado de `wa.me` debe generarse en el idioma activo de la página (ej. "Hola, quiero cotizar el paquete Eje Cafetero" vs. "Hi, I'd like a quote for the Coffee Region package").
- El asesor que recibe leads en inglés debe estar identificado en el CRM (etiqueta de idioma) para enrutar al agente correcto o usar respuestas plantilla en inglés.

### 3.7 Legal por idioma

- Política de datos (Ley 1581 de 2012) y RNT se muestran en español como versión legal oficial; la versión en inglés se marca como traducción informativa, no sustituye el documento legal en español, para evitar ambigüedad regulatoria.
- El **Registro de Números Excluidos (RNE)** — vigente desde abril de 2024, permite excluirse de mensajería comercial por apps de mensajería, correo y llamadas — se menciona en `/legal` en ambos idiomas, con el canal para ejercerlo. La lista de supresión operativa vive en el CRM, no en el sitio; lo que el sitio debe garantizar es que no promete lo contrario: enviar el formulario no equivale a autorizar campañas indefinidas por todos los canales.
- La **versión** del texto de la política es un dato, no una nota al pie: se versiona (`v1`, `v2`…) y se registra en cada lead (§8.3). Si el texto cambia, la versión cambia — es lo que permite demostrar después qué aceptó exactamente cada persona.

---

## 4. Sistema de diseño — escalado por fase

El principio es **un solo sistema que crece**, no un rediseño en cada fase. Fase 0 define las fundaciones; las fases siguientes agregan estructura y gobierno, no cambian los tokens base salvo que el research lo justifique.

### 4.1 Fase 0 — Fundaciones (obligatorio antes de construir cualquier página)

**Design tokens.** Con Tailwind v4 la configuración es **CSS-first**: los tokens se declaran en
un bloque `@theme` dentro del CSS y Tailwind genera a partir de ahí tanto las clases utilitarias
como las CSS variables en tiempo de ejecución. **Ya no existe `tailwind.config.ts`** como
mecanismo principal — la directiva `@config` solo sobrevive para compatibilidad con proyectos
heredados y aquí no aplica, porque el proyecto arranca en v4.

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-brand-navy: #003062;
  --color-brand-turquoise: #00aac3;
  --color-brand-orange: #ff6a03;
  --color-whatsapp: #25d366;
  /* tipografía, espaciado, radios, breakpoints… */
}
```

Esto elimina la duplicación que existía en v3 (declarar la variable en CSS y volver a mapearla
en el config): un token declarado en `@theme` ya queda disponible como `bg-brand-navy` y como
`var(--color-brand-navy)` sin trabajo adicional.

Tokens a definir:
- Color: marca primaria, secundaria, acento (CTA/WhatsApp usa un color de alto contraste dedicado, ver informe sobre CTA de alta visibilidad), escala de neutros, estados (éxito/error/advertencia). Los valores de marca están en [`../design/brief-v0.md`](../design/brief-v0.md) §2, extraídos del logo oficial y con sus ratios de contraste verificados.
- Tipografía: familia (legible, nivel de lectura simple según el informe), escala tipográfica (mobile-first: definir tamaños para móvil primero, luego escalar a desktop), pesos.
- Espaciado: escala consistente (4/8px base).
- Radios y sombras: set reducido (2-3 valores), no ad-hoc por componente.
- Breakpoints: mobile-first, con el breakpoint principal pensado para el 83% de tráfico móvil.
- Iconografía: **una sola familia en todo el proyecto**, con el peso de trazo fijado
  globalmente. Default técnico: `@phosphor-icons/react` con `weight="regular"`. Es una
  decisión de Fase 0 y no de detalle: shadcn/ui trae `lucide-react` por defecto, así que
  instalarlo sin haber decidido antes deja la familia elegida de facto y obliga a reescribir
  imports después. La familia oficial de marca sigue pendiente
  ([`../design/brief-v0.md`](../design/brief-v0.md) §12.4); nunca se dibujan `path` de SVG
  a mano ni se mezclan dos familias.

**Componentes base** (los mínimos para construir el MVP sin improvisar). Se escriben a mano
contra los tokens de marca, siguiendo las convenciones de shadcn (`cva` para variantes, `cn()`
con `tailwind-merge`) **pero sin su CLI**; con React 19 no hace falta `forwardRef` para exponer
la ref, `ref` se pasa como una prop más:

> **No correr `shadcn init` en este repo.** Se probó el 4 de agosto de 2026: sobrescribe
> `lib/utils.ts` (borrando `FONT_SIZE_TOKENS` y con ello la protección contra el fallo de
> contraste mudo), sobrescribe `components/ui/button.tsx` con sus reglas de contraste
> verificadas, duplica el sistema de tokens en `globals.css`, e instala `lucide-react` y
> `tw-animate-css` — las dos cosas que §4.1 y `brief-v0.md` §2.bis prohíben. Sus presets
> empaquetan familia de íconos y tipografía, así que no hay configuración que lo evite.
> Cuando haga falta una primitiva accesible (Dialog, Select), se instala `radix-ui` directo
> y se escribe el wrapper a mano. Detalle en
> [`../product/plan-fase-1.md`](../product/plan-fase-1.md) §4, Paso 0.
- Botón (primario, secundario, WhatsApp — variante con ícono).
- Input / Textarea / Checkbox (para el formulario corto y el checkbox de autorización de datos).
- Card (destino, paquete).
- Badge (trust badge: RNT, ANATO/IATA).
- Navbar + selector de idioma + WhatsApp flotante.
- Footer.
- Sección Hero (para home y landings).

**Documentación:** una página interna `/design-system` (no pública, protegida o simplemente no enlazada) que renderiza cada token y componente con sus variantes — sirve de referencia viva sin invertir en Storybook todavía.

**Dirección visual y control de calidad.** Los tokens y componentes definen el *vocabulario*; no
definen cómo se compone una página con él. Eso vive en [`../design/brief-v0.md`](../design/brief-v0.md):
§2.bis fija la dirección de diseño (los tres diales, y los overrides frente al skill
`design-taste-frontend`) y §11 es el Pre-Flight que se corre antes de aceptar cualquier página
en el repo. Las decisiones de §2.bis que afectan a este documento son tres: sin librerías de
animación, modo claro únicamente y una sola familia de iconos.

### 4.2 Fase 2 — Expansión

- Nuevos componentes: Acordeón/Tabs (itinerario día a día), Steppers (checkout de pago), componentes de Quiz, tarjetas de FAQ con schema, componentes de blog (artículo, listado, tags).
- Migrar la documentación de `/design-system` a **Storybook**, ahora que hay suficientes componentes para justificar la infraestructura.
- Introducir theming si se lanza una sub-marca o landing con identidad visual distinta por campaña (manteniendo los mismos tokens base, solo variando acentos).
- Revisión de accesibilidad básica (contraste, foco, labels) sobre los componentes existentes.

### 4.3 Fase 3 — Madurez

- Testing visual de regresión (Chromatic u otra herramienta sobre Storybook) para evitar romper el sistema al escalar a booking engine / portal de cliente.
- Sincronización de tokens con Figma (Tokens Studio) si el equipo de diseño crece y necesita handoff formal.
- Gobierno del design system: changelog de componentes, guía de contribución, versión semántica del paquete interno de UI si el sitio se separa en múltiltiples apps (ej. portal de cliente aparte del sitio de marketing).
- Auditoría de accesibilidad completa (WCAG AA) dado que ya hay flujos transaccionales (pagos, portal).

### 4.4 Regla de decisión

No agregar infraestructura de design system (Storybook, tokens sync, testing visual) antes de que el número de componentes o de personas tocando UI lo justifique — hacerlo antes en el MVP es sobre-ingeniería y retrasa el lanzamiento. La página interna `/design-system` de Fase 0 ya cumple el propósito de consistencia mientras el equipo es pequeño.

---

## 5. Estructura de carpetas propuesta (Fase 0)

```
app/
  globals.css                   → @import "tailwindcss" + @theme con los design tokens
  [locale]/
    layout.tsx                  → layout con NavBar, Footer, WhatsApp flotante, provider de i18n
    page.tsx                    → Home
    destinos/
      page.tsx
      [slug]/page.tsx
    paquetes/
      page.tsx                  → listado de ofertas vigentes
      [slug]/page.tsx
    lp/
      [campana]/page.tsx
    nosotros/page.tsx
    contacto/page.tsx
    gracias/page.tsx            → confirmación post-lead (no indexada)
    faq/page.tsx
    legal/page.tsx
    design-system/page.tsx      → guía viva de componentes (no indexada)
  api/
    lead/route.ts               → valida, normaliza E.164, registra consentimiento,
                                  webhook a GoHighLevel, emite Lead (§8.2)
    meta-capi/route.ts          → Fase 2 — solo el evento Lead (§8.5)
    tiktok-events/route.ts      → Fase 2 — solo el evento Lead (§8.5)
  sitemap.ts
  robots.ts
messages/
  es.json
  en.json
components/
  ui/                           → Button, Input, Card, Badge, etc. (design system)
  sections/                     → Hero, PackageCard, ItinerarySection, TrustBadges
  layout/                       → NavBar, Footer, WhatsAppFloating, LanguageSwitcher
lib/
  i18n/                         → config next-intl
  cms/                          → clientes/queries al CMS headless (contenido editorial)
  offers/                       → acceso a la base de ofertas + helpers de vigencia (§8.4)
  crm/                          → payload y cliente del webhook a GoHighLevel (§8.2)
  consent/                      → versión de la política y armado del registro (§8.3)
  tracking/                     → helpers de eventos (GA4, pixels), eventId/externalId
proxy.ts                        → detección de locale (en Next.js ≤15 esto era middleware.ts)
.nvmrc                          → 24.14.1
package.json                    → packageManager: pnpm@10.34.3, engines.node
```

Nota: ya no hay `tailwind.config.ts` ni `styles/tokens.css`. En Tailwind v4 ambos se colapsan en
el bloque `@theme` de `app/globals.css` (§4.1).

---

## 6. Requisitos no funcionales

- **Performance:** Core Web Vitals en verde para ambos locales; imágenes vía `next/image`; JS de terceros (pixels) cargado con `next/script` en modo diferido o server-side.
- **Accesibilidad:** mínimo AA en componentes base desde Fase 0 (contraste, labels de formularios, navegación por teclado) — más barato de construir bien desde el inicio que de retrofit en Fase 3.
- **SEO:** metadata dinámica y `hreflang` correctos desde el primer deploy; sitemap por locale.
- **Seguridad:** validación server-side de formularios, checkbox de consentimiento no pre-marcado (Ley 1581), variables sensibles (tokens de CAPI, CMS, pasarela) en Vercel Environment Variables, nunca en el repo.

---

## 7. Checklist de arranque (Fase 0, antes de construir páginas de contenido)

0. **Titularidad de cuentas resuelta antes de crear nada**: dominio, Vercel, repositorio, GA4, GTM, pixel y datasets a nombre del cliente, no de quien implementa. Es requisito contractual del roadmap comercial y es mucho más barato hacerlo bien que migrarlo después. (Hoy el repo vive en una cuenta personal — ver `mvp-features.md` §Riesgos.)
1. Entorno fijado: `.nvmrc` con `24.14.1`, `packageManager: "pnpm@10.34.3"` en `package.json`, Corepack habilitado, y la versión de Node del proyecto en Vercel alineada con `.nvmrc`.
2. Repo Next.js 16 + React 19 + Vercel conectado, deploy de "hola mundo" funcionando en ambos locales (`/` y `/en`).
3. `next-intl` configurado con detección de idioma en `proxy.ts` y selector persistente. Confirmar compatibilidad de la versión de `next-intl` con Next.js 16 antes de fijarla.
4. Frontera CMS / base de ofertas decidida (§8.4 y `mvp-features.md` §Riesgos): qué sistema es dueño de la tarifa y cómo la lee el sitio. Con esto resuelto, CMS headless elegido y modelo de contenido definido con soporte multilenguaje para destinos.
5. Contrato de `/api/lead` acordado por escrito con quien monte GoHighLevel (§8.2): campos de contacto vs. campos de oportunidad, `offerId`, `event_id`, campos de consentimiento. **Antes** de construir el formulario — en GHL un campo creado para un tipo de objeto no se puede convertir al otro.
6. Tokens de diseño definidos y aprobados en el `@theme` de `app/globals.css` (color, tipografía, espaciado, radios, breakpoints).
7. Componentes base construidos y documentados en `/design-system`.
8. Layout base (NavBar, Footer, WhatsApp flotante, selector de idioma) funcionando en ambos idiomas.
9. Página legal (`/legal`) y checkbox de consentimiento listos antes de publicar cualquier formulario, con la versión de la política ya fijada (§8.3).

A partir de este checklist, el desarrollo de Fase 1 (home, landings, fichas de paquete) descrito en `mvp-features.md` avanza sobre una base ya bilingüe, con sistema de diseño y con el contrato de datos cerrado, sin retrabajo posterior.

---

## 8. Contrato de datos con el sistema comercial

El sitio es un satélite de **GoHighLevel** ([`sistema-comercial.md`](../research/sistema-comercial.md)). Esta sección define la frontera: qué entrega el sitio, en qué forma, y qué no le corresponde.

### 8.1 Reparto de responsabilidades

| | Lo hace el sitio | Lo hace el CRM / el agente |
|---|---|---|
| Capturar el lead | ✅ | ✅ (otras fuentes) |
| Registrar el consentimiento | ✅ (es el punto de autorización) | almacena la evidencia |
| Precalificar | mínimo (4 campos) | conversación progresiva y scoring |
| Cotizar | ❌ nunca | ✅ |
| Comparar mayoristas | ❌ nunca | ✅ |
| Pipeline y seguimiento | ❌ | ✅ |
| Eventos de conversión | solo `ViewContent` y `Lead` | todo el embudo posterior |

Regla práctica: si un dato cambia por una conversación, no es del sitio.

### 8.2 Payload de `/api/lead`

`/api/lead` es propio (no un iframe embebido del CRM): hace falta para validar en servidor, controlar el consentimiento y no degradar el LCP. Postea a GoHighLevel por webhook. Estructura mínima:

```jsonc
{
  // Identidad — alimenta la deduplicación de contactos del CRM
  "nombre": "…",
  "telefono": "+573001234567",     // normalizado a E.164 en el servidor
  "email": "…",                    // opcional en MVP

  // Intención de viaje — son campos de OPORTUNIDAD en GHL, no de contacto
  "offerId": "OF-2026-0142",       // null si el lead no vino de una ficha
  "destino": "eje-cafetero",
  "ciudadOrigen": "Medellín",
  "fechaAproximada": "2026-03",
  "flexibilidad": "±1 semana",
  "viajeros": { "adultos": 2, "menores": 1 },

  // Origen y atribución
  "fuente": "web",
  "utm": { "source": "…", "medium": "…", "campaign": "…", "content": "…" },
  "paginaOrigen": "/paquetes/eje-cafetero-4-dias",
  "locale": "es",

  // Deduplicación de conversiones (§8.5)
  "eventId": "…",
  "externalId": "…",

  // Consentimiento (§8.3)
  "consentimiento": { }
}
```

Notas que no son cosméticas:

- **Contacto vs. oportunidad.** Nombre, teléfono, ciudad y consentimiento son del **contacto** (estables). Destino, fechas, viajeros y `offerId` son de la **oportunidad** (una persona puede cotizar Cartagena hoy y Cancún en seis meses, y lo segundo no debe pisar lo primero). En GHL esa distinción se fija al crear el campo y **no se puede cambiar después** — por eso el contrato se acuerda antes de codificar.
- **Teléfono en E.164** siempre. Sin eso la deduplicación de contactos falla y el mismo lead entra dos veces.
- **Presupuesto no se pide en el formulario.** Es alta fricción y el agente lo obtiene mejor en conversación. Tampoco se piden ingresos, estrato ni capacidad crediticia: no aportan y son sensibles.

### 8.3 Registro del consentimiento

El checkbox no pre-marcado es necesario pero no suficiente. Cada lead guarda la **evidencia**:

```jsonc
"consentimiento": {
  "otorgado": true,
  "textoAceptado": "Autorizo a … conforme a la Política de Tratamiento de Datos.",
  "versionPolitica": "v1",
  "fechaHora": "2026-03-14T15:22:31-05:00",
  "formularioOrigen": "/paquetes/eje-cafetero-4-dias#form-cotizacion",
  "identificadorTecnico": "…",        // IP o equivalente disponible
  "canalesAutorizados": ["whatsapp", "llamada", "correo", "publicidad"],
  "revocado": false
}
```

- **La finalidad declarada debe cubrir el uso real.** Si los leads alimentan audiencias de Meta, el texto tiene que nombrar la publicidad personalizada — "contacto comercial para asesoría de viaje" no lo cubre. El texto base está en `sistema-comercial.md`; la versión definitiva la valida un abogado colombiano.
- `otorgado: false` no es un lead a medias: es un lead que **no se puede contactar comercialmente**. El servidor rechaza el envío si el checkbox no está marcado; nunca se infiere el consentimiento del hecho de haber enviado el formulario.
- La revocación se gestiona en el CRM, pero el sitio debe exponer el canal para ejercerla en `/legal`.

### 8.4 Ciclo de vida de la oferta

Una tarifa publicada no es un número en un campo de texto. El tipo que consume el sitio:

```ts
type Offer = {
  offerId: string;
  slug: string;
  destino: string;
  ciudadOrigen: string;        // "desde Bogotá" cambia el precio; nunca omitirlo
  noches: number;
  ocupacionBase: string;       // la ocupación con la que se calculó el "desde"
  precioDesde: number;
  moneda: "COP" | "USD";
  incluye: string[];
  noIncluye: string[];
  vigenciaHasta: string;       // ISO
  validadaEl: string;          // ISO — última verificación humana
  estado: "vigente" | "vencida" | "borrador";
};
```

Reglas:

- **El sitio solo renderiza `estado: "vigente"`.** Una oferta en `borrador` (extraída por IA pero sin validar humanamente) nunca llega a producción — es el riesgo "agente que inventa tarifas" del roadmap comercial.
- **Cuando `vigenciaHasta` pasa, la página no se cae ni miente.** No es un 404 ni un precio tachado: es un estado explícito — "Esta tarifa estuvo vigente hasta el [fecha]. Te preparamos una actualizada" — con CTA de recotización. Un visitante que llega a una oferta vencida sigue siendo un lead válido y con intención alta.
- **Bloque de disclosure obligatorio junto al precio**: "desde $X por persona", ciudad de salida, noches, ocupación base, qué incluye, "Tarifa verificada el [`validadaEl`], sujeta a disponibilidad y reconfirmación" y el RNT. Va en el componente `PriceDisclosure`, con el mismo peso tipográfico que el precio — no en letra chica.
- Esto **no** contradice la prohibición de marca sobre la urgencia falsa: la vigencia es un dato real y verificable, no un contador que se reinicia.

### 8.5 Eventos y deduplicación

| Evento | Lo emite | Cuándo |
|---|---|---|
| `ViewContent` | Sitio, client-side | vista de ficha de oferta |
| `Lead` | Sitio, `/api/lead` server-side | formulario enviado o clic a WhatsApp |
| `QualifiedLead`, `QuoteRequested`, `QuoteSent`, `BookingStarted`, `DepositPaid`, `Sale` | GoHighLevel | cambios de etapa del pipeline |

- El `eventId` se genera en `/api/lead` y se envía **tanto** a Meta/TikTok como al CRM en el payload. El `externalId` es estable por contacto. Sin esos dos campos compartidos las conversiones se cuentan dos veces y la optimización de campaña se degrada.
- El sitio **no** intenta emitir eventos de embudo que no puede conocer. Si hace falta un evento nuevo post-lead, se agrega en el CRM.
- Los UTMs se persisten desde la landing (sessionStorage + cookie) y viajan en el payload; sin eso la atribución muere en el salto a WhatsApp.
