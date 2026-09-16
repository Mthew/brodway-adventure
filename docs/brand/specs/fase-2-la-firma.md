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

**Actualización 2026-09-15 — llegó el kit oficial.** El cliente entregó
[`docs/brand/Kit_Marca_BroWay_Adventures/`](../Kit_Marca_BroWay_Adventures/) (`LEEME.txt` incluido).
Es 100 % raster —JPG, PNG e ICO, nada de vector— pero **resuelve la firma y el favicon con archivo
oficial**, no con un recorte provisional del manual vivo. Verificado por medición, no por confianza:
el arte de `01_Logo_Principal` mide exactamente **1444×464 en un lienzo de 1759×894**, la misma caja
que ya se había medido sobre el manual vivo (§3) — es el mismo diseño, ahora entregado como archivo.

| Archivo | Qué es | Sirve para |
|---|---|---|
| `public/logo-broway.png` | Sello circular de la identidad **anterior**, 1254×1254 | Nada. Se retira |
| `public/logo.jpeg` | El arte nuevo en lienzo **cuadrado** 1080×1080, **JPEG sin transparencia** | Nada tal cual: no es la firma horizontal. Supersedido por el kit (fila siguiente) |
| `docs/brand/manual-vivo/` | El manual vivo archivado: HTML, CSS y los tres SVG de recursos | Referencia, no assets de producto. Sus `<img src="assets/logo-principal.png">` y `assets/favicon.png` nunca existieron en el repo — se veían solo en la página viva |
| `Kit_Marca_BroWay_Adventures/01_Logo_Principal/BroWay_Logo_Principal_Azul_Naranja.{png,jpg}` | **Firma horizontal oficial.** Lienzo 1759×894, arte 1444×464 (3,11:1). Navy medido `#0F3962` / naranja `#FE8201` — a un par de puntos del oficial `#0D3B66`/`#FF8A00`, variación de exportación, no de token. Lienzo blanco, **sin canal alfa** | Fuente real de §3 y §4.1-4.2. Ya no se recorta a mano del manual vivo |
| `Kit_Marca_BroWay_Adventures/02_Variacion_Turquesa/BroWay_Logo_Variacion_Azul_Turquesa.{png,jpg}` | Misma geometría, «Way» en turquesa (`#0EB0C8`, ≈ oficial `#16B4C6`) en vez de naranja | Variante **autorizada, no por defecto** (`LEEME.txt`: «usar únicamente como alternativa autorizada»). No sustituye a la azul/naranja sin pedido explícito |
| `Kit_Marca_BroWay_Adventures/03_Favicons/BroWay_Favicon_Fondo_Blanco_{512,1024}.png` | **Símbolo aislado** (arte 701×611, sin wordmark), navy `#0D3B66` y naranja `#FF8A00` **exactos** al oficial, sobre blanco opaco | Fuente de `app/icon.png` y `app/apple-icon.png` (§4.3) |
| `Kit_Marca_BroWay_Adventures/03_Favicons/BroWay_Favicon_Fondo_Azul_1024.png` · `BroWay_Favicon.ico` | Mismo símbolo sobre navy opaco. El fondo azul mide `#073B6E` — **no coincide** con el navy oficial `#0D3B66`, verificar antes de usarlo como superficie de sección | `.ico` (256 px, multi-resolución) es la fuente directa de `app/favicon.ico` |
| `Kit_Marca_BroWay_Adventures/04_Perfiles_Sociales/BroWay_Perfil_Instagram_Facebook_2048.{png,jpg}` · `…_Simbolo_WhatsApp_1080.png` | Foto de perfil **cuadrada** para redes (logo dentro del área segura circular) y símbolo para WhatsApp Business | Assets de redes sociales, **no de este repo**: no sirven como `opengraph-image` (§4.4 pide 1200×630) ni se suben a `public/`. Se entregan a quien administra los perfiles |
| **`Kit_Marca_BroWay_Adventures/logo.png`** *(añadido 2026-09-15, después del resto del kit)* | La firma horizontal, ya recortada a su caja de tinta (1200×441, arte 1119×358, ratio 3,13:1) y **con canal alfa real** — verificado: esquina en `alpha=0`, tinta en `alpha≈253`. Mismo navy/naranja que `01_Logo_Principal`, no monocromático | **Resuelve la transparencia** para superficies claras, arena, gris y foto (con placa si hace falta). **No resuelve navy**: el trazo «Bro» sigue en navy y se funde con un fondo navy |
| Vertical · monocromática blanca (para navy) · SVG de todo | **Siguen sin existir.** El kit no las trae | Sigue bloqueando la firma en el pie y el panel (fondo navy) — es lo único que la transparencia de `logo.png` no arregla, porque el problema ahí es de color, no de canal alfa |

**Consecuencia de alcance:** el favicon, la firma sobre superficie clara (incluida foto, gracias a
`logo.png`) y la previsualización social **ya no están bloqueados por falta de archivo** —el kit los
resuelve—; la firma sobre **fondo navy** (pie, panel) **sigue bloqueada**, porque la pieza que falta
no es transparencia sino una tinta que no sea navy: la monocromática blanca. La fase usa el archivo
oficial donde lo hay y declara lo segundo, sin improvisar recoloreando la firma — eso es exactamente
lo que el manual prohíbe (P-2).

## 3. Geometría de la firma

Medido sobre `Kit_Marca_BroWay_Adventures/01_Logo_Principal/BroWay_Logo_Principal_Azul_Naranja.png`,
el archivo oficial del kit (§2) — coincide exacto con lo que ya se había medido sobre el manual vivo,
así que esta geometría no cambia, solo deja de depender de un recorte manual:

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

## 5. Archivos maestros: recibidos el 2026-09-15, y lo que sigue faltando

**Documentación que arrastra el archivo anterior:** `docs/design/brief-v0.md:422` instruye
literalmente «usa `/logo-broway.png` como src, ratio horizontal» — describe un archivo que ni es
horizontal ni es la marca. Se corrige en esta fase.

**Decidido el 2026-09-11 (D-C):** la fase **no esperaría al SVG**, y pedía el paquete maestro en
paralelo mientras se publicaban provisionales derivados del manual vivo. **Eso ya no aplica tal
cual**: el 2026-09-15 llegó `docs/brand/Kit_Marca_BroWay_Adventures/` con la firma horizontal, el
símbolo aislado, favicons, perfiles sociales y, después, `logo.png` con canal alfa real (§2). No es
el paquete maestro completo que pedía D-C —sigue sin haber SVG, vertical ni monocromática—, pero
resuelve la parte que D-C trataba como provisional para superficies claras.

**Lo que el kit ya resuelve, con archivo oficial y no con recorte manual:**

1. **Firma horizontal.** `01_Logo_Principal` para el lienzo completo y `logo.png` ya recortado a su
   caja y con transparencia real — se usa tal cual, sin reconstruir ni recortar a mano.
2. **Favicon e iconos de app.** `03_Favicons/BroWay_Favicon.ico` y los `Fondo_Blanco_{512,1024}.png`
   son el símbolo aislado, listos para §4.3.
3. **Perfiles de redes.** `04_Perfiles_Sociales/` cubre la foto de perfil de Instagram/Facebook y el
   símbolo de WhatsApp Business — fuera del alcance de cualquier spec anterior, se entrega a quien
   administra esos perfiles; no es un asset que este repo sirva.

**Lo que el kit no trae, y sigue bloqueado exactamente como antes:**

- **Vector.** Los diez archivos del kit son JPG, PNG o ICO. Escalar la firma a un tamaño grande
  (una portada, una lona) sigue dependiendo de un raster.
- **Vertical.** No existe ninguna versión vertical del lockup.
- **Monocromática blanca (o negra).** `logo.png` resuelve la transparencia, pero su tinta sigue
  siendo navy/naranja — sobre un fondo navy el «Bro» se funde con el fondo. El pie
  (`components/layout/footer.tsx`) y el panel (D-C, sin cambios) siguen esperando esta pieza, que es
  la única que de verdad bloquea algo hoy.

**Condiciones que siguen aplicando al usar los archivos del kit:**

1. **Peso controlado.** `01_Logo_Principal/…png` pesa 744 KB para un arte que en pantalla no pasa de
   unos cientos de píxeles de ancho; `logo.png`, ya recortado, es la base más liviana. Se redimensiona
   al uso real (§3: la firma no necesita más de ~3× su tamaño de pantalla). El presupuesto de
   rendimiento de `spec-home-v1.md` no se toca a la baja, y la firma es LCP en móvil.
2. **No se recolorea ni se reconstruye (R-1).** El kit ya es el arte final: la única operación
   permitida sobre él es recortar y redimensionar, nunca repintar ni separar «Bro» de «Way».
3. **La variante turquesa (`02_Variacion_Turquesa/`) no es la opción por defecto.** El propio
   `LEEME.txt` la marca como «alternativa autorizada»: se reserva para cuando dirección de marca la
   pida para una pieza puntual, no para alternar con la azul/naranja sin motivo.

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
| **B-8** | Los assets copiados del kit declaran su procedencia y fecha, y lo que sigue sin resolver (SVG, vertical, monocromática) consta como pendiente, no como asset fantasma | `public/**/README` |
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

1. Los assets de la firma y del símbolo en `public/` y en `app/`, copiados desde
   `docs/brand/Kit_Marca_BroWay_Adventures/` con un `README` que declara su procedencia (kit oficial,
   recibido 2026-09-15) y lo que sigue sin resolver (SVG, vertical, monocromática blanca), y el
   archivo de la identidad anterior retirado de `public/`.
2. Navegación y landing de campaña publicando la firma real, con la geometría de §3.
3. `favicon.ico`, `icon.png` y `apple-icon.png` desde el símbolo.
4. `metadataBase`, `openGraph`, `twitter`, `viewport.themeColor` y la imagen social por defecto con
   su `alt`.
5. `openGraph.images` en oferta, destino y campaña con su propia foto.
6. La captura de la tarjeta de WhatsApp y la tabla de medidas de §8 en el cuerpo del PR.
7. `CURRENT.md` actualizado en el mismo PR.
