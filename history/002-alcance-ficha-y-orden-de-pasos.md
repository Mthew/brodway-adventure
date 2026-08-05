# 002 · Alcance de la ficha de paquete, y por qué la home se movió al final

**Archivado el 2026-08-05.** Dos decisiones que estaban abiertas en `CURRENT.md` y ya no lo
están: se tomaron, se implementaron y su resultado está en el código.

## Alcance de la ficha de paquete

Había un conflicto real entre dos documentos de la misma familia:

- `fases-entrega.md` §Fase 1 pedía una ficha **básica**: galería, "desde $", **itinerario
  resumido**, qué incluye/no incluye y CTA. Y colocaba explícitamente en Fase 2 el "itinerario
  día a día con mapa, fechas de salida y cupos disponibles".
- `brief-v0.md` §6 especificaba para la misma página un **acordeón día a día completo** y una
  **tabla de fechas de salida con cupos**.

**Resuelto a favor de `fases-entrega.md`**, por la regla de precedencia de `docs/README.md`: en
materia de qué y cuándo se construye, `product/` gana sobre `design/`.

Cómo quedó implementado en el Paso 3:

- El itinerario se renderiza resumido, como lista de días, no como acordeón desplegable.
- `fechasSalida` **está modelado en el tipo `Offer` pero no se renderiza**, y el propio campo lo
  dice para que no se lea como un olvido.
- Ampliarlo en Fase 2 es añadir una sección, no migrar datos.

## Por qué la home dejó de ser el Paso 4

El plan declaraba en §4 que el orden era "por dependencias: cada paso sólo depende de los
anteriores". La home lo contradecía:

| Lo que la home necesita | Dónde se construye |
|---|---|
| 6 `DestinationCard` → `/destinos/[slug]` | Paso 6 |
| Bloque anti-fraude → `/nosotros` | Paso 5 |
| Cierre → `/contacto` | Paso 5 |

Construirla en el Paso 4 habría publicado ocho enlaces muertos, o habría exigido enlaces
temporales que alguien tendría que acordarse de corregir después.

**Nuevo orden: 6 (destinos) → 5 (institucionales) → 4 (home).** No es una desviación del plan:
es aplicar el principio que el plan ya declaraba y que su propio orden incumplía.
