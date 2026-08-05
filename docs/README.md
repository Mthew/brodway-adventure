# Documentación — BroWay Adventures

Documentación de investigación y definición para el sitio web de **BroWay Adventures** (agencia de
viajes, Medellín, Colombia): captación de leads calificados vía pauta paga (Google/Meta/TikTok),
con WhatsApp como canal de conversión dominante.

> **Estado del proyecto.** Las fundaciones de la Fase 0 están construidas (i18n, tokens de diseño,
> componentes base, layout, `/legal`, `/api/lead`), pero todavía no hay ninguna página de contenido:
> la home es un placeholder. El estado detallado, con qué falta de la Fase 0 y por qué, está en
> [`product/plan-fase-1.md`](product/plan-fase-1.md) §1. Estos documentos siguen siendo la fuente de
> verdad sobre qué construir y por qué. El `CLAUDE.md` de la raíz resume las reglas no negociables
> para quien implemente.

## Estructura de `docs/`

| Carpeta | Contenido |
|---------|-----------|
| [`research/`](research/) | Dos documentos: la investigación de mercado (el **por qué** detrás de las decisiones) y el roadmap del sistema comercial del cliente (el **dónde encaja** este sitio). |
| [`product/`](product/) | Alcance de producto: features del MVP, fases de entrega (roadmap) y el plan de ejecución de la Fase 1. El **qué**, el **cuándo** y el **en qué orden**. |
| [`architecture/`](architecture/) | Especificación técnica: stack, i18n, sistema de diseño, estructura de carpetas. El **cómo** se construye. |
| [`brand/`](brand/) | Manual de marca oficial (PDF) y logo fuente. La **identidad** — nombre, ADN, voz/tono, sistema visual. |
| [`design/`](design/) | Dos briefs para generar el MVP con un agente tipo v0: uno de **producto** (qué es el sitio, sin nada técnico) y uno **técnico** (prompts con stack y versiones). El **arranque** de la capa visual. |

## Orden de lectura

0. **[`research/sistema-comercial.md`](research/sistema-comercial.md)** ★ — el roadmap del **cliente**: el sistema comercial completo (GoHighLevel como CRM y fuente de verdad, WhatsApp Business Platform multiagente, agente de IA propio, n8n, base de ofertas de mayoristas) del cual este sitio es **una** de seis fuentes de captación. Léelo primero: reencuadra todo lo demás. Define el CRM, el contrato de `offer_id`, quién dispara cada evento de conversión, el registro de consentimiento y la regla de no encender pauta antes de que el CRM funcione.
1. **[`research/investigation.md`](research/investigation.md)** ★ — investigación de mercado (contexto completo: benchmarks, anatomía de ficha de paquete, CTAs, tracking, SEO, stack recomendado originalmente).
2. **[`product/mvp-features.md`](product/mvp-features.md)** — traduce la investigación a un alcance de MVP concreto sobre Next.js/Vercel (stack real del proyecto, que reemplaza la recomendación de WordPress de `investigation.md`).
3. **[`architecture/spec-tecnica.md`](architecture/spec-tecnica.md)** — cómo se construye técnicamente: i18n y sistema de diseño desde Fase 0, estructura de carpetas, requisitos no funcionales, checklist de arranque.
4. **[`product/fases-entrega.md`](product/fases-entrega.md)** — fases de entrega (1: MVP/credibilidad, 2: escalamiento de conversión, 3: roadmap) con umbrales explícitos para pasar de una fase a otra.
4.bis **[`product/plan-fase-1.md`](product/plan-fase-1.md)** — el plan de ejecución de la Fase 1: en qué orden se construyen las páginas y por qué ese orden, qué está realmente hecho de la Fase 0 (más de lo que dice `CLAUDE.md`), qué cuatro instrucciones de `design/brief-v0.md` quedaron obsoletas al existir el repo, los dos conflictos entre documentos que siguen sin resolver, y el inventario de bloqueos externos con su impacto. Léelo antes de escribir la primera página de contenido; no redefine alcance, lo secuencia.

5. **[`brand/manual-de-marca.pdf`](brand/manual-de-marca.pdf)** — nombre oficial, ADN de marca, voz y tono, plataforma verbal "Next Stop", sistema de logotipos. Fuente de verdad para naming y look & feel; **no** define hex de color, tipografías ni fotografía (esas secciones no están en la v2.0 del manual) — al construir el design system (`spec-tecnica.md` §4), esos valores quedan por definir con quien mantiene la marca. Logo fuente: [`brand/logo-broway-adventures.png`](brand/logo-broway-adventures.png).
6. **[`design/brief-v0-producto.md`](design/brief-v0-producto.md)** — el mismo MVP explicado **sin una sola decisión técnica**: qué es el negocio, a quién le habla, qué tiene que lograr cada página, cómo suena la marca y qué está prohibido. Pensado para dárselo directamente a un agente generador de interfaces cuando lo que se busca es la primera versión visual, no el código definitivo. Empieza por aquí si vas a explorar dirección de producto o si quien genera no debe tomar decisiones de arquitectura.
7. **[`design/brief-v0.md`](design/brief-v0.md)** — la versión técnica del mismo brief: prompts listos para generar el frontend del MVP en v0 (Next.js App Router). Traduce el spec, el alcance de Fase 1 y el manual de marca a instrucciones ejecutables: tokens con hex extraídos del logo y sus ratios de contraste verificados, componentes base, y un prompt por página. Sus dos secciones transversales son **§2.bis** (la dirección de diseño: los tres diales, los overrides frente al skill `design-taste-frontend` de `.claude/skills/`, y el bloque anti-plantilla que se pega en cada prompt) y **§11** (el Pre-Flight de aceptación: versiones, anti-slop, contraste y contrato de negocio). Léelo cuando arranque la construcción visual, después de los cuatro documentos anteriores.

## Regla de precedencia (qué gana ante un conflicto)

La precedencia depende de **sobre qué** es el conflicto:

**Arquitectura comercial** (qué CRM, quién dispara qué evento, ciclo de vida de una tarifa, qué se registra del consentimiento, cuándo se enciende la pauta):

1. **`research/sistema-comercial.md`** — es el roadmap del cliente; manda.
2. Todo lo demás se ajusta a él. Los docs que nombraban Kommo/Leadsales/HubSpot como CRM están **superados**: el CRM es GoHighLevel.

**Construcción del sitio** (stack, rutas, i18n, design system, componentes, copy):

1. **`CLAUDE.md`** (raíz) — reglas no negociables para quien implemente.
2. **`architecture/spec-tecnica.md`** — cómo se construye (stack, rutas, i18n, design system, contrato con el CRM).
3. **`product/mvp-features.md`** y **`product/fases-entrega.md`** — qué y cuándo se construye.
4. **`design/brief-v0.md`** — cómo se ve y cómo se redacta. `design/brief-v0-producto.md` describe el mismo sitio sin decisiones técnicas: si los dos difieren en marca o contenido, hay que corregir el que esté desactualizado; si difieren en algo técnico, el de producto simplemente no opina.
5. **`research/investigation.md`** — el porqué; su recomendación de stack (WordPress) está **superada** por el stack real definido en `mvp-features.md`/`spec-tecnica.md` (Next.js 16 + React 19 + Tailwind v4 + shadcn/ui sobre Vercel, con Node 24.14.1 y pnpm 10.34.3).

`sistema-comercial.md` **no** decide cómo se construye el sitio: asume "sitio actual conectado con HighLevel" y no contempla que aquí se construye uno nuevo desde cero (ver `mvp-features.md` §Riesgos).
