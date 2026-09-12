# Estado actual

> Máximo 50 líneas. Al rebasarlo, se archiva en `history/` (ver `CLAUDE.md` §Flujo de trabajo).

**Actualizado:** 2026-09-11 · **Fase:** 1 (MVP) · **Plan:** [`docs/product/plan-fase-1.md`](docs/product/plan-fase-1.md)

## En qué punto va

| Entregable | Estado | Rama / PR |
|---|---|---|
| Sitio, docs del cliente, panel admin, **E1**+**E2** ([`006`](history/006-supabase-y-arquitectura-cliente.md)) | ✅ Mergeado | PR #1-#22 |
| Marca: fuente de verdad, intent, 7 specs y 7 decisiones cerradas | 📄 Documentado | sin rama |

## Lo que hay que saber para no romper nada

- **La marca tiene un documento rector:** [`docs/brand/sistema-de-identidad.md`](docs/brand/sistema-de-identidad.md),
  que manda sobre `brief-v0.md` §2 y `spec-tecnica.md` §4 en color, logo, tipografía y copy. **Los
  hex del código no son los de la marca y el logo publicado tampoco:** `#003062`/`#00aac3`/`#ff6a03`
  deben ser `#0D3B66`/`#16B4C6`/`#FF8A00`, y `/logo-broway.png` es la firma anterior. **No lo arregles
  de paso** — cambia páginas y contrastes, va en su propio paso ([`history/007`](history/007-fuente-de-verdad-de-marca.md)).
- **Node 24.14.1.** Si tu shell tiene otra: `export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"`
- **El contenido vive en Supabase, no en el repo.** `lib/mock/` es SEMILLA (editarlo NO cambia el sitio); `lib/offers` y `lib/destinations` son la única puerta y ninguna página la salta.
- **`COLUMNAS_OFERTA` (`lib/supabase/client.ts`) se mantiene a mano.** `anon` tiene SELECT por
  COLUMNA, así que `select("*")` falla. Toda columna pública nueva: concederla a `anon` Y añadirla ahí.
- **Slugs reservados** (`lib/destinations/categorias.ts`): `internacionales`, `nacionales`, `pueblos-de-antioquia`. Un destino así se prerenderiza y NUNCA se sirve, sin error.
- **13 secciones en la home, intercaladas a propósito**: apilar las 5 comerciales rompe el
  Pre-Flight §11.B. Al tocarla, recontar (cabecera de `page.tsx`). LCP aún sin medir.
- **No correr `shadcn init`:** destruye `lib/utils.ts` ([`history/001`](history/001-shadcn-cli-descartado.md)).
- **Cero librerías de animación.** `animation-timeline` en `@supports`: sin soporte el contenido queda VISIBLE; si el panel no compone frames, dan `null` sin estar rotas ([`004`](history/004-preflight-fase-1.md)).
- **El hero usa `<picture>` a mano, NO `next/image`:** evita que el móvil se baje además el apaisado.
- **Sin IDs de medición no se carga etiqueta ni se emite evento** (`.env.example`).
- **Tipografía: decidido Manrope** ([`aprobaciones.md`](docs/brand/aprobaciones.md)); el código
  sigue en Montserrat/Lato/Caveat hasta la Fase 6. El mínimo de 14px y el interlineado 1,45 no cambian.
- **Verde = WhatsApp, naranja = enviar formulario.** Un solo color por intención en todo el sitio.
- **Contraste: verifica contra la superficie real, no contra blanco** ([`history/005`](history/005-velo-del-hero.md)), y
  recalcula: el ratio documentado de `--color-brand-orange-text` está inflado ~1,1 puntos.

## Bloqueos externos (ninguno se resuelve con código)

- **Con fecha límite:** enviar a NextGen las columnas que le faltan al Google Sheet **antes** de su
  sesión de levantamiento ([`brecha`](docs/product/brecha-estructura-funcional.md)).
- **Abiertos:** contrato de `/api/lead` con NextGen · texto legal sin abogado · titularidad de
  GA4/Meta/TikTok · **archivos maestros de marca** (no hay SVG; faltan vertical, símbolo aislado,
  monocromáticas) · **fotografía propia** · **RNT** · **testimonios** · horario · pagos · correo.

## Decisiones abiertas

- **Ninguna de marca**: las siete (D-A…D-G) se cerraron el 2026-09-11. Lo que sigue pendiente es
  material, no criterio: archivos maestros en SVG y fotografía propia.
- Pendiente con marca: el precio va como "1.290.000 COP" sin el `$` del brief.
