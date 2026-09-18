# Spec — Fase 1 · Paleta y superficies

> **Intent:** [`../intent.md`](../intent.md) §Fase 1 · **Fuente de marca:**
> [`../sistema-de-identidad.md`](../sistema-de-identidad.md) §4.5
> **Arquitectura:** [`../intent.md`](../intent.md) §0.bis y
> [`../../architecture/arquitectura-modular.md`](../../architecture/arquitectura-modular.md) —
> mapeo de esta fase en §1.bis
> **PR de migración (primero):** rama `arq/paleta-y-superficies`, desde `main`, sin cambio de
> comportamiento
> **PR de marca (segundo, sobre la ubicación ya migrada):** rama `fase-1/marca-1-paleta` · a
> `main`, con `CURRENT.md` en el mismo PR
> **Escrito:** 2026-09-11 · **Estado:** listo para plan

## 0. Objetivo

El objetivo general es **implementar el manual de marca en todo el proyecto: sistema de diseño,
sitio web y backoffice.** Esta fase entrega la primera capa y la que todo lo demás usa: **el
color**. Al terminarla, los cinco colores del manual son los únicos valores de marca del repo, las
superficies del sistema son las que el manual declara, y cada combinación en uso tiene su ratio de
contraste **medido**, no heredado de un comentario.

Esta fase no cambia ni una palabra de copy, ni una tipografía, ni un logo, ni una foto. Cambia el
color y las reglas que gobiernan su uso.

## 1. Alcance

### 1.1 Sistema de diseño

`app/globals.css` (bloque `@theme` y utilidades que llevan color escrito a mano),
`components/ui/{button,badge,section}.tsx` —los tres componentes donde el color vive en variantes
`cva`— y la guía viva `/design-system`, que hoy publica tres ratios que no coinciden con la
medición.

### 1.2 Sitio web

Las 18 rutas bajo `app/[locale]/`. El color llega por clases, así que el trabajo no es editarlas
una a una: es **cambiar el token y verificar los 49 archivos donde se pinta**, más los siete usos
con opacidad (`navy/5`, `navy/15`, `navy/70`, `navy/90`, `turquoise/10`, `turquoise/40`,
`orange/90`), que son los que cambian de forma no lineal.

### 1.3 Backoffice

Las 13 rutas bajo `app/admin/`, su `layout.tsx` —que declara la identidad del panel en su
encabezado y fija la superficie— y `app/admin/piezas.tsx`, que tiene **sus propios botones** en
lugar de usar `components/ui/button.tsx`. Ahí están los cuatro botones naranjas con texto blanco de
§6.1.

### 1.4 Documentación que propaga la paleta

`docs/design/brief-v0.md` §2, `docs/design/brief-v0-producto.md`,
`docs/architecture/spec-tecnica.md` §4 y el encabezado de `app/admin/layout.tsx`. Todos publican
los hex desviados como si fueran oficiales.

**Corrección 2026-09-18 (hallazgo H-1 de [`grafo.md`](grafo.md) §8):** `CLAUDE.md` y `CURRENT.md`
**también** mencionan hoy los tres hex antiguos — de forma legítima, avisando del defecto, no
publicándolos como oficiales — pero ninguno de los dos estaba en esta lista ni en la lista blanca
de A-1/R-1 (§8, §9), que solo exceptúa `history/` y `docs/brand/**`. Sin este PR retirando también
esos dos avisos, el propio `check:marca` que esta fase escribe fallaría contra el PR que lo crea.

### 1.5 Fuera de alcance

Logo, favicon e imagen social (Fase 2) · copy (Fase 3) · ruta de marca e iconografía como sistema
(Fase 4) · fotografía (Fase 5) · familias tipográficas (Fase 6) · el resto del `check:marca`
(Fase 7; aquí entra solo su comprobación de hex) · la escala tipográfica, que ya cumple el manual ·
el rediseño de cualquier sección.

## 1.bis Migración de arquitectura (PR previo, sin cambio de comportamiento)

Antes del cambio de color, un PR aparte (`arq/paleta-y-superficies`) migra lo que §1 toca, con el
límite de `intent.md` §0.bis: **los archivos de convención de Next.js dentro de `app/` no se mueven
todavía** (esperan al paso atómico final); lo que sí migra ya es todo lo demás.

**Movimientos limpios, sin ambigüedad — de `components/` a `src/`:**

| Archivo hoy | Destino | Fuente del destino |
|---|---|---|
| `components/ui/button.tsx` · `badge.tsx` · `section.tsx` | `src/shared/ui/{button,badge,section}.tsx` | `arquitectura-modular.md` §2, `shared/ui/` |
| `components/layout/navbar.tsx` | `src/shared/layout/navbar.tsx` | §2, `shared/layout/` |
| `components/layout/cookie-banner.tsx` | `src/modules/tracking/presentation/components/cookie-banner.tsx` | §2, nota "CookieBanner se muda de `shared/layout`" |
| `components/oferta/sticky-cta.tsx` | `src/modules/offers/presentation/components/sticky-cta.tsx` | §2, `offers/presentation/components/` (`StickyCta`) |

**No se tocan todavía** (son `page.tsx`/convención de Next.js dentro de `app/`, esperan al paso
atómico): `app/globals.css` y `app/[locale]/(sitio)/design-system/page.tsx`. Esta fase edita su
contenido en su ubicación actual — el cambio de color no depende de que ya estén en `src/`.

**Extracción, no movimiento — `app/admin/ofertas/**` y `app/admin/destinos/**`:** estas carpetas
mezclan archivos de ruta (`page.tsx` de listado/alta/edición/fotos/publicar/secciones, que se
quedan bajo `app/` hasta el paso atómico) con componentes de soporte (`OfferFields` y equivalentes,
que `arquitectura-modular.md` §2 asigna a `offers/presentation/admin/` y
`destinations/presentation/admin/`). El PR de migración: (1) identifica cuáles de los archivos de
cada carpeta son de ruta y cuáles son componentes extraíbles — mirando el árbol real, no una lista
fija que quedaría desactualizada; (2) mueve los extraíbles a su módulo; (3) deja cada `page.tsx`
como un envoltorio delgado que importa desde la nueva ubicación, sin más lógica que esa.
`app/admin/piezas.tsx` no es un archivo de ruta ni tiene regla de negocio propia, así que migra
completo a `src/platform/admin/piezas.tsx` — destino ya ratificado en `arquitectura-modular.md` §2
(no en `offers/presentation/admin/`: los botones de §6.1 no son de un solo módulo, son del shell
transversal del panel). `app/admin/layout.tsx` sigue la regla de extracción: su contenido no-ruta
pasa a `src/platform/admin/admin-shell.tsx`, y `app/admin/layout.tsx` queda como el envoltorio que
lo importa.

**Verificación de este PR:** `pnpm build` en `EXIT=0` y recorrido de las 18 rutas públicas + las 13
del panel, sin ningún cambio visual. Los imports que rompan se actualizan como parte del propio
movimiento, no como una edición aparte.

**Si la Fase 3 ya editó el copy del panel primero** (son paralelizables, `intent.md` §6): quien abre
este PR de migración revisa, en su propia descripción, que el texto del copy quedó idéntico tras
extraerlo — un diff de solo-contenido entre el `page.tsx` de origen y el componente extraído,
adjunto al PR. Es la resolución del hallazgo H-5 de [`grafo.md`](grafo.md) §8: antes no tenía dueño
asignado, ahora es criterio de cierre de este PR, no una revisión difusa de "dirección de marca".

## 2. Estado objetivo de los tokens

### 2.1 Color de marca

| Token | Hoy | Objetivo | Por qué |
|---|---|---|---|
| `--color-brand-navy` | `#003062` | **`#0D3B66`** | Manual §15. El muestreo del logo real confirma el valor declarado |
| `--color-brand-turquoise` | `#00aac3` | **`#16B4C6`** | Manual §15 |
| `--color-brand-orange` | `#ff6a03` | **`#FF8A00`** | Manual §15. Es la mayor desviación: 32 puntos en el canal verde |
| `--color-surface-sand` | *no existe* | **`#F6E7C3`** | Manual §15 «Arena cálida», fondo editorial. Entra al sistema en esta fase (§2.3) |
| `--color-surface-alt` | `#f4f7fa` | **`#F2F4F7`** | Manual §15 «Gris ligero». Hoy el repo usa un gris propio casi idéntico; dos grises que se parecen tanto son la vía por la que se cuelan tres |
| `--color-neutral-50` | `#f4f7fa` | **`#F2F4F7`** | Es el mismo valor que `surface-alt`: se mueven juntos o el duplicado reaparece |
| `--color-brand-orange-text` | `#c24a00` | **`#A34400`** | El actual mide 4,91 / 4,57 / 4,50 y falla sobre gris (4,46) y arena (4,01). El nuevo pasa en las cinco superficies |
| `--color-brand-turquoise-text` | `#006b7d` | **sin cambio** | Medido 6,18 / 5,61 / 5,04: pasa en todas |
| `--color-whatsapp` | `#25d366` | **sin cambio**, reetiquetado | No es color de marca: es **color de canal** (§2.4) |

### 2.2 Lo que arrastra el navy sin ser un token

- **Seis sombras en cuatro archivos** llevan el navy anterior escrito en decimal y pasan a
  `rgb(13 59 102 / …)`. Un reemplazo de hex no encuentra ninguna: `--shadow-sm/md/lg` en
  `app/globals.css:204-206`, y tres sombras arbitrarias en `components/layout/navbar.tsx:123`,
  `components/layout/cookie-banner.tsx:75` y `components/oferta/sticky-cta.tsx:87`.
- **El overlay del hero de campaña** (`app/[locale]/lp/[campana]/page.tsx:126`,
  `bg-brand-navy/70` con titular y subtítulo blancos encima) pasa a **`bg-brand-navy/75`** (§3.4).

### 2.3 La arena entra al sistema, pero no repinta nada

Se declara el token y se añade la variante `sand` a `components/ui/section.tsx`
(`bg-surface-sand text-brand-navy`). **Ninguna sección existente cambia de fondo en esta fase.**
Decidir qué bloque editorial merece arena es criterio de composición y pertenece a la Fase 4; lo
que esta fase garantiza es que cuando se decida, el color exista, esté documentado y tenga su
regla de uso (§3.2). La proporción del manual —5 % arena— se mide sobre la pieza terminada, no
sobre el sistema.

### 2.4 Colores que no son de marca

Se declaran como tales en `globals.css` y en `/design-system`, en un grupo aparte:

- **`--color-whatsapp` es color de canal.** Identifica un servicio externo, no a BroWay. Se
  mantiene `#25D366` porque cambiarlo rompería el reconocimiento del canal. Navy sobre él mide
  **5,77:1** ✅. **Decidido y ratificado** el 2026-09-11 (D-E, [`aprobaciones.md`](../aprobaciones.md)):
  se documenta en `/design-system` en un grupo aparte de la paleta, no como color de marca.
- **Los cuatro estados** (`success`, `error`, `warning`, `info`) no están en el manual: son de
  producto. Se mantienen y se re-verifican sobre las superficies nuevas (§4).
- **Los diez neutros fríos no se re-derivan.** Están medidos, cumplen y su matiz azulado sigue en
  armonía con el navy oficial. Re-derivar diez pasos para ganar nada es exactamente el tipo de
  cambio que esta fase no hace.

## 3. Reglas de uso del color

Salen del manual (§4.5.2 y §4.5.3 del sistema de identidad). El código tiene que cumplirlas y
`/design-system` tiene que enseñarlas.

**R-1 · Turquesa y naranja nunca sostienen texto sobre fondo claro.** Sobre blanco miden 2,51 y
2,36. Para texto van los derivados `brand-turquoise-text` y `brand-orange-text`. Sobre navy sí:
turquesa 4,57 y naranja 4,84.

**R-2 · Sobre arena, el texto es navy o `neutral-700`.** El manual lo dice —«combinar con texto
azul o negro suave»— y la medición lo confirma: `neutral-500` cae a **4,25** sobre arena y no se
usa ahí. Los estados tampoco se pintan sobre arena (`error` queda en 4,50, justo en el borde): van
sobre blanco o gris.

**R-3 · El contraste se verifica contra la superficie que el componente pinta.** Un badge pinta
sobre un tinte al 10 % de su propio color, que es **más claro** que el blanco. Sigue vigente la
regla del repo: se mide en el navegador, no leyendo el JSX.

**R-4 · Si una combinación no llega a 4,5:1, se corrige el uso, no el token.** Los cinco hex del
manual no se ajustan. Lo que se cambia es qué color de texto va encima, o la opacidad del velo.

**R-5 · El naranja no es color dominante.** Se reserva para la acción y los puntos de atención. En
esta fase eso se traduce en una cosa concreta: no se añade ningún fondo naranja nuevo.

## 4. Matriz de contraste objetivo

Calculada con la fórmula WCAG 2.x sobre los valores objetivo. **El plan la reproduce midiendo en
navegador**; si un número no coincide, manda la medición y se corrige este spec.

### 4.1 Texto sobre superficies claras

| Token de texto | blanco | gris `#F2F4F7` | arena `#F6E7C3` | tinte navy 10 % | tinte turquesa 10 % |
|---|---|---|---|---|---|
| `brand-navy` | 11,45 | 10,39 | 9,34 | 9,56 | 10,48 |
| `neutral-700` | 9,33 | 8,47 | 7,61 | 7,79 | 8,54 |
| `neutral-600` | 6,95 | 6,31 | 5,67 | 5,80 | 6,36 |
| `neutral-500` | 5,21 | 4,73 | **4,25 ❌** | **4,35 ❌** | 4,77 |
| `brand-orange-text` `#A34400` | 6,21 | 5,63 | 5,06 | 5,18 | 5,68 |
| `brand-turquoise-text` | 6,18 | 5,61 | 5,04 | 5,16 | 5,66 |
| `success` | 5,72 | 5,19 | 4,67 | 4,77 | 5,23 |
| `error` | 5,52 | 5,01 | 4,50 | 4,61 | 5,05 |
| `warning` | 5,66 | 5,14 | 4,62 | 4,73 | 5,18 |
| `info` | 6,18 | 5,61 | 5,04 | 5,16 | 5,66 |

Las dos celdas en rojo son el motivo de **R-2**: `neutral-500` queda fuera de la arena y de los
tintes oscuros. No es un defecto del token —sobre blanco y gris cumple— sino un límite de uso.

### 4.2 Superficies de acento y componentes

| Combinación | Objetivo | |
|---|---|---|
| Blanco sobre navy | 11,45 | ✅ |
| Navy sobre gris | 10,39 | ✅ |
| Navy sobre arena | 9,34 | ✅ |
| Arena sobre navy | 9,34 | ✅ |
| Navy sobre naranja — **botón primario** | 4,84 | ✅ mejora sobre el 4,57 de hoy |
| Navy sobre turquesa — **franja y `Section` turquoise** | 4,57 | ✅ |
| Navy sobre WhatsApp `#25D366` | 5,77 | ✅ |
| Badge `trust` — navy sobre navy 5 % | 10,47 | ✅ |
| Badge `destino` — turquoise-text sobre turquesa 10 % | 5,66 | ✅ |
| Badge `dato` — warning sobre warning 10 % | 4,91 | ✅ |
| Blanco sobre naranja | **2,36** | ❌ prohibido — ver §6.1 |
| Blanco sobre turquesa | **2,51** | ❌ prohibido |

### 4.3 El overlay del hero de campaña

Peor caso: foto blanca pura debajo, texto blanco encima.

| Opacidad | Con `#003062` (hoy) | Con `#0D3B66` | |
|---|---|---|---|
| `navy/70` | 5,31 | 4,76 | cumple, sin colchón |
| **`navy/75`** | 6,17 | **5,50** | ✅ recupera y supera el margen actual |
| `navy/80` | 7,27 | 6,39 | oscurece la foto de más |

**Objetivo: `navy/75`.** El subtítulo es `text-body-lg` (17-18 px, texto normal: umbral 4,5), así
que el margen importa; el titular es `text-h1` y es texto grande.

## 5. Cambios por archivo

Inventario de dónde hay que mirar. **No es la lista de pasos** —eso es del plan— sino el mapa del
terreno, para que nada quede fuera por olvido. Las rutas de esta tabla son las de **hoy**; el PR de
migración de §1.bis mueve primero lo que tiene destino claro (§1.bis lista exactamente qué sí y qué
no) — al llegar a este PR, los archivos movidos ya están en su destino nuevo, y los que son
convención de Next.js (`app/globals.css`, `design-system/page.tsx`, los `page.tsx` del panel) siguen
donde siempre.

| Archivo | Qué cambia |
|---|---|
| `app/globals.css` | Los tres colores de marca, `surface-alt`, `neutral-50`, `brand-orange-text`, el token nuevo de arena, las tres sombras del `@theme`, y los comentarios de contraste que hoy dan números inflados |
| `components/ui/section.tsx` | Variante `sand` nueva; las cuatro existentes se re-verifican |
| `components/ui/button.tsx` | Sin cambio de clases: `primary` mejora a 4,84 y `whatsapp` queda en 5,77. Se verifica, no se edita |
| `components/ui/badge.tsx` | Sin cambio de clases; se re-mide cada variante sobre su propio tinte |
| `components/layout/navbar.tsx:123` · `components/layout/cookie-banner.tsx:75` · `components/oferta/sticky-cta.tsx:87` | Sombras arbitrarias con `rgba(0,48,98,…)`: el navy antiguo en decimal |
| `app/[locale]/lp/[campana]/page.tsx:126` | `navy/70` → `navy/75` y el comentario que lo justifica |
| Los 49 archivos con clases `brand-*` | Verificación visual y de contraste; no se editan salvo que R-1 o R-2 lo exijan |
| `app/admin/piezas.tsx:128` · `app/admin/page.tsx:73` · `app/admin/destinos/page.tsx:66` · `app/admin/ofertas/page.tsx:82` | **`text-white` → `text-brand-navy`** sobre el botón naranja (§6.1) |
| `app/admin/layout.tsx:13-15` | El encabezado declara los hex antiguos como identidad del panel |
| `app/[locale]/(sitio)/design-system/page.tsx:29-54` | Los seis colores, sus ratios y los cuatro estados; añadir arena y el grupo «color de canal» |
| `docs/design/brief-v0.md:63,85-95` · `docs/design/brief-v0-producto.md:116-118` · `docs/architecture/spec-tecnica.md:173-175` | Los hex desviados y los ratios que ya no aplican |
| `CLAUDE.md` · `docs/README.md` · `CURRENT.md` | Los tres avisan hoy de que «los hex del código no son los de la marca» (`CURRENT.md` y `CLAUDE.md` no estaban en esta fila hasta el hallazgo H-1 de `grafo.md` §8). Al cerrar la fase eso deja de ser cierto: el aviso pasa a historia o se retira en los tres. Un aviso caduco enseña a desconfiar de los avisos |
| `scripts/check-marca.mjs` *(nuevo)* + `package.json` | Adelanto de la Fase 7: solo la comprobación de hex (§8) |
| `CURRENT.md` | En el mismo PR, además de lo anterior. Incluye corregir la fila de E1/E2, que dice «En revisión» y ya está en `main` |

## 6. Defectos que esta fase corrige

### 6.1 Cuatro botones del backoffice con texto blanco sobre naranja

`app/admin/piezas.tsx:128`, `app/admin/page.tsx:73`, `app/admin/destinos/page.tsx:66` y
`app/admin/ofertas/page.tsx:82` pintan la acción principal del panel con `text-white` sobre
`bg-brand-orange`: **2,87:1 hoy, 2,36:1 con la paleta oficial.** Los cuatro fallan AA ahora mismo y
empeoran con el cambio, así que no se pueden dejar para después.

Es el mismo error que el sitio público ya resolvió: `components/ui/button.tsx` pinta
`primary: bg-brand-orange text-brand-navy` (4,84 ✅). El panel no usa ese componente, tiene sus
propias piezas. **Corrección en esta fase:** el texto pasa a `text-brand-navy`. **Deuda que se
anota y no se paga aquí:** que el panel use el `Button` del sistema en lugar de duplicarlo.

### 6.2 Tres ratios falsos publicados en la guía viva

`/design-system` publica «5.98 blanco / 5.56 alt / 5.32 tinte» para `brand-orange-text` cuando la
medición da 4,91 / 4,57 / 4,50, y publica los tres hex desviados como oficiales. La guía del
sistema enseñando el color equivocado es peor que no tener guía.

## 7. Lo que no se toca, aunque lo parezca

Escrito para que nadie lo «arregle» de paso:

- **El velo del hero de la home es negro neutro**, no navy (`app/globals.css` `.hero-scrim`), desde
  el 2026-08-16. No depende de la paleta y **no entra en esta fase**. Los comentarios de
  `components/ui/hero.tsx:26-32` describen el navy que tuvo antes: se actualizan como comentario,
  nada más.
- **Los diez iconos turquesa sobre fondo claro se quedan.** Miden 2,51:1, pero los diez llevan
  `aria-hidden="true"` y acompañan a un texto que dice lo mismo: son decorativos, así que el
  mínimo de 3:1 para gráficos informativos no les aplica, y el manual admite el turquesa como
  elemento gráfico sin texto. Subirlos de contraste cambiaría la estética sin ganar accesibilidad.
- **El texto turquesa de `como-pagar/page.tsx:115` está sobre navy** (4,57 ✅). Es justo lo que el
  manual recomienda; no es una violación de R-1.
- **La escala tipográfica, los radios, el espaciado y los breakpoints.** Ya cumplen el manual.
- **Los neutros y los cuatro estados** (§2.4).

## 8. Criterios de aceptación

| # | Criterio | Cómo se verifica |
|---|---|---|
| **A-1** | Los cinco hex del manual son los únicos valores de marca del repo | `grep -rniE "003062\|00aac3\|ff6a03"` sobre código y `docs/` → resultados **solo** en `history/` y en `docs/brand/**`, que los citan como defecto ya corregido. Medido el 2026-09-16: 9 archivos los contienen hoy fuera de esa lista blanca (`design-system/page.tsx`, `admin/layout.tsx`, `globals.css`, `CLAUDE.md`, `CURRENT.md`, `spec-tecnica.md`, `brief-v0-producto.md`, `brief-v0.md`, `docs/README.md`) — el número exacto no es el criterio, solo una referencia para no sorprenderse si el `grep` da otro (hallazgo H-3 de `grafo.md` §8: la fecha de escritura del spec decía doce) |
| **A-2** | Ningún hex de marca vive fuera del `@theme` | `pnpm check:marca` en verde dentro del `build` |
| **A-3** | Cada combinación de la matriz §4 medida **en navegador** coincide con el spec, o el spec se corrige con la medición | DevTools sobre las páginas reales, no cálculo sobre el papel |
| **A-4** | Ningún texto queda por debajo de 4,5:1 y ningún texto grande por debajo de 3:1, en las 18 rutas públicas y las 13 del panel | Recorrido de páginas + los cuatro botones de §6.1 |
| **A-5** | El overlay del hero de campaña mide ≥ 5,0:1 con el peor caso | Medición con foto clara |
| **A-6** | `/design-system` publica la paleta oficial, sus ratios reales, la arena y el grupo de color de canal | Abrir la página |
| **A-7** | El panel se ve con la identidad correcta y su encabezado ya no declara hex antiguos | Recorrido del panel |
| **A-8** | `pnpm build` pasa (incluye `check:tokens`, `check:current` y el nuevo `check:marca`) | CI local |

## 9. Verificación

Tres pasadas, en este orden:

1. **Mecánica.** `pnpm build`. El `check:marca` de esta fase comprueba **dos reglas de hex**, y
   nada más —nombre, léxico y «Next Stop» los añade la Fase 3—:

   - **Los tres valores antiguos no aparecen en ningún sitio.** Lista blanca: `history/` y los
     documentos de marca que los citan explícitamente como defecto (`docs/brand/*.md`).
   - **Ningún hex de los cinco colores de marca aparece fuera de `app/globals.css`.** Única
     excepción declarada: `app/[locale]/(sitio)/design-system/page.tsx`, cuya razón de existir es
     publicar la paleta. La excepción va escrita en el script, no descubierta por quien lo ejecute.

   La segunda regla es la que impide que la desviación se repita: hoy nada frena a alguien que
   escriba un hex «parecido» directamente en un componente.
2. **Medida.** Cada fila de §4 que se use de verdad, comprobada en el navegador contra la
   superficie real. La evidencia va en el PR: la tabla con los valores medidos al lado de los
   esperados.
3. **Vista.** Recorrido de las 18 rutas públicas y las 13 del panel en móvil y escritorio, con
   atención a los siete usos con opacidad y a los dos heroes, que son donde el color se comporta de
   forma no lineal.

## 10. Riesgos

| Riesgo | Señal | Respuesta |
|---|---|---|
| El naranja oficial es más claro y «pesa» distinto en el botón primario | El CTA se siente menos contundente aunque mida mejor (4,84 vs 4,57) | No se toca el color. Si hace falta presencia, se ajusta tamaño o espacio, nunca el hex (R-4) |
| El navy oficial es más claro: las superficies oscuras pierden profundidad | Secciones `navy` menos densas | Se acepta: es el color de la marca. El contraste sigue en 11,45 |
| Un uso de `neutral-500` aparece sobre arena o sobre un tinte | Texto gris apagado en un bloque cálido | R-2. Sube a `neutral-600` o navy |
| El cambio toca 49 archivos y alguna pantalla se queda sin revisar | Una combinación fuera de la matriz | La verificación es por ruta, no por archivo: 18 + 13 rutas |
| Aparece una combinación que no llega a 4,5 y no está en §4 | Medición en navegador | Se corrige el uso y se añade la fila a la matriz del spec |

## 11. Entregables del PR

0. **El PR de migración de §1.bis (`arq/paleta-y-superficies`) ya mergeado a `main`.** Este PR no
   se abre sobre la ubicación antigua de los archivos.
1. El cambio de tokens y las correcciones de uso que §5 lista.
2. `scripts/check-marca.mjs` con su comprobación de hex, enganchado a `pnpm check`.
3. `/design-system` actualizado: paleta oficial, ratios medidos, arena y color de canal.
4. Los cuatro documentos de §1.4 sin hex desviados.
5. **La tabla de medición real** —esperado vs. medido— en el cuerpo del PR. Sin ella el PR no
   cumple A-3.
6. `CURRENT.md` actualizado en el mismo PR.
