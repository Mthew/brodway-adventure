# 006 · Supabase y la arquitectura de información del cliente

**Agosto de 2026.** Archivado de `CURRENT.md` al cerrar E1 y E2.

Entre el 13 y el 16 de agosto llegaron tres documentos del cliente que redefinieron el alcance de
la Fase 1: su especificación funcional del sitio, sus requerimientos para el sistema comercial, y
la propuesta con la que NextGen respondió. El contraste completo está en
[`brecha-estructura-funcional.md`](../docs/product/brecha-estructura-funcional.md); esto registra
lo que se construyó y lo que se aprendió construyéndolo.

## Lo que se hizo

- **E2 — Supabase** (`007e494`). Proyecto `brodway-manager`, Postgres 17.6. Seis migraciones:
  cuatro enums, las tablas `destinos` · `ofertas` · `imagenes` · `testimonios`, RLS y permisos por
  columna. Sembrado desde `lib/mock/`, que pasó de ser la fuente a ser la semilla. El sitio dejó de
  leer del repositorio sin que ninguna página cambiara: `lib/offers/index.ts` y
  `lib/destinations/index.ts` eran la única puerta, y ahí se pagó el encapsulamiento.
- **E1 — Arquitectura de información** (`0f83f68`, `627cb77`). `/paquetes` → `/ofertas`, cinco rutas
  nuevas (dos colecciones curadas y tres categorías de destino), navbar con el menú del cliente,
  `HotelCard`, y las cinco secciones comerciales de la home.

## Cuatro fallos que sólo aparecieron al verificar

Ninguno era visible leyendo el código. Los cuatro salieron de probar contra el sistema real.

1. **`REVOKE SELECT (columna)` no hacía nada.** En Postgres, revocar una columna no surte efecto
   mientras el rol conserve el `SELECT` de la tabla completa. La API pública devolvía `mayorista` en
   texto plano. La corrección revoca la tabla y reconcede columna por columna — de ahí que
   `COLUMNAS_OFERTA` exista y haya que mantenerla a mano.
2. **Las políticas de escritura eran `FOR ALL`**, que incluye `SELECT`. Además del aviso del linter,
   escondía algo peor: un `UPDATE` primero debe poder `SELECT` la fila, y la única política que
   cubría a `authenticated` excluía los borradores. El backoffice no habría podido editar una oferta
   en borrador, y el `UPDATE` no habría fallado: habría afectado 0 filas en silencio.
3. **`[categoria]` junto a `[slug]` es inválido.** Next.js no admite dos segmentos dinámicos
   hermanos. Se rehízo con tres rutas estáticas que delegan en un componente compartido, lo que
   además dio la precedencia necesaria sobre `[slug]` y obligó a reservar esos tres nombres.
4. **La tarjeta destacada medía 1096px de alto.** Al ocupar dos columnas (1088px de ancho), su
   imagen 4:3 se estiraba a 816px. Una proporción pensada para una tarjeta de 530px no sobrevive al
   doble de ancho. Medido en navegador: 4:3 → 1096px, 16:9 → 892px, 21:9 → 746px.

Y dos bugs de i18n que el build gritó: `PackageCard` tenía su CTA en español a fuego (así que `/en`
mostraba español con la clave traducida ya existente y sin usar), y faltaba la etiqueta de la tercera
categoría en el namespace `destinos`.

## Estado del hero, que ocupaba media página de `CURRENT.md`

El trabajo de impacto visual del hero (velo neutro, `--text-hero`, tarjetas de destino, "Cómo
funciona" en secuencia vertical) se cerró en los PR #14, #15 y #17. Lo que sigue vigente de aquello
es el método de medición de contraste, que está en [`005`](005-velo-del-hero.md), y el hecho de que
el hero use `<picture>` escrito a mano en vez de `next/image`.
