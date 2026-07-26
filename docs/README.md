# Documentación — Brodway Adventure

Documentación de investigación y definición para el sitio web de **Brodway Adventure** (agencia de
viajes, Medellín, Colombia): captación de leads calificados vía pauta paga (Google/Meta/TikTok),
con WhatsApp como canal de conversión dominante.

> **Estado del proyecto.** Repositorio en fase de definición: aún no hay código de aplicación. Estos
> documentos son la única fuente de verdad sobre qué construir y por qué. El `CLAUDE.md` de la raíz
> resume las reglas no negociables para quien empiece a implementar.

## Estructura de `docs/`

| Carpeta | Contenido |
|---------|-----------|
| [`research/`](research/) | Investigación de mercado: benchmark de competidores, canales, CTAs, cumplimiento legal colombiano. El **por qué** detrás de las decisiones. |
| [`product/`](product/) | Alcance de producto: features del MVP y fases de entrega (roadmap). El **qué** y el **cuándo**. |
| [`architecture/`](architecture/) | Especificación técnica: stack, i18n, sistema de diseño, estructura de carpetas. El **cómo** se construye. |

## Orden de lectura

1. **[`research/investigation.md`](research/investigation.md)** ★ — investigación de mercado (contexto completo: benchmarks, anatomía de ficha de paquete, CTAs, tracking, SEO, stack recomendado originalmente).
2. **[`product/mvp-features.md`](product/mvp-features.md)** — traduce la investigación a un alcance de MVP concreto sobre Next.js/Vercel (stack real del proyecto, que reemplaza la recomendación de WordPress de `investigation.md`).
3. **[`architecture/spec-tecnica.md`](architecture/spec-tecnica.md)** — cómo se construye técnicamente: i18n y sistema de diseño desde Fase 0, estructura de carpetas, requisitos no funcionales, checklist de arranque.
4. **[`product/fases-entrega.md`](product/fases-entrega.md)** — fases de entrega (1: MVP/credibilidad, 2: escalamiento de conversión, 3: roadmap) con umbrales explícitos para pasar de una fase a otra.

## Regla de precedencia (qué gana ante un conflicto)

1. **`CLAUDE.md`** (raíz) — reglas no negociables para quien implemente.
2. **`architecture/spec-tecnica.md`** — cómo se construye (stack, rutas, i18n, design system).
3. **`product/mvp-features.md`** y **`product/fases-entrega.md`** — qué y cuándo se construye.
4. **`research/investigation.md`** — el porqué; su recomendación de stack (WordPress) está **superada** por el stack real definido en `mvp-features.md`/`spec-tecnica.md` (Next.js + Vercel).
