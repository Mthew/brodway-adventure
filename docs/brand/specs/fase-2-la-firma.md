# Spec — Fase 2 · La firma

> **Intent:** [`../intent.md`](../intent.md) §Fase 2 · **Fuente de marca:**
> [`../sistema-de-identidad.md`](../sistema-de-identidad.md) §4.2, §4.3 y §4.4
> **Depende de:** Fase 1 (el navy oficial: la placa del símbolo y el `themeColor` lo usan)
> **Rama:** `fase-1/marca-2-firma` · **PR:** a `main`, con `CURRENT.md` en el mismo PR
> **Escrito:** 2026-09-11 · **Estado:** listo para plan

## 0. Objetivo

Que la marca que el proyecto muestra **sea** la marca, en las cuatro superficies donde una persona
la reconoce antes de leer nada: la navegación, la landing de campaña, la pestaña del navegador y la
previsualización de un enlace compartido.

Hoy fallan las cuatro. No es una cuestión de matiz: **son piezas de otra identidad**.

## 1. Punto de partida, verificado

| Superficie | Qué publica hoy | Verificado en |
|---|---|---|
| Navegación | El **sello circular anterior** (`/logo-broway.png`, 1254×1254), escalado por altura a 44 px en móvil y 56 px en escritorio | `components/layout/navbar.tsx:128-141` |
| Landing de campaña | El mismo sello, declarando `width={180} height={56}` — una relación de aspecto que el archivo cuadrado no tiene | `app/[locale]/lp/[campana]/layout.tsx:36-43` |
| Pestaña del navegador | **El favicon de `create-next-app`**: el triángulo blanco sobre círculo negro de Vercel | `app/favicon.ico`, 25.931 bytes, 16×16 y 32×32 |
| Enlace compartido | **Nada.** No hay `metadataBase`, ni `openGraph`, ni `twitter`, ni `themeColor` en ningún layout | `app/[locale]/layout.tsx:61-90` |
| Pie de página | No lleva firma | `components/layout/footer.tsx` |
| Panel | No lleva firma | `app/admin/layout.tsx` |

**El canal de conversión dominante de este negocio es WhatsApp**, y hoy un enlace pegado en un chat
no muestra marca alguna. Es la brecha más visible del proyecto y la más barata de cerrar.

## 2. Archivos: lo que hay y lo que falta

| Archivo | Qué es | Sirve para |
|---|---|---|
| `public/logo-broway.png` | Sello circular de la identidad **anterior**, 1254×1254 | Nada. Se retira |
| `public/logo.jpeg` | El arte nuevo en lienzo **cuadrado** 1080×1080, **JPEG sin transparencia** | Nada tal cual: no es la firma horizontal y no se puede poner sobre color |
| `docs/brand/manual-vivo/` | El manual vivo archivado: HTML, CSS y los tres SVG de recursos | Referencia, no assets de producto |
| Firma horizontal del manual vivo | PNG 1759×894 con **lienzo blanco**; el arte ocupa 1444×464 | Provisional sobre superficies claras, recortado a su caja y con el fondo hecho transparente |
| Símbolo del manual vivo | PNG **1254×1254**: paloma blanca con estela naranja sobre placa navy | **Favicon e iconos de app: alcanza de sobra** |
| Vertical · monocromáticas (azul/negro/blanco) · SVG de todo | **No existen** | Bloquea la firma sobre navy (pie, hero oscuro) |

**Consecuencia de alcance:** el favicon y la previsualización social **no están bloqueados**; la
firma sobre fondo oscuro **sí**. La fase entrega lo primero y declara lo segundo, no lo improvisa
recoloreando la firma — eso es exactamente lo que el manual prohíbe (P-2).

## 3. Geometría de la firma

Medido sobre el archivo real del manual vivo, no estimado:

| Magnitud | Valor |
|---|---|
| Caja del arte (sin el aire del lienzo) | **1444 × 464 px** |
| Relación de aspecto | **3,11 : 1** |
| Altura de la mayúscula = **X** (la B del manual) | 246 px = **0,53 × la altura de la caja** |
| Mínimo digital de la firma horizontal | **180 px de ancho** (manual §13) |
| Zona de seguridad | **1 × X** alrededor de toda la firma (manual vivo §01) |

A 180 px de ancho, la firma mide **58 px de alto** y **X = 31 px**.

### 3.1 El conflicto: 180 px + zona de seguridad no caben en una barra de 80 px

La navegación tiene un techo de **80 px** (Pre-Flight §11.B, y el `<header>` actual mide
exactamente eso). Con la firma al mínimo del manual, la zona de seguridad completa pediría
58 + 31 + 31 = **119 px de alto**. No caben.

**Interpretación declarada en este spec:** la zona de seguridad protege la firma de **otros
elementos**, no del borde del contenedor que la enmarca. En la navegación eso significa:

- Firma a **180 px de ancho** (58 px de alto) — se cumple el mínimo del manual.
- **≥ 31 px libres** hasta el siguiente elemento (el menú, el selector de idioma, cualquier CTA).
- El aire vertical es el que deje la barra de 80 px: **11 px arriba y abajo**, sin ningún elemento
  invadiendo por encima o por debajo.

Es una interpretación, no una licencia: quedó **ratificada el 2026-09-11 como decisión D-F**
([`aprobaciones.md`](../aprobaciones.md)). Si algún día se revoca hacia la lectura estricta, la
salida no es encoger la firma por debajo de 180 px —eso sí rompe el manual— sino **usar el símbolo
en la navegación** (mínimo 40 px), que es un uso que el manual contempla para espacios reducidos.

**Móvil.** Hoy la firma se renderiza a 44 px de alto ≈ 137 px de ancho: por debajo del mínimo. Con
180 px de ancho ocupa el 48 % de una pantalla de 375 px y convive con el botón de menú. Si al
medirlo no cupiera con holgura, se aplica el símbolo (40 px) solo en móvil, con la firma completa
desde `md`.

## 4. Estado objetivo por superficie

### 4.1 Navegación — `components/layout/navbar.tsx`

Firma horizontal real, dimensionada **por ancho** y no por altura (hoy se dimensiona por altura
porque el archivo era cuadrado; con la firma horizontal la referencia correcta es el ancho, que es
donde el manual pone el mínimo). `priority` se mantiene: es LCP en móvil. La barra sigue midiendo
≤ 80 px y el `<Link>` conserva su `aria-label`.

### 4.2 Landing de campaña — `app/[locale]/lp/[campana]/layout.tsx`

La misma firma, con las dimensiones reales del archivo declaradas —no 180×56 sobre un archivo
cuadrado, que es lo que hay hoy— y sin `<Link>`: en una landing identifica, no navega.

### 4.3 Pestaña del navegador y escritorio

| Archivo | Contenido | Tamaño |
|---|---|---|
| `app/favicon.ico` | El **símbolo**: paloma sobre placa navy | 16 · 32 · 48 px |
| `app/icon.png` | El símbolo | 512 px |
| `app/apple-icon.png` | El símbolo | 180 px |

Son convenciones de archivo de Next 16 (`favicon.ico` solo en la raíz de `app/`; `icon` y
`apple-icon` en cualquier segmento). **Nunca se reduce el logo completo para hacer un icono**: se
usa el símbolo (manual §12). El panel (`app/admin/`) hereda o declara el suyo, pero no inventa uno
distinto.

### 4.4 Previsualización social

En el layout público (`app/[locale]/layout.tsx`), dentro de `generateMetadata`:

- **`metadataBase`** a partir de `SITE_URL` (`lib/config`), que ya existe y ya usan `robots.ts` y
  `sitemap.ts`. Sin él, las rutas relativas de imagen no se resuelven.
- **`openGraph`**: `type`, `siteName`, `locale`, `title`, `description` y `url`.
- **`twitter`**: `card: "summary_large_image"`.
- **Imagen por defecto**: `opengraph-image.png` de **1200 × 630** con la firma sobre fondo de marca,
  acompañada de `opengraph-image.alt.txt`. Una sola idea por composición: la firma y nada más
  (P-3: al logo no se le añade eslogan).
- **`themeColor`** con el navy oficial, en **`export const viewport`** — en Next 16 `themeColor` ya
  no va dentro de `metadata`.

**Páginas con foto propia** (oferta, destino, campaña): declaran su propia imagen en
`openGraph.images` reutilizando la fotografía que ya publican. Es la parte que de verdad se comparte
por WhatsApp y no cuesta ningún asset nuevo. La composición de marca sobre esa foto —placa de
protección, encuadre, tipografía— **no entra aquí**: depende de la dirección fotográfica y es de la
Fase 5.

### 4.5 Pie de página y panel

**Fuera de alcance, y por una razón, no por olvido:** el pie es navy y el panel también usa
superficies de color; poner ahí la firma exige la **versión monocromática blanca**, que no existe.
Recolorear la firma a mano está prohibido (P-2). Queda declarado como bloqueado por **D-C**.

## 5. Archivos maestros: qué se pide y qué es provisional

**Documentación que arrastra el archivo anterior:** `docs/design/brief-v0.md:422` instruye
literalmente «usa `/logo-broway.png` como src, ratio horizontal» — describe un archivo que ni es
horizontal ni es la marca. Se corrige en esta fase.

**Decidido el 2026-09-11 (D-C):** la fase **no espera al SVG**. Se pide el paquete maestro en
paralelo —SVG de la firma horizontal, versión vertical, símbolo aislado y monocromáticas en azul,
negro y blanco— y mientras tanto se publican assets provisionales derivados del manual vivo, con
tres condiciones que el plan debe cumplir:

1. **Recorte, no reconstrucción.** La firma se recorta a su caja (1444×464) y se le hace
   transparente el fondo. No se redibuja, no se cambia ni un color, no se separa «Bro» de «Way».
2. **Se marcan como provisionales** en un `README` junto a los archivos, con la fecha y qué falta.
   Un PNG sin nota se vuelve definitivo por inercia.
3. **Peso controlado.** El origen pesa 758 KB para la firma y 1 MB para el símbolo: se redimensionan
   a lo que la página usa de verdad (la firma no necesita más de ~3× su tamaño de pantalla). El
   presupuesto de rendimiento de `spec-home-v1.md` no se toca a la baja, y la firma es LCP en móvil.

## 6. Reglas que el código debe cumplir

**R-1 · No se recolorea, no se deforma, no se reconstruye.** Ni `filter`, ni `rotate`, ni `skew`,
ni sombras sobre el `<img>` de la firma. Si hace falta contraste sobre una foto, se usa **placa de
protección**, no un filtro sobre el logo (manual §16).

**R-2 · Nada se añade al logo.** Ni eslogan, ni «Next Stop», ni «Hermanos de aventuras», ni una
tagline de campaña pegada debajo (P-3).

**R-3 · Para icono, avatar y marca de agua se usa el símbolo**, nunca la firma completa reducida.

**R-4 · Mínimos:** 180 px de ancho la firma horizontal · 120 px la vertical · 40 px el símbolo ·
16/32/48 px el favicon. Por debajo del mínimo no se publica: se cambia de versión.

**R-5 · La firma no se pone sobre una imagen con detalle** sin zona limpia o placa.

## 7. Criterios de aceptación

| # | Criterio | Cómo se verifica |
|---|---|---|
| **B-1** | La navegación y la landing de campaña publican la firma real, a ≥ 180 px de ancho, con ≥ 31 px hasta el siguiente elemento | Medición en DevTools, móvil y escritorio |
| **B-2** | La barra de navegación sigue midiendo ≤ 80 px de alto | DevTools |
| **B-3** | La pestaña del navegador muestra el símbolo de BroWay, no el triángulo de Vercel | Abrir el sitio en Chrome y Safari |
| **B-4** | Un enlace del sitio pegado en WhatsApp muestra tarjeta con imagen, título y descripción de marca | Pegar una URL de producción o de preview en un chat |
| **B-5** | Una oferta y un destino comparten su propia foto, no la imagen genérica | Depurador de OG y pegado real |
| **B-6** | `themeColor` es el navy oficial y está en `export const viewport`, no en `metadata` | Inspección del HTML generado |
| **B-7** | Ningún archivo de la identidad anterior queda en `public/`, y ninguna referencia apunta a él | `grep -rn "logo-broway"` → cero resultados en código y en `docs/design`. Se conserva `docs/brand/logo-broway-adventures.png` como registro histórico, y `docs/README.md` lo nombra así |
| **B-8** | Los assets provisionales están marcados como tales, con fecha y con lo que falta | `public/**/README` |
| **B-9** | El LCP móvil del home no empeora respecto a la medición previa | Lighthouse antes y después, en el PR |
| **B-10** | `pnpm build` pasa, incluido el `check:marca` de la Fase 1 | CI local |

## 8. Verificación

1. **Mecánica.** `pnpm build` y el `grep` de B-7.
2. **Medida.** Ancho renderizado de la firma, separación hasta el elemento contiguo, alto de la
   barra y peso de los assets. Los números van en el PR.
3. **Real.** Pegar la URL en WhatsApp —el canal del negocio— y en un segundo cliente (Slack o
   Telegram), que leen los mismos `og:` y descubren errores distintos. Una captura en el PR.
4. **Vista.** La firma en móvil y escritorio, en la navegación y en la landing, con y sin scroll.

## 9. Riesgos

| Riesgo | Señal | Respuesta |
|---|---|---|
| La firma a 180 px deja la navegación apretada en móvil | El menú o el idioma se acercan a menos de 31 px | Símbolo en móvil (R-3, mínimo 40 px), firma completa desde `md` |
| El PNG provisional muestra halos al hacer el fondo transparente | Borde blanco sucio sobre superficies claras | No se publica: se espera al SVG. Un logo con halo es peor que un logo grande |
| La firma es el LCP y el asset pesa más que el actual | Lighthouse baja | Redimensionar al uso real; el sello actual pesa 1 MB, así que hay margen de sobra para mejorar |
| El OG se cachea en WhatsApp y parece que no funciona | La tarjeta no aparece tras publicar | Es caché del scraper: se verifica con un parámetro nuevo en la URL antes de dar por roto el cambio |
| Alguien «arregla» el pie añadiendo la firma recoloreada a blanco | Firma blanca inventada | Está prohibido (P-2). El pie espera a la monocromática |

## 10. Fuera de alcance

Firma en el pie y en el panel (§4.5) · composición de marca sobre fotografía y placa de protección
como pieza gráfica (Fase 5) · ruta de marca y sistema gráfico (Fase 4) · tipografía (Fase 6) ·
piezas impresas y plantillas de documento: no existen en el repo.

## 11. Entregables del PR

1. Los assets de la firma y del símbolo en `public/` y en `app/`, con su `README` de provisionalidad,
   y el archivo de la identidad anterior retirado de `public/`.
2. Navegación y landing de campaña publicando la firma real, con la geometría de §3.
3. `favicon.ico`, `icon.png` y `apple-icon.png` desde el símbolo.
4. `metadataBase`, `openGraph`, `twitter`, `viewport.themeColor` y la imagen social por defecto con
   su `alt`.
5. `openGraph.images` en oferta, destino y campaña con su propia foto.
6. La captura de la tarjeta de WhatsApp y la tabla de medidas de §8 en el cuerpo del PR.
7. `CURRENT.md` actualizado en el mismo PR.
