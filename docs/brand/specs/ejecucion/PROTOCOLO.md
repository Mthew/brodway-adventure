# Protocolo de ejecución del grafo de marca

Sigue `~/.claude/skills/spec-graph/references/protocolo-de-ejecucion.md` al pie de la letra. Esto
solo fija lo específico de este repo — no repite las cinco reglas genéricas.

**Grafo:** [`../grafo.md`](../grafo.md) (33 nodos, tabla completa en §3). **Estado:** `nodos/<id>.json`,
uno por nodo tocado — un nodo sin archivo es `pendiente`, no hay que sembrar nada. **Diario:**
[`HANDOFF.md`](HANDOFF.md), append-only.

## Ramas y PRs (de `docs/brand/intent.md` §0.bis y §8, y `CLAUDE.md`)

Cada nodo que toca código bajo `components/`/`lib/` reorganizado por
`docs/architecture/arquitectura-modular.md` sale en **dos PRs**, en este orden:

1. **PR de migración** — rama `arq/n-<id-en-minúsculas>-<slug>` (ej. `arq/n-01-0a-migrar-shared`),
   desde `main`. Mueve archivos sin cambiar contenido. Cierre: `pnpm build` en `EXIT=0` + recorrido
   en navegador sin diferencia visual/de comportamiento.
2. **PR de marca** — rama `fase-1/marca-N-<slug>` (el prefijo `fase-1/` es el de `CLAUDE.md`, porque
   toda la marca es un entregable de la Fase 1 del proyecto), desde `main`, **después** de mergear el
   de migración — nunca en paralelo sobre la misma base.

Nodos que no reorganizan código (auditorías, docs, scripts nuevos) van en un solo PR, rama
`fase-1/marca-N-<slug>`.

Todo PR de marca actualiza `CURRENT.md` en el mismo PR (regla general de `CLAUDE.md`).

## Verificación

El criterio de cierre de cada nodo, su falso verde y su prueba por mutación ya están escritos en
`grafo.md` §3 — no se repiten aquí. Registrar en el JSON del nodo la salida real de `pnpm build`
(o el comando que aplique) y cómo se descartó el falso verde declarado, no solo "verificado".

## Alias `@/*` durante la migración incremental

`arquitectura-modular.md` §6: el alias pasa a `"@/*": ["./src/*"]` recién en el paso atómico final.
Hasta entonces, todo import hacia un archivo ya migrado usa la ruta completa
`@/src/shared/ui/button`, `@/src/modules/tracking/presentation/components/cookie-banner`, etc. Un
archivo que aún no migró se sigue importando por su ruta actual bajo `@/`.
