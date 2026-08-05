# BroWay Adventures — Plan de ejecución de la Fase 1

Plan de trabajo para llevar el repositorio desde las fundaciones ya construidas hasta el MVP
publicable descrito en [`fases-entrega.md`](fases-entrega.md) §Fase 1.

Este documento **no redefine el alcance**: el qué y el cuándo siguen viviendo en
[`fases-entrega.md`](fases-entrega.md) y [`mvp-features.md`](mvp-features.md), el cómo en
[`spec-tecnica.md`](../architecture/spec-tecnica.md), y la dirección visual y de copy en
[`brief-v0.md`](../design/brief-v0.md). Lo que aporta es el **orden de ejecución**, las
dependencias reales entre piezas, y el inventario de lo que hoy está bloqueado y por quién.

Fecha de redacción: **4 de agosto de 2026**. Si al leerlo el estado del repo ya no coincide con
§1, actualiza §1 antes de usar §4 como guía.

---

## 1. Estado real del repositorio

`CLAUDE.md` afirma que la Fase 0 "sigue sin estar hecha". En el código, la mayor parte sí lo
está. Lo que falta de Fase 0 no es código: son decisiones que dependen de terceros.

| Checklist [`spec-tecnica.md`](../architecture/spec-tecnica.md) §7 | Estado | Evidencia |
|---|---|---|
| 0. Titularidad de cuentas (dominio, Vercel, repo, GA4, pixel) | ❌ Abierto | El repo vive en una cuenta personal |
| 1. Entorno fijado (Node 24.14.1, pnpm 10.34.3) | ✅ Hecho | `.nvmrc`, `packageManager`, `engines.node` |
| 2. Next.js 16 + React 19 funcionando en ambos locales | ✅ Hecho | `app/[locale]/`, `proxy.ts` |
| 3. `next-intl` con detección de idioma y selector | ✅ Hecho | `lib/i18n/`, `messages/es\|en.json`, `LanguageSwitcher` |
| 4. Frontera CMS / base de ofertas decidida | ❌ Abierto | Ver §3.2 |
| 5. Contrato de `/api/lead` acordado por escrito con quien monte GHL | ⚠️ Riesgo | `app/api/lead/route.ts` ya fija un shape **sin acuerdo** |
| 6. Tokens aprobados en el `@theme` | ✅ Hecho | `app/globals.css`, con matriz de contraste medida |
| 7. Componentes base documentados en `/design-system` | ✅ Hecho | 9 componentes, guía viva de 426 líneas |
| 8. Layout base bilingüe | ✅ Hecho | `Navbar`, `Footer`, `WhatsAppFloating`, `LanguageSwitcher` |
| 9. `/legal` y consentimiento listos antes de publicar formularios | ✅ Hecho | `app/[locale]/legal/page.tsx`, `POLICY_VERSION`, `buildConsentRecord` |

Además existe infraestructura de Fase 1 ya adelantada, que conviene conocer antes de duplicarla:

- `lib/types/offer.ts` — el modelo de oferta con trazabilidad completa (`offerId`, `ciudadOrigen`,
  `ocupacionBase`, `vigenciaHasta`, `validadaEl`, `estado`) y los predicados `isExpired` /
  `isPublishable`.
- `lib/offers/index.ts` — **única puerta de acceso** a las ofertas. `getOffer()` ya devuelve
  `expired` en lugar de `not-found` cuando la tarifa venció, que es justo lo que exige
  `spec-tecnica.md` §8.4. Falta renderizar ese estado, no calcularlo.
- `app/api/lead/route.ts` — valida el consentimiento en servidor **antes** que cualquier otro
  campo y responde 422 sin él.
- `components/ui/price-disclosure.tsx` y `components/ui/hero.tsx` — con los ratios de contraste
  ya medidos contra el peor caso.

### 1.1 Lo que NO existe todavía

Ninguna página de contenido. `app/[locale]/page.tsx` es un placeholder autodeclarado de 41
líneas. No existen `/paquetes`, `/destinos`, `/nosotros`, `/contacto`, `/como-pagar`, `/gracias`,
`/faq` ni `/lp/[campana]`. No existe el formulario compuesto, no hay ningún ícono en el
repositorio, y `lib/tracking/events.ts` son stubs que hacen `console.log`.

---

## 2. Cuatro instrucciones del brief que ya no aplican

[`brief-v0.md`](../design/brief-v0.md) se escribió para generar el sitio con v0, **antes** de que
existiera el repo. Cuatro de sus instrucciones hoy producen trabajo que habría que deshacer.
Quien ejecute la Fase 1 debe saltárselas conscientemente.

1. **"NO implementes `next-intl` todavía; extrae todo el texto a un objeto `const copy`"** (§2).
   `next-intl` ya está implementado y `messages/es.json` / `messages/en.json` ya tienen la forma
   establecida: `nav`, `cta`, `microcopy`, `precio`, `oferta`, `formulario`, `consentimiento`,
   `error`. **El copy de Fase 1 va directo a `messages/*.json`.** Crear objetos `copy` en los
   componentes genera una migración mecánica innecesaria.

2. **Los Prompts 0 y 1 (§3 y §4) están ejecutados**, y a mano, no con v0. El design system y el
   layout global existen y están medidos.

3. **Los Prompts 2-6 ya no deben pasar por v0.** v0 no conoce estos tokens ni estos componentes:
   redefine colores y botones aunque el prompt le diga que los reutilice. Su contenido sigue
   siendo válido como **especificación de página** (qué secciones, en qué orden, con qué copy);
   deja de serlo como prompt. §2, §2.bis y §11 siguen vigentes íntegros: son las reglas y el
   Pre-Flight, no instrucciones para una herramienta.

4. **`@phosphor-icons/react` está mandado por §2.bis pero no instalado.** El propio brief lo llama
   "la decisión más cara de revertir", y por eso se tomó antes de instalar shadcn/ui. Hay que
   instalarlo **antes** de la primera página que use un ícono, no después.

> Estas cuatro correcciones todavía no están escritas en `brief-v0.md`. Mientras no lo estén,
> este documento es la referencia sobre cómo leerlo.

---

## 3. Conflictos entre documentos, sin resolver

Dos contradicciones reales entre documentos de la misma familia. Ninguna se puede resolver desde
el código: hay que decidirlas y escribirlas.

### 3.1 Alcance de la ficha de paquete en Fase 1

- [`fases-entrega.md`](fases-entrega.md) §Fase 1 pide una **"ficha de paquete básica"**: galería,
  "desde $", **itinerario resumido**, qué incluye/no incluye, CTA. Y coloca explícitamente en
  Fase 2 el "itinerario día a día con mapa, fechas de salida y cupos disponibles".
- [`brief-v0.md`](../design/brief-v0.md) §6 especifica para la misma página un **itinerario día a
  día en acordeón** y una **tabla de fechas de salida con cupos**.

Por la regla de precedencia de [`docs/README.md`](../README.md), `fases-entrega.md` gana sobre
`brief-v0.md` en materia de qué y cuándo. **Recomendación:** construir la ficha con itinerario
resumido y dejar el modelo de datos preparado para el día a día, difiriendo el acordeón completo,
el mapa y los cupos a Fase 2. El plan de §4 asume esto. Si se decide lo contrario, el Paso 3
crece y hay que actualizar `fases-entrega.md`, no ignorarlo.

### 3.2 CMS: cuándo, y dónde vive el contenido de destinos

- `spec-tecnica.md` §7.4 pide la frontera CMS / base de ofertas decidida **en Fase 0**.
- `fases-entrega.md` §Fase 2 coloca "migrar la edición de destinos y blog a un CMS" **en Fase 2**.

No es tan contradictorio como parece: lo que es de Fase 0 es **decidir quién es dueño de la
tarifa** (base de ofertas, no CMS); lo que es de Fase 2 es **mover la edición editorial** a una
herramienta. En Fase 1, el contenido de destinos vive en el repositorio.

**Consecuencia para el plan:** `/destinos` no está bloqueado por el CMS, siempre que el acceso al
contenido se encapsule igual que `lib/offers/index.ts` — una sola puerta, para que la migración
de Fase 2 no toque ninguna página.

---

## 4. Plan de ejecución

Nueve pasos. El orden no es por importancia percibida sino por dependencias: cada paso solo
depende de los anteriores.

Una nota sobre el orden: la ficha de paquete va **antes** que la home. La home se siente más
urgente, pero la ficha es la que convierte, y es la que arrastra el modelo de datos, el
formulario y el estado de tarifa vencida. Hacerla primero deja la home como composición de piezas
ya resueltas en lugar de como una tanda de decisiones nuevas.

### Paso 0 — Desbloqueo del entorno

Pequeño y primero, porque todo lo demás lo asume.

- Instalar `@phosphor-icons/react`. Uso fijo `weight="regular"` en todo el sitio (§2.bis).
- **NO correr `shadcn init`.** Se intentó el 4 de agosto de 2026 y hay que dejar constancia,
  porque el stack declarado en `spec-tecnica.md` §4 dice "shadcn/ui" y cualquiera lo va a
  reintentar. Esto fue lo que hizo el CLI (v4.16.1, preset Nova, base Radix) sobre este repo:

  | Efecto | Consecuencia |
  |---|---|
  | Sobrescribió `lib/utils.ts` entero (47 → 6 líneas) | Borró `FONT_SIZE_TOKENS` y `extendTailwindMerge`. Es **exactamente** el fallo mudo que mandó el botón navy a producción con 1.19:1 |
  | Sobrescribió `components/ui/button.tsx` | Se llevó las 5 reglas de contraste verificadas y las variantes de marca (`primary` naranja/navy, `whatsapp`) |
  | Añadió 127 líneas a `app/globals.css` | Un segundo sistema de tokens (`--background`, `--foreground`) en paralelo al `@theme` medido |
  | Instaló `lucide-react` | La familia de íconos que §2.bis prohíbe explícitamente |
  | Instaló `tw-animate-css` | Una librería de animación, contra `MOTION_INTENSITY 3` y el objetivo de LCP < 1s |

  Todo se revirtió. El problema no es de configuración: los presets del CLI empaquetan familia de
  íconos y tipografía (Nova = Lucide + Geist), o sea que **imponen justo las dos decisiones que
  este proyecto ya tomó y que `brief-v0.md` §12 marca como las más caras de revertir.**

- **Cómo obtener lo que shadcn aportaría, sin el CLI.** shadcn no es una dependencia de runtime:
  es un generador que copia código. Lo valioso de verdad son las primitivas de Radix con
  accesibilidad resuelta. Cuando haga falta una, se instala `radix-ui` directo y se escribe el
  wrapper a mano contra los tokens del proyecto. En Fase 1 probablemente no haga falta ninguna:
  el menú móvil (foco y Escape) ya está resuelto en `navbar.tsx`, el `Select` en `field.tsx`, y
  el `Accordion` sobre `<details>`/`<summary>` nativo es más liviano que Radix y encaja mejor con
  el dial de motion 3.

- **Corregir `spec-tecnica.md` §4 y `brief-v0.md`**, que hoy declaran shadcn/ui como base. Mientras
  lo digan, alguien va a volver a correr `init` y a repetir el destrozo de arriba.

- **Guardia de tokens** (`scripts/check-font-size-tokens.mjs`, `pnpm check:tokens`, encadenada al
  `build`): falla si un `--text-*` del `@theme` no está en `FONT_SIZE_TOKENS`, si sobra un nombre,
  o si `lib/utils.ts` perdió del todo su `extendTailwindMerge`. Este último caso no era hipotético
  cuando se escribió: es literalmente lo que acababa de pasar.
- Añadir una verificación que falle si un token `--text-*` de `app/globals.css` no está en
  `FONT_SIZE_TOKENS` de `lib/utils.ts`. Hoy la regla es manual y su síntoma es mudo: ya mandó a
  producción un botón navy con texto a 1.19:1.
- Commitear el árbol pendiente (`components/ui/hero.tsx` está sin trackear).

**Hecho cuando:** `pnpm build` pasa limpio y la verificación de tokens corre en CI o en un script
de `package.json`.

### Paso 1 — Extender el modelo de oferta

Datos puros, cero decisiones de diseño. Desbloquea el Paso 3.

- Añadir a `Offer`: `itinerario: { dia, titulo, descripcion }[]`, `politicaCancelacion: string`,
  `faq: { pregunta, respuesta }[]`.
- `fechasSalida: { fecha, cuposDisponibles }[]` se añade al **tipo** pero no se renderiza en Fase
  1 (ver §3.1). Documentarlo así en el propio tipo, para que no se interprete como olvido.
- Ampliar `lib/mock/offers.ts` con los campos nuevos. Mantener la oferta en estado `borrador`
  (`san-andres-borrador`): es el caso de prueba de que un borrador nunca se renderiza.

**Hecho cuando:** existe al menos una oferta mock completa por cada estado (`vigente`, `vencida`,
`borrador`). Hoy falta una `vencida`, y sin ella el Paso 3 no se puede verificar.

### Paso 2 — `LeadForm` y `/gracias`

Un componente y una página que necesitan tres páginas distintas después. Construirlo una vez.

- `components/forms/lead-form.tsx`: exactamente los cuatro campos de `brief-v0-producto.md` §9.9
  (nombre, WhatsApp, **ciudad de salida**, fecha aproximada + nº de viajeros). `offerId` y
  `destino` van ocultos desde el contexto de página. **No** pide presupuesto, ingresos ni estrato.
- Checkbox de consentimiento no pre-marcado que deshabilita el envío. El texto ya está en
  `messages/*.json` bajo `consentimiento`, y ya nombra la publicidad personalizada. Sigue
  pendiente de validación por abogado colombiano.
- Los cuatro estados visibles: reposo, enviando, éxito y error inline. El estado de carga es un
  skeleton con la forma del contenido final, no un spinner (§2.bis).
- `app/[locale]/gracias/page.tsx` con `robots: { index: false }`, expectativa de respuesta
  concreta (pendiente §5, punto 5), 2-3 pasos de qué pasa ahora, y CTA de WhatsApp que **conserva
  el contexto** de la página de origen. Sin un segundo formulario.

**Hecho cuando:** un envío sin marcar el checkbox es rechazado por el cliente **y** por el
servidor (422 `consent_required`), y un envío válido redirige a `/gracias`.

### Paso 3 — `/paquetes/[slug]` y `/paquetes`

La página de mayor impacto en conversión. Anatomía en `brief-v0.md` §6, podada según §3.1.

- Above the fold en 375×667: breadcrumb, H1 de menos de 12 palabras, galería con scroll-snap
  (CSS puro), bloque de precio y CTA.
- `PriceDisclosure` pegado al precio, con peso tipográfico legible. **Ningún "desde $" suelto en
  ninguna página del sitio.**
- **Estado de tarifa vencida**: `getOffer()` ya lo devuelve; falta la vista. No es 404 y no es un
  precio tachado, es un mensaje con la fecha real y CTA de recotización que incluye el `offerId`.
- Barra sticky de conversión solo en móvil, que **oculta el flotante** mientras está visible.
- Qué incluye / qué no incluye: check turquesa contra equis en gris, nunca rojo.
- Formas de pago: "Sepáralo con el 30% y paga el saldo en cuotas". Nunca "financiamos" ni
  "crédito".
- `LeadForm` del Paso 2 con el `offerId` de la página.
- JSON-LD `TouristTrip`, `Product`+`Offer`, `BreadcrumbList` y `FAQPage`.
- `/paquetes` (listado): **no está especificado en ningún brief**, pero el navbar ya declara el
  enlace y `PackageCard` ya apunta a `/paquetes/[slug]`. Hueco del brief, no del código.

**Hecho cuando:** las tres ofertas mock renderizan correctamente — la vigente vende, la vencida
muestra su estado, el borrador responde 404.

### Paso 4 — Home

Reemplaza el placeholder. Ocho secciones en el orden de `brief-v0-producto.md` §9.1.

Es la página donde más muerde el Pre-Flight §11.B, y sus tres casillas más caras son contables,
no opinables: **≥4 familias de layout distintas** en la página, **≤3 eyebrows** contando el hero,
y **ninguna fila de 3 tarjetas idénticas** como recurso genérico. Verificarlas antes de dar la
página por terminada sale más barato que rehacer secciones después.

"Next Stop" aparece **una sola vez**, en la franja turquesa.

**Hecho cuando:** el hero cabe completo en el viewport inicial a 375px y a 1440px, con los sellos
de confianza en una sección **debajo** del hero, nunca dentro.

### Paso 5 — Páginas institucionales

`/nosotros`, `/contacto`, `/como-pagar`, `/faq`. Son las que cumplen el objetivo declarado del
MVP: dar seriedad a la empresa.

- `/nosotros` lleva el **bloque de legalidad destacado** (RNT, afiliaciones, dirección). Ese
  bloque es la razón de ser de la página, no un detalle del pie.
- `/contacto` reutiliza `LeadForm` y carga el mapa de forma diferida (`loading="lazy"`), nunca
  bloqueando el LCP.
- `/faq` con acordeón accesible y JSON-LD `FAQPage`.

### Paso 6 — `/destinos` y `/destinos/[slug]`

- Crear `lib/types/destination.ts` y `lib/destinations/index.ts` replicando el patrón de
  `lib/offers/`: **una sola puerta de acceso**, para que la migración a CMS de Fase 2 no toque
  ninguna página. Hoy `DestinationCard` recibe props sueltas; pasará a recibir un `Destination`.
- 3 a 6 destinos iniciales, con contenido editorial real: intro de 2-3 párrafos, "mejor época
  para viajar", "qué hacer", FAQ del destino, y los paquetes disponibles.
- Una página de destino sin contenido sustancial no cumple su función: se posiciona por búsquedas
  de alta intención ("viaje a Eje Cafetero 4 días") o no sirve.

### Paso 7 — `/lp/[campana]`

- Sin navbar de navegación (solo logo y WhatsApp), footer mínimo, una sola idea, un solo CTA
  repetido 3-4 veces.
- Todo el contenido desde configuración (`lib/mock/campaigns.ts` o su equivalente encapsulado),
  para lanzar una campaña sin tocar código.
- `lib/tracking/utm.ts`: leer UTMs y persistirlos en `sessionStorage`.
- `robots: { index: false }`: no compiten con las páginas SEO.

Construirla no depende del gate de pauta. **Encenderla sí**: la pauta no arranca hasta que el CRM
atienda (`fases-entrega.md`, gate explícito).

### Paso 8 — Tracking y consentimiento de cookies

Workstream propio de Fase 1 que hoy son stubs, y que se puede adelantar en paralelo desde el Paso
4.

- GA4 + Meta Pixel + TikTok Pixel client-side, con clic en WhatsApp y `generate_lead`.
- Banner de consentimiento de cookies con **Consent Mode v2**. Es un requisito de Fase 1 en
  `fases-entrega.md`, distinto e independiente del consentimiento de datos de la Ley 1581 que ya
  vive en el formulario.
- Conectar `/api/lead` al webhook real de GoHighLevel. Depende del bloqueo §5.3.
- Lo que **no** entra: Meta CAPI y TikTok Events API son Fase 2. El `event_id` ya se genera en
  `lib/tracking/events.ts` para que la deduplicación funcione cuando lleguen.

### Paso 9 — Pre-Flight y publicación

- Pasada completa del Pre-Flight `brief-v0.md` §11, bloques B, C y D. **El bloque C se verifica en
  el navegador, no leyendo el JSX**: `cn()` puede borrar una clase de color sin avisar. Verificar
  `focus-visible` también sobre las secciones navy y turquesa, no solo sobre blanco.
- Actualizar `app/sitemap.ts`: hoy declara `["", "/legal"]`. Ampliar por cada página construida,
  sin incluir `/gracias`, `/design-system` ni `/lp/[campana]`.
- Retirar `picsum.photos` de `next.config.ts` cuando lleguen las fotos reales. En producción no
  debe quedar ningún host externo de imágenes.

---

## 5. Bloqueos externos

Ninguno se resuelve escribiendo código. Los tres primeros tienen consecuencia legal o comercial.

| # | Bloqueo | Bloquea | Por qué es urgente |
|---|---|---|---|
| 1 | Contrato de `/api/lead` firmado con quien monte GoHighLevel | Paso 8 (y valida el Paso 2) | En GHL un campo creado para un tipo de objeto **no se puede convertir** al otro. `route.ts` ya fija un shape sin acuerdo |
| 2 | Datos legales reales: RNT, NIT, dirección, teléfono, afiliaciones | Publicación | Hoy son `XXXXXX`. El RNT es obligatorio en la publicidad, no solo en el footer |
| 3 | Número de WhatsApp comercial | Publicación | `WHATSAPP_NUMBER = "57XXXXXXXXXX"`: hoy **todos** los CTA del sitio son enlaces muertos |
| 4 | Validación del texto de consentimiento por abogado colombiano | Publicación de cualquier formulario | El texto actual ya nombra la publicidad personalizada, pero no está validado |
| 5 | Tiempo real de respuesta de la operación | Paso 2 (`/gracias`) | No se promete un número que la agencia no pueda cumplir. Nunca "24/7" |
| 6 | Marca: tipografías, hex oficiales, lineamientos de foto, logo en SVG | Cierre del design system | Los hex se extrajeron del PNG del logo. Solo hay un PNG; el favicon debe ser el símbolo solo |
| 7 | Titularidad de cuentas (dominio, Vercel, repo, GA4, pixel) | Paso 8 y publicación | Requisito contractual del roadmap comercial. Migrarlo después es caro |
| 8 | Resolver §3.1 (alcance de la ficha) | Paso 3 | Determina si el Paso 3 es una página o una página y media |

El sitio **puede publicarse** sin que el sistema comercial esté completo: da credibilidad
institucional desde el día 1 y recibe tráfico orgánico y directo. Lo que espera al CRM es el gasto
en anuncios, no el lanzamiento.

---

## 6. Criterio de Fase 1 terminada

La Fase 1 está entregada cuando, además de que existan las páginas:

- [ ] Ningún "desde $" aparece sin su bloque `PriceDisclosure`.
- [ ] El estado de tarifa vencida existe, se ve, y no es un 404 ni un precio tachado.
- [ ] Ningún formulario tiene el checkbox de consentimiento pre-marcado, y el servidor rechaza el
      envío sin él.
- [ ] Cada envío exitoso llega a GoHighLevel con `offerId`, UTMs, `event_id` y el registro de
      consentimiento completo.
- [ ] Ningún dato legal inventado en ninguna página.
- [ ] El Pre-Flight §11 bloques A, B, C y D pasa entero, con el bloque C verificado en navegador.
- [ ] LCP < 1s en móvil en home y ficha de paquete.
- [ ] Ambos locales (`/` y `/en`) renderizan todas las páginas sin cadenas sin traducir.

## 7. Fuera de la Fase 1

Sin cambios respecto a `fases-entrega.md`: pagos online, Meta CAPI y TikTok Events API, quiz,
blog, cupos en tiempo real, itinerario día a día con mapa (§3.1), CMS headless, Storybook y
pruebas de regresión visual.
