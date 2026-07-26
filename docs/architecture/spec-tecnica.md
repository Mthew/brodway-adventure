# Brodway Adventure — Especificación Técnica del Sitio Web

**Stack:** Next.js (App Router) + Vercel
**Requisitos transversales desde Fase 0:** sitio multilenguaje (Español/Inglés) y sistema de diseño propio, escalable según la fase del proyecto.

Este documento complementa `investigation.md` (research), `mvp-features.md` (features del MVP) y `fases-entrega.md` (roadmap por fases). Aquí se define **cómo se construye técnicamente**, no qué se construye — ese "qué" no cambia; lo que se agrega es que el multilenguaje y el design system dejan de ser features de fase 2 y pasan a ser cimientos desde el día 1.

---

## 1. Por qué i18n y design system van en Fase 0

- **Multilenguaje:** el informe identifica destinos internacionales y un modelo de pauta que puede escalar fuera de Colombia. Añadir un segundo idioma después de lanzar obliga a re-arquitecturar rutas, SEO (hreflang) y el modelo de contenido del CMS — más costoso que planearlo desde el inicio. Con `next-intl` y rutas por locale, el costo marginal de agregar EN sobre una base ya preparada es bajo.
- **Sistema de diseño:** el informe es enfático en velocidad móvil (83% del tráfico, sub-1s ideal) y en *message match* entre anuncio y landing. Sin tokens y componentes consistentes desde el inicio, cada landing nueva de campaña se construye ad-hoc, se degrada la velocidad y la coherencia visual — justo lo que el informe marca como causa de abandono. No implica construir un design system "enterprise" en el MVP; implica que la Fase 0 defina las fundaciones correctas para que crecer no signifique reescribir.

---

## 2. Arquitectura técnica

### 2.1 Stack base

| Capa | Herramienta | Fase |
|---|---|---|
| Framework | Next.js 14+ (App Router) | 0 |
| Hosting | Vercel (Edge Network, Image Optimization) | 0 |
| i18n | `next-intl` | 0 |
| Estilos / tokens | Tailwind CSS + CSS variables | 0 |
| Componentes UI | Componentes propios sobre Tailwind (base shadcn/ui opcional) | 0 |
| CMS headless | Sanity, Contentful o Strapi (con soporte multilenguaje nativo) | 0 (setup) / 1 (contenido real) |
| Formularios/Leads | API routes → webhook a CRM | 0-1 |
| Pagos | Wompi o PayU | 2 |
| Tracking server-side | Meta CAPI, TikTok Events API (API routes) | 2 |
| Documentación del design system | Página `/design-system` interna | 0-1 → Storybook en Fase 2-3 |

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

- Middleware de Next.js detecta `Accept-Language` del navegador en la primera visita y redirige al locale correspondiente (fallback a `es`).
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

---

## 4. Sistema de diseño — escalado por fase

El principio es **un solo sistema que crece**, no un rediseño en cada fase. Fase 0 define las fundaciones; las fases siguientes agregan estructura y gobierno, no cambian los tokens base salvo que el research lo justifique.

### 4.1 Fase 0 — Fundaciones (obligatorio antes de construir cualquier página)

**Design tokens** (como CSS variables + config de Tailwind):
- Color: marca primaria, secundaria, acento (CTA/WhatsApp usa un color de alto contraste dedicado, ver informe sobre CTA de alta visibilidad), escala de neutros, estados (éxito/error/advertencia).
- Tipografía: familia (legible, nivel de lectura simple según el informe), escala tipográfica (mobile-first: definir tamaños para móvil primero, luego escalar a desktop), pesos.
- Espaciado: escala consistente (4/8px base).
- Radios y sombras: set reducido (2-3 valores), no ad-hoc por componente.
- Breakpoints: mobile-first, con el breakpoint principal pensado para el 83% de tráfico móvil.

**Componentes base** (los mínimos para construir el MVP sin improvisar):
- Botón (primario, secundario, WhatsApp — variante con ícono).
- Input / Textarea / Checkbox (para el formulario corto y el checkbox de autorización de datos).
- Card (destino, paquete).
- Badge (trust badge: RNT, ANATO/IATA).
- Navbar + selector de idioma + WhatsApp flotante.
- Footer.
- Sección Hero (para home y landings).

**Documentación:** una página interna `/design-system` (no pública, protegida o simplemente no enlazada) que renderiza cada token y componente con sus variantes — sirve de referencia viva sin invertir en Storybook todavía.

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
  [locale]/
    layout.tsx                  → layout con NavBar, Footer, WhatsApp flotante, provider de i18n
    page.tsx                    → Home
    destinos/
      page.tsx
      [slug]/page.tsx
    paquetes/
      [slug]/page.tsx
    lp/
      [campana]/page.tsx
    nosotros/page.tsx
    contacto/page.tsx
    legal/page.tsx
    design-system/page.tsx      → guía viva de componentes (no indexada)
  api/
    lead/route.ts
    meta-capi/route.ts          → Fase 2
    tiktok-events/route.ts      → Fase 2
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
  i18n/                         → config next-intl, middleware
  cms/                          → clientes/queries al CMS headless
  tracking/                     → helpers de eventos (GA4, pixels)
styles/
  tokens.css                    → CSS variables del design system
tailwind.config.ts              → mapea tokens a clases utilitarias
```

---

## 6. Requisitos no funcionales

- **Performance:** Core Web Vitals en verde para ambos locales; imágenes vía `next/image`; JS de terceros (pixels) cargado con `next/script` en modo diferido o server-side.
- **Accesibilidad:** mínimo AA en componentes base desde Fase 0 (contraste, labels de formularios, navegación por teclado) — más barato de construir bien desde el inicio que de retrofit en Fase 3.
- **SEO:** metadata dinámica y `hreflang` correctos desde el primer deploy; sitemap por locale.
- **Seguridad:** validación server-side de formularios, checkbox de consentimiento no pre-marcado (Ley 1581), variables sensibles (tokens de CAPI, CMS, pasarela) en Vercel Environment Variables, nunca en el repo.

---

## 7. Checklist de arranque (Fase 0, antes de construir páginas de contenido)

1. Repo Next.js + Vercel conectado, deploy de "hola mundo" funcionando en ambos locales (`/` y `/en`).
2. `next-intl` configurado con middleware de detección de idioma y selector persistente.
3. CMS headless elegido y modelo de contenido definido con soporte multilenguaje para destinos/paquetes.
4. Tokens de diseño (`tailwind.config.ts` + `styles/tokens.css`) definidos y aprobados (color, tipografía, espaciado, breakpoints).
5. Componentes base construidos y documentados en `/design-system`.
6. Layout base (NavBar, Footer, WhatsApp flotante, selector de idioma) funcionando en ambos idiomas.
7. Página legal (`/legal`) y checkbox de consentimiento listos antes de publicar cualquier formulario.

A partir de este checklist, el desarrollo de Fase 1 (home, landings, fichas de paquete) descrito en `mvp-features.md` avanza sobre una base ya bilingüe y con sistema de diseño, sin retrabajo posterior.
