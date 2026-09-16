# ADR-0004 — Inglés en el código; español solo en segmentos de ruta con valor SEO

**Estado:** Aceptado
**Fecha:** 2026-09-15

## Contexto

Hoy la mezcla de idioma no sigue ninguna regla: `lib/offers/`, `lib/destinations/`, `lib/crm/` están
en inglés; `components/oferta/`, `components/destinos/`, `app/admin/acciones/`, `app/admin/entrar/`,
`app/admin/olvide/`, `app/admin/restablecer/` están en español — sin que la elección dependa de
nada (ver [`mapeo-arquitectura-actual.md`](mapeo-arquitectura-actual.md) §4). Hay un
segundo nivel, menos visible, que importa más: **incluso dentro de módulos con nombre en inglés,
los tipos usan propiedades en español** — `LeadContact.{nombre, telefono, ciudadOrigen}`,
`Offer.{destino, ciudadOrigen, vigenciaHasta}` (`lib/types/offer.ts`, `lib/crm/index.ts`).

Esto no es solo estética: `LeadPayload` (`lib/crm/index.ts`) se serializa con `JSON.stringify()`
directamente hacia el webhook de GoHighLevel. Hoy, el nombre de la propiedad TypeScript **es** el
nombre del campo en el contrato externo. Ese contrato con NextGen/GoHighLevel todavía no está
cerrado por escrito (`spec-tecnica.md` §7, checklist punto 5) — es precisamente el momento de
decidir esto con cuidado, antes de que cerrarlo por escrito congele una mezcla accidental.

## Decisión

1. **Todo identificador de código en inglés**: nombres de archivo, carpeta, tipo, función, variable
   y propiedad. Sin excepción por "es un campo de negocio en español" — `destino` pasa a
   `destination`, `telefono` a `phone`, `ciudadOrigen` a `originCity`, `vigenciaHasta` a
   `validUntil`, etc.
2. **Excepción única: segmentos de ruta pública con valor SEO.** `app/[locale]/(sitio)/destinos/`,
   `.../ofertas/`, `.../nosotros/`, `.../contacto/`, `.../faq/` **se quedan en español** — son texto
   de URL indexado por Google para el mercado colombiano, no identificadores de código
   (`investigation.md` ya documenta el peso de SEO en español para esta audiencia).
3. **Los segmentos de ruta que NO son públicos/indexables se traducen igual que el resto del
   código**, porque la excepción del punto 2 es por SEO, no por "es una ruta". `app/admin/entrar` →
   `app/admin/login`, `app/admin/olvide` → `app/admin/forgot-password`, `app/admin/restablecer` →
   `app/admin/reset-password`, `app/admin/acciones/` → `app/admin/actions/`. El panel no se indexa
   y no compite por palabras clave; no hay razón de negocio para que esté en español.
4. **La frontera de idioma con terceros se resuelve con un mapeo explícito en `infrastructure/`, no
   dejando que el nombre de la propiedad interna sea accidentalmente el wire format.** El tipo de
   dominio (`LeadContact`, en inglés) y el payload que efectivamente viaja al webhook pueden diferir;
   si el contrato acordado con GoHighLevel termina exigiendo claves en español (razonable: es
   terminología de negocio del cliente, no del código), la traducción se escribe una vez, a la
   salida, en `modules/leads/infrastructure/crm-webhook-client.ts` — nunca propagando el idioma del
   tercero hacia el dominio.

Alternativa descartada: dejar los campos de negocio en español "porque así habla el cliente".
Se descarta porque el pedido explícito es código en inglés, y porque mezclar los dos (nombres de
módulo en inglés, propiedades en español) es exactamente el estado actual que genera la confusión
— la solución no es más mezcla, es una frontera explícita.

## Consecuencias

- **Reforzado con lint, no solo con revisión** (corrección 2026-09-15 — la versión original de
  este ADR no tenía ningún guardrail mecánico, a diferencia de ADR-0002, que sí lo tuvo desde el
  día 1 por la misma razón: el código lo escriben también flujos automatizados). `eslint.config.mjs`
  tiene una regla `no-restricted-syntax`, con `files: ["src/**/*.{ts,tsx}"]`, con dos selectores:
  cualquier identificador con tilde o `ñ`, y una lista mantenida a mano de las palabras ya
  detectadas en `mapeo-arquitectura-actual.md` §4 (`destino`, `telefono`, `ciudadOrigen`,
  `vigenciaHasta`, etc. — se amplía cada vez que un PR reintroduce una). No es exhaustivo: una
  palabra española sin tilde y que todavía no está en la lista pasa el lint sin error, igual que
  pasaría una revisión humana desatenta — es una lista viva, no una detección semántica del
  idioma, y ese límite queda documentado a propósito en vez de prometer una cobertura que la
  herramienta no puede dar.
- **Se gana**: una sola convención, sin que cada archivo nuevo tenga que adivinar si "le toca"
  español o inglés.
- **Se gana**: cuando el contrato de `/api/lead` se cierre por escrito con NextGen, el mapeo
  dominio→wire ya tiene un lugar único donde vivir, en vez de descubrirse a mitad de la
  implementación que renombrar un tipo interno rompió silenciosamente el payload que ya recibía el
  CRM.
- **Se paga**: renombrar propiedades usadas en 103 archivos (vía imports de `@/lib`/`@/modules`) es
  un diff mecánico pero grande; se ejecuta módulo por módulo, no de un tirón (ADR-0005).
- **Riesgo aceptado**: hasta que el contrato con NextGen se firme, no se sabe con certeza qué
  idioma exigirá el wire format real — la decisión de este ADR es sobre el **código**, no sobre el
  contrato con el CRM, que sigue siendo una negociación externa (`spec-tecnica.md` §7).
