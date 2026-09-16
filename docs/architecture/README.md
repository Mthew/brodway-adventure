# ADR — Registro de decisiones arquitectónicas

Un ADR (*Architecture Decision Record*) documenta **una** decisión de arquitectura: qué se decidió,
por qué, y qué consecuencias se aceptan a cambio. No es un documento vivo que se edita para
reflejar el estado actual (eso es `CURRENT.md` o los docs de `docs/architecture/`) — un ADR, una
vez aceptado, no se reescribe; si la decisión cambia, se escribe un ADR nuevo que la reemplaza y se
marca la vieja como `Reemplazado por ADR-000n`.

## Numeración

Formato `ADR-000n`, correlativo, sin huecos ni reutilización. El siguiente número siempre es
`(el mayor existente) + 1` — antes de crear uno, revisar el índice de abajo, no solo listar el
directorio (un ADR rechazado conserva su número).

## Estados posibles

| Estado | Significa |
|---|---|
| `Propuesto` | En discusión, no vinculante todavía |
| `Aceptado` | Rige el código nuevo desde su fecha |
| `Reemplazado por ADR-000n` | Ya no rige; se conserva por historia |
| `Rechazado` | Se consideró y no se adoptó — se conserva para no reabrir el debate sin un dato nuevo |

## Índice

| ADR | Título | Estado |
|---|---|---|
| [ADR-0001](ADR-0001-src-y-organizacion-module-first.md) | `src/` como raíz de código y organización module-first | Aceptado |
| [ADR-0002](ADR-0002-capas-clean-architecture-pragmatica.md) | Capas pragmáticas por módulo (domain/application/infrastructure/presentation) | Aceptado |
| [ADR-0003](ADR-0003-frontera-rest-backend-independiente.md) | Frontera REST para un futuro backend independiente | Aceptado |
| [ADR-0004](ADR-0004-idioma-del-codigo-vs-rutas-seo.md) | Inglés en el código, español solo en segmentos de ruta con valor SEO | Aceptado |
| [ADR-0005](ADR-0005-estrategia-de-adopcion-incremental.md) | Adopción incremental (strangler), no reescritura | Aceptado |

## Plantilla para el próximo ADR

```markdown
# ADR-000n — Título en una frase, en modo decisión ("Adoptar X", no "Sobre X")

**Estado:** Propuesto | Aceptado | Reemplazado por ADR-000n | Rechazado
**Fecha:** AAAA-MM-DD

## Contexto

Qué problema o tensión obliga a decidir. Cita archivos/líneas reales si existen — un ADR sin
evidencia concreta es opinión, no decisión registrada.

## Decisión

Qué se decide, en imperativo y sin ambigüedad. Si hay alternativas descartadas, una línea de por
qué cada una se descartó.

## Consecuencias

Qué se gana y qué se acepta pagar a cambio. Un ADR sin costos admitidos no es honesto — toda
decisión de arquitectura cede algo.
```

## Cuándo se escribe uno nuevo

Cuando una decisión (a) afecta a más de un módulo o (b) es cara de revertir una vez que hay código
encima. Una preferencia de estilo dentro de un solo archivo no es un ADR — eso vive en el propio
código o en un comentario puntual.
