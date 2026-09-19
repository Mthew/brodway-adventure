# 008 · El grafo de ejecución de marca (33 nodos) se completó

**Archivado:** 2026-09-19. Se archiva desde `CURRENT.md` el detalle de las tres rondas de
ejecución del grafo de marca (`docs/brand/specs/grafo.md`) — quién hizo qué nodo, en qué orden y
con qué conflictos de merge — ya que el grafo está cerrado: no queda ningún nodo pendiente. Lo que
sí sigue siendo estado actual (el aviso de deploy de Vercel, los hallazgos de seguimiento sin nodo
propio) permanece en `CURRENT.md`.

## Qué pasó

El grafo de 33 nodos (`docs/brand/specs/grafo.md`) se ejecutó completo en tres rondas de agentes
paralelos con worktrees, PR #28 a #64:

- **Ronda 1** (10 nodos día-1): N-01.0a/0b, N-02.1, N-03.0/1/4, N-04.0, N-05.1, N-06.1, N-07.2.
- **Ronda 2** (12 nodos + 1 refinamiento): N-01.1 (paleta oficial, camino crítico), N-02.2/3,
  N-03.2/3, N-04.2, N-05.2/3/4/V, N-06.2/V — más el ajuste de N-02.2 (símbolo en vez de firma
  completa en el navbar, decisión del usuario tras el hallazgo de que `logo-horizontal.png` es
  incompatible con la barra de 80px por el margen interno del archivo del kit).
- **Ronda 3** (8 nodos, el resto): N-02.4/5/V, N-03.5, N-04.1/3/4, N-07.1/3/4.

Cada ronda cerró con una pasada de consolidación: rebase y resolución manual de los conflictos
reales entre PRs paralelos (imports cruzados tras migraciones, dos implementaciones independientes
de `scripts/check-marca.mjs` fusionadas en una sola, un componente extraído con la fuente
tipográfica vieja), verificación de `pnpm build` en `EXIT=0` tras cada merge, y limpieza de los
worktrees ya mergeados.

## Hallazgos que sobrevivieron a la ejecución (quedan en `CURRENT.md`, no aquí)

- **Deploy de Vercel congelado desde el PR #46** — bug real de código ya corregido (`N-02.V`,
  `lib/config.ts`), bloqueado ahora por cuota de la plataforma, no por el código. Sigue siendo
  estado actual hasta que se confirme que producción refleja `main`.
- Regresión de LCP en `/ofertas/[slug]` (banner de cookies) y 7 mensajes de error crudo en
  `lib/admin/{ofertas,destinos}.ts`/`sesion.ts`, ambos fuera del alcance estricto del nodo que los
  encontró — sin nodo propio en el grafo, quedan como deuda técnica suelta.

## Decisiones que dejaron de estar abiertas

- **Navbar usa el símbolo, no la firma horizontal completa** (`N-02.2`, decisión del usuario
  2026-09-19): `public/brand/logo-horizontal.png` no cabe a 180px de ancho dentro de una barra de
  80px de alto por el margen interno de exportación del archivo del kit. Se generó
  `public/brand/simbolo.png` (símbolo recortado con transparencia real) para la navegación; la
  landing de campaña sí usa la firma completa (sin el techo de 80px).
- **Las 10 reglas de `check-marca.mjs` (R-1 a R-10) están completas y activas** dentro de
  `pnpm build` — cualquier desviación futura de marca (hex, léxico, grafía, contraste, radios,
  iconos, tipografía, firma anterior) falla el build automáticamente.
