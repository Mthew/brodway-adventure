# ADR-0003 — Frontera REST para un futuro backend independiente

**Estado:** Aceptado
**Fecha:** 2026-09-15

## Contexto

El driver real de este ADR es el mismo de ADR-0002: hoy `app/api/lead/route.ts` mezcla parseo HTTP
con regla de negocio, sin versionado ni convención en lo que ya es HTTP (`/api/lead`,
`/api/demo-crm/respuestas`). Separar `application/` de `presentation/` ya se paga solo por eso —
es una necesidad presente, no proyectada. Aparte existe un objetivo de negocio a más largo plazo,
sin fecha ni dueño todavía, de poder separar el backend del frontend algún día; este ADR aprovecha
que la separación de capas de ADR-0002 deja esa opción abierta **gratis** (mismas carpetas, cero
código extra), pero ese objetivo futuro no es lo que justifica el costo de la decisión — si no
existiera, la frontera se adoptaría igual solo por SoC. Construir ya un backend separado, o una
capa HTTP interna simulada, sí sería sobre-ingeniería: el proyecto es un único sitio Next.js en
Vercel y la latencia de red entre "frontend" y "backend" hoy sería puro costo sin beneficio.

## Decisión

1. La capa `application/` de cada módulo (ADR-0002) son funciones puras de casos de uso, sin firma
   de HTTP. Mientras el proyecto sea un solo despliegue, `presentation/` las llama **en proceso**
   (una llamada a función), no por red.
2. Todo *route handler* nuevo bajo `src/app/api/` es un adaptador delgado: parsea la request, llama
   a una función de `application/`, traduce el resultado a la respuesta HTTP. No contiene reglas de
   negocio (misma regla que ADR-0002 para Server Actions).
3. Todo endpoint HTTP **nuevo** nace versionado (`/api/v1/...`). No se retroversiona `/api/lead`
   retroactivamente — el costo de mover un endpoint que ya funciona no se justifica solo por
   consistencia.
4. Si el roadmap eventualmente exige un backend separado, la migración es: envolver la función de
   `application/` existente en un handler REST (ejemplo en
   [`arquitectura-modular.md`](arquitectura-modular.md) §5) y cambiar, en el
   frontend, la llamada directa por un `fetch` — un cambio contenido en `presentation/`, cero
   cambios en `domain/`/`application/`.

Alternativa descartada: introducir ya una capa de "cliente HTTP interno" que llame a los propios
*route handlers* del mismo proyecto, para "practicar" el desacople. Se descarta: añade latencia y
complejidad reales hoy a cambio de una preparación que la regla de dependencia de ADR-0002 ya
ofrece sin ese costo.

## Consecuencias

- **Se gana, como efecto secundario y no como objetivo pagado aparte**: la opción de extraer un
  backend independiente más adelante sin reescribir la lógica de negocio — solo se reconecta la
  tubería en `presentation/`. Este ADR no le cobra nada a esa opción: el costo ya estaba pagado por
  ADR-0002.
- **Se gana**: los endpoints HTTP que ya existen y los que se agreguen en Fase 2
  (`/api/meta-capi`, `/api/tiktok-events` — `spec-tecnica.md` §5) siguen la misma convención desde
  el primer día, sin que cada uno invente su propio formato de error o de versión.
- **Se paga**: ningún beneficio de rendimiento ni de despliegue independiente hoy — es
  exclusivamente preparación. Si el backend nunca llega a separarse, el costo pagado es solo la
  disciplina de ADR-0002 (que de todas formas se adopta por sus propios méritos de organización).
- **No se hace todavía** (para no sobre-ingenierizar): sin OpenAPI, sin HATEOAS, sin cliente HTTP
  generado, sin autenticación de servicio a servicio. Se añaden el día que exista un segundo
  consumidor real del backend (una app móvil, un backend separado de verdad) — antes de eso, no
  hay problema que resuelvan.
