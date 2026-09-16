# Intent — Aplicar la identidad de marca a todo lo construido

> **Fuente de verdad:** [`sistema-de-identidad.md`](sistema-de-identidad.md). Este documento no
> redefine la marca: declara **qué se va a cambiar en el proyecto para cumplirla**, en qué orden y
> por qué en ese orden. Si algo aquí contradice el sistema de identidad, manda el sistema.
>
> **Escrito:** 2026-09-11 · **Estado:** las siete fases tienen spec ([`specs/`](specs/)). Falta el plan de cada una.

## 0. Qué es este documento y qué no

Es el primer eslabón de una cadena de tres:

```
intent.md          ← este archivo: QUÉ se busca, POR QUÉ, en qué ORDEN, cuándo está HECHO
  └── specs/fase-N-<slug>.md   ← por fase: QUÉ se toca exactamente, con qué reglas y criterios
        └── plan               ← por spec: los PASOS, en orden, con su verificación
```

**Aquí no hay tareas, ni archivos línea por línea, ni decisiones de implementación.** Eso es del
spec y del plan. Lo que este documento fija y los otros dos no pueden cambiar: el alcance de cada
fase, su criterio de terminado y la razón por la que va donde va.

Cada fase con cambio de código es **dos ramas y dos PRs** — uno de migración de arquitectura y uno
de marca, en ese orden, ver §0.bis — o **una** si la fase no toca código que la migración reorganice
(caso de la Fase 7). Ambos salen de `main` (`CLAUDE.md` §Flujo de trabajo) y el de marca actualiza
`CURRENT.md` en el mismo PR.

> **Nota de lectura.** En `sistema-de-identidad.md`, «F1» y «F2» son las dos **fuentes** (manual
> vivo y manual v2.0). Aquí «Fase 1»…«Fase 7» son **fases de trabajo** y nunca se abrevian como
> F1/F2; a las fuentes se las llama por su nombre.

## 0.bis Esta migración también reorganiza el código (arquitectura module-first)

**Fuente de verdad de esto:** [`../architecture/arquitectura-modular.md`](../architecture/arquitectura-modular.md)
y los ADR de [`../architecture/README.md`](../architecture/README.md) (`ADR-0001`…`ADR-0005`,
aceptados el 2026-09-15). Este documento no repite esas reglas: declara cómo se cruzan con las
siete fases de marca.

El repo tiene un diseño objetivo de arquitectura (`src/`, module-first, capas
`domain/application/infrastructure/presentation`) todavía sin ejecutar: `src/` no existe. Las siete
fases de este documento tocan buena parte del árbol de archivos que ese diseño reorganiza — el
color toca `components/ui/*` y `app/admin/**`, la firma toca `components/layout/navbar.tsx`, la voz
toca `components/forms/*`. Tocar cada uno de esos archivos por su color o su copy y dejarlo
exactamente donde ya se sabe que no va a quedarse es trabajo que se repite dos veces.

**Regla.** `ADR-0005` ya definía "código que se toca, se migra" como oportunidad, no obligación
(regla 3). Para estas siete fases se eleva a **obligación, acotada al archivo que la fase ya iba a
tocar** — nunca al módulo completo. Si la Fase 1 solo cambia el color de
`components/ui/button.tsx`, migra ese archivo a `src/shared/ui/button.tsx`; no arrastra el resto de
`offers/` con él, porque el color no lo toca.

**Por qué dos PRs y no uno.** `ADR-0005` regla 1 es categórica: "ningún PR mezcla migración de
arquitectura con funcionalidad nueva". Mover un archivo y cambiarle el color en el mismo diff hace
imposible distinguir, en revisión, "esto se movió" de "esto cambió de verdad". Cada una de las
fases con cambio de código queda entonces en **dos PRs, no uno**:

1. **PR de migración** (rama `arq/<slug-de-la-fase>`, desde `main`): mueve, sin editar contenido,
   los archivos que la fase va a tocar, a su ubicación en `arquitectura-modular.md` §2, y actualiza
   sus imports. Criterio de cierre: el de `ADR-0005` §5 — `pnpm build` en `EXIT=0` y recorrido en
   navegador **sin ninguna diferencia visual o de comportamiento**. Si algo cambia, el PR está mal
   planteado.
2. **PR de marca** (rama `fase-1/marca-N-<slug>`, desde `main`, **después** de que el PR de
   migración ya se mergeó — nunca en paralelo sobre la misma base, para no resolver el mismo
   conflicto dos veces): el cambio de color/firma/copy/etc. que describe el spec de la fase, ya
   sobre la ubicación nueva.

Si un archivo no tiene destino claro todavía en `arquitectura-modular.md` (pasa con alguna pieza del
panel — ver la nota en el spec de la Fase 1 §1.bis), el PR de migración también decide ese destino,
con el mismo criterio de la tabla `arquitectura-modular.md` §4, y lo dice explícitamente en su
descripción — no lo deja "por ahora" en su sitio actual.

**Límite duro que ninguna fase puede saltarse (`ADR-0001`/`ADR-0005` regla 6): `app/` no se mueve
archivo por archivo.** Next.js no permite `app/` y `src/app/` a la vez, así que todo archivo que sea
**convención de Next.js** — `page.tsx`, `layout.tsx`, `route.ts`, `loading/error/not-found.tsx`,
`favicon.ico`, `icon.png`, `apple-icon.png`, `sitemap.ts`, `robots.ts`, `globals.css`, `proxy.ts` —
se queda exactamente donde está hasta el paso atómico final, que no es parte de ninguna fase de
marca y se hace aparte, cuando todos los módulos ya existan en `src/`. Lo que **sí** puede migrar ya,
aunque hoy viva físicamente dentro de `app/`, es cualquier componente que **no** sea uno de esos
archivos de convención — por ejemplo `app/admin/piezas.tsx` (un componente normal que hoy está mal
ubicado, no una ruta) o la lógica que hoy vive *dentro* de un `page.tsx` de `app/admin/ofertas/**` y
que `arquitectura-modular.md` §2 ya asigna a `modules/offers/presentation/admin/`. En ese segundo
caso, el PR de migración **extrae** el contenido al módulo y deja el `page.tsx` como un envoltorio
delgado que solo importa y renderiza desde la nueva ubicación — el archivo de ruta no se mueve, lo
que hace es dejar de contener nada más que ese import. Cuál de los archivos de una carpeta es
"de ruta" y cuál es "extraíble" se decide mirando el árbol real en el momento de migrar, no
copiando una tabla fija: los specs de fase señalan el principio y el módulo destino, no un mapa
archivo-por-archivo que se desactualizaría solo.

**Qué no cambia por esto.** El criterio de terminado de cada fase (§5 más abajo) sigue siendo el
mismo: la migración es una condición previa, no parte del objetivo de marca. Un PR de migración que
además cambiara un hex no cumple ninguno de los dos criterios de cierre, y un PR de marca que además
moviera archivos tampoco.

**Mapa rápido — qué zona de `arquitectura-modular.md` toca cada fase** (el mapeo exacto, archivo por
archivo, vive en el §1.bis de cada spec):

| Fase | Zonas de `src/` que toca |
|---|---|
| 1 · Paleta y superficies | `shared/ui/`, `shared/layout/` (sombras), `offers/presentation/`, `destinations/presentation/`, el panel (`platform/` o su hueco, ver Fase 1 §1.bis) |
| 2 · La firma | `shared/layout/` (navbar), `campaigns/presentation/` (landing), el layout público (metadatos) |
| 3 · Identidad verbal | `leads/presentation/` (formularios); `messages/*.json` no se mueve (ADR-0001, se queda en la raíz) |
| 4 · Sistema gráfico | `shared/ui/` (iconos, radios), `src/app/[locale]/(sitio)/page.tsx` (la ruta) |
| 5 · Fotografía | `offers/presentation/`, `destinations/presentation/` (fichas), el panel (carga de fotos) |
| 6 · Tipografía | `src/app/globals.css` y los dos layouts (público y panel) |
| 7 · Gobierno | Ninguna: `scripts/check-marca.mjs` se queda en la raíz (como los otros `check:*`) y sus patrones de búsqueda cubren `src/**` desde que se escribe, no se reescriben después |

## 1. El resultado que se busca

> Que cualquier persona que abra el sitio, el panel o un enlace compartido reconozca a BroWay
> Adventures **sin leer el nombre**, y que lo que reconozca sea lo que el manual declara — no una
> aproximación derivada de una captura de pantalla.

Está hecho cuando las seis preguntas del checklist de gobierno del manual (manual v2.0 §24) se contestan
que sí en las 18 páginas públicas y en el panel:

1. ¿Se reconoce BroWay? · 2. ¿El mensaje es claro? · 3. ¿El tono es cercano? ·
4. ¿El contraste es suficiente? · 5. ¿La pieza respeta logo, color y tipografía? ·
6. ¿«Next Stop» se usa con moderación?

Y cuando se cumplen estas cinco condiciones verificables:

| # | Condición | Cómo se comprueba |
|---|---|---|
| **C-1** | Ningún valor de color de marca vive fuera del bloque `@theme` de `app/globals.css` | `pnpm check:marca` (Fase 7) |
| **C-2** | El logo publicado es el real en sus cuatro superficies: navegación, landing de campaña, favicon y previsualización social | Inspección + compartir una URL en WhatsApp |
| **C-3** | La matriz de contraste que publica `/design-system` coincide con la medición real, y ninguna combinación en uso baja de 4,5:1 sin estar declarada como texto grande | Medición en navegador, no lectura del JSX |
| **C-4** | Todo CTA visible sale de los cinco aprobados y ningún texto usa el léxico prohibido | `pnpm check:marca` + revisión de `messages/*.json` |
| **C-5** | Las decisiones abiertas de marca están cerradas por quien puede cerrarlas, o declaradas como pendientes con su impacto | §7 de este documento |

## 2. No-objetivos

- **No es un rediseño.** No se replantea la arquitectura de información, ni el orden de las
  secciones de la home, ni el funnel. El manual describe cómo se ve y cómo suena la marca, no qué
  páginas existen.
- **No se copia el manual vivo como implementación.** Incumple su propia tabla de contraste
  (`sistema-de-identidad.md` §5.9). Es referencia de dirección visual, no código a portar.
- **No se toca el rendimiento a la baja.** Los techos de `spec-home-v1.md` siguen vigentes: sin
  librería de animación, sin fuentes extra sin retirar otras, LCP por debajo de su presupuesto.
- **No se decide la tipografía aquí.** Es del cliente (§7).
- **No se aprovecha para meter modo oscuro, Storybook ni tokens nuevos** que el manual no pida.

## 3. El terreno — lo que hay construido hoy

Medido en el repo el 2026-09-11, no estimado:

| Superficie | Tamaño | Qué la ata a la marca |
|---|---|---|
| Páginas públicas | **18** rutas bajo `app/[locale]/` (incluidas `/design-system` y `/demo-crm`, internas) | color, tipografía, copy, fotografía |
| Panel administrativo | **13** rutas bajo `app/admin/` | mismos tokens, sus propias fuentes cargadas aparte |
| Componentes | **22** en `components/` | 3 de ellos (`button`, `badge`, `section`) concentran el color en variantes `cva` |
| Archivos que usan clases `brand-*` | **49** | 195 ocurrencias; `text-brand-navy` es 116 de ellas |
| Tokens de color de marca | **4** en `@theme` (navy, turquesa, naranja, WhatsApp) + 2 derivados de texto | el manual declara **5**: faltan arena y gris. Además 3 sombras llevan el navy escrito en decimal |
| Copy | **303 claves × 2 idiomas** en `messages/` | voz, tono, léxico, CTAs |
| Fotografía | **22** imágenes en `public/destinos/` | dirección fotográfica del manual |
| Logo | **2** usos (`navbar.tsx`, `lp/[campana]/layout.tsx`) | la firma anterior |
| Presencia social | **0** | no hay `openGraph`, ni `twitter`, ni `themeColor`, ni `metadataBase` |
| Iconos | **9** archivos con `@phosphor-icons/react` | reglas de iconografía del manual |
| Caveat | **0** usos en componentes | se carga en el layout y no la usa nadie |

Tres consecuencias de este inventario que cambian el plan:

- **El color está bien concentrado.** 49 archivos usan clases, pero ninguno escribe un hex: los
  valores viven en un solo bloque. Cambiar la paleta es tocar un archivo y **re-verificar 49**, no
  editar 49.
- **No hay presencia social.** El canal dominante del negocio es WhatsApp y hoy un enlace
  compartido no muestra marca. Es la brecha de identidad más barata de cerrar y la más visible.
- **Caveat no se usa.** La parte cara de la decisión tipográfica (§7) resultó ser barata: si el
  cliente la retira, se borran dos líneas, no se reescribe el sitio.

## 4. Lo que el cambio de paleta hace de verdad

Antes de mover un token: **ninguna combinación en uso se rompe, pero seis de nueve pierden margen.**
Medido con la fórmula WCAG 2.x sobre los componentes reales:

| Componente | Hoy | Con el manual | |
|---|---|---|---|
| Botón primario — navy sobre naranja | 4,57 | **4,84** ↑ | ✅ |
| Botón secundario — blanco sobre navy | 13,13 | **11,45** ↓ | ✅ |
| Botón WhatsApp — navy sobre `#25D366` | 6,62 | **5,77** ↓ | ✅ |
| Badge `trust` — navy sobre navy 5 % | 11,99 | **10,47** ↓ | ✅ |
| Badge `destino` — `#006B7D` sobre turquesa 10 % | 5,56 | **5,66** ↑ | ✅ |
| Franja turquesa — navy sobre turquesa | 4,71 | **4,57** ↓ | ✅ |
| Texto navy sobre `surface-alt` | 12,21 | **10,65** ↓ | ✅ |
| Naranja-texto `#C24A00` sobre naranja 10 % | 4,41 | **4,50** | ⚠️ al límite |
| **Overlay del hero de campaña** (`lp/[campana]`) — blanco sobre `navy/70`, foto blanca debajo | 5,31 | **4,76** ↓ | ⚠️ margen |

De aquí salen dos reglas que el spec de la Fase 1 tiene que respetar, y que sin medir no se verían:

1. **Los overlays teñidos de navy se recalculan, no se heredan.** El del hero de campaña
   (`lp/[campana]`) es el único que queda: pasa de 5,31 a 4,76:1 en el peor caso — sigue
   cumpliendo, pero el colchón desaparece. El velo del hero de la home **no entra aquí**: desde el
   2026-08-16 es negro neutro y no depende de la paleta ([`history/005`](../../history/005-velo-del-hero.md));
   sus comentarios describen el navy que tuvo antes, no el CSS de hoy.
2. **`--color-brand-orange-text` cambia a `#A34400`.** El actual queda en 4,50 dentro de su propio
   tinte y ya falla sobre las dos superficies del manual que hay que adoptar (gris 4,46 · arena
   4,01). El reemplazo mide 5,68 / 5,63 / 5,06.

## 5. Las fases

Siete fases. Cada una deja el sitio **publicable**: no hay estados intermedios rotos, y ninguna
depende de que la siguiente se haga «algún día».

---

### Fase 1 · Paleta y superficies

**Intención.** Que el color del proyecto sea el del manual, y que la matriz de contraste vuelva a
ser verdad. Es la base: todo lo demás se pinta encima.

**Por qué va primero.** Es la desviación que más superficie afecta (49 archivos, las 18 páginas y
el panel), la que ya se propagó a cinco documentos, y la única que además invalida números
publicados en la guía viva. Mientras no se corrija, cualquier trabajo nuevo nace desviado.

**Alcance.** Los tres colores de marca a su valor oficial; las dos superficies que faltan (arena y
gris ligero) y su reconciliación con el `surface-alt` actual; el derivado de texto naranja; las
sombras que llevan el navy escrito en decimal; el overlay teñido del hero de campaña; la guía viva
`/design-system`; el panel administrativo, que comparte tokens; y los documentos que propagan los
hex antiguos (`brief-v0.md`, `brief-v0-producto.md`, `spec-tecnica.md` §4, el encabezado de
`app/admin/layout.tsx`).

**Fuera de alcance.** Logo, tipografía, fotografía y copy. Solo color y superficies.

**Terminado cuando.** Los cinco hex del manual son los únicos valores de marca del repo; cada
combinación en uso está medida en navegador contra la superficie que pinta de verdad y documentada
con su ratio real; `/design-system` publica esos números; y el sitio se ve igual de legible que
antes en móvil, heroes incluidos.

**Riesgos.** El overlay del hero de campaña y el naranja-texto (§4). Si al medir en navegador alguna combinación
queda por debajo de 4,5, se corrige **el uso**, no el token: el color de marca no se ajusta.

---

### Fase 2 · La firma

**Intención.** Que la marca que el sitio muestra sea la marca. Hoy publica la firma anterior y no
existe en ninguna previsualización compartida.

**Por qué va aquí.** Es lo primero que un humano reconoce, y depende de la Fase 1: la placa del
símbolo y el fondo de la imagen social se pintan con el navy oficial.

**Alcance.** El logo real en la navegación y en la landing de campaña; su zona de seguridad (1× la
altura de la B) y sus mínimos (180 px la firma horizontal); el favicon construido **desde el
símbolo**, nunca desde el logo reducido, en 16/32/48; la previsualización social que hoy no existe
—`metadataBase`, `openGraph`, `twitter`, `themeColor` con el navy— y la placa de protección cuando
la firma cae sobre fotografía.

**Fuera de alcance.** Piezas impresas y plantillas de documento: no hay ninguna en el repo.

**Terminado cuando.** Las cuatro superficies de C-2 muestran la firma correcta, un enlace pegado en
WhatsApp muestra tarjeta de marca, y el archivo de la firma anterior ya no existe en `public/`.

**Dependencia externa, ya resuelta como decisión (D-C).** El **SVG maestro**
(`sistema-de-identidad.md` §8.3) sigue sin llegar y **no se espera**. Medido contra los
archivos que existen de verdad, el bloqueo es más pequeño de lo que parecía y está repartido: el
**símbolo** sí está disponible en PNG de 1254×1254 (el manual vivo lo sirve como `favicon.png`),
así que el favicon **no está bloqueado**; la **firma horizontal** solo existe con fondo blanco
—`public/logo.jpeg` es cuadrado y sin transparencia, y el PNG del manual trae lienzo blanco—, así
que sirve sobre superficies claras y no sobre navy; y la **monocromática blanca no existe**, que es
lo único que bloquea de verdad la firma en el pie y sobre fotografía. Lo que exige vector o versión
blanca queda declarado como bloqueado, no improvisado.

---

### Fase 3 · Identidad verbal

**Intención.** Que el sitio no solo evite lo prohibido, sino que **suene** como el manual: voz de
seis atributos, mensajes con estructura y llamados a la acción aprobados.

**Por qué aquí y no al final.** No depende de ninguna otra fase —es copy— y puede avanzar en
paralelo a la Fase 2. Además es donde el proyecto ya parte con ventaja: lo prohibitivo está
cumplido (cero léxico prohibido, cero grafías incorrectas del nombre, «Next Stop» una sola vez y
sin traducir). Falta lo afirmativo.

**Alcance.** Las 303 claves en los dos idiomas, auditadas contra la voz (§3.1 del sistema), la
estructura del mensaje en cuatro pasos y los cinco CTAs aprobados; el microcopy de formularios,
errores y estados vacíos, que es donde el tono se rompe primero; y el tono de las páginas legales,
que deben sonar serenas sin dejar de ser exactas.

**Fuera de alcance.** El texto legal en sí (sigue bloqueado por abogado) y el contenido editorial
que vive en Supabase, no en el repo.

**Terminado cuando.** Cada CTA visible es uno de los cinco; ningún bloque empieza por la invitación
saltándose la información que reduce incertidumbre; y el inglés conserva la voz, no es una
traducción literal.

---

### Fase 4 · Sistema gráfico: ruta, iconos y composición

**Intención.** Que la identidad aparezca en la **estructura** de las páginas y no solo en el color:
la ruta como elemento reconocible, los iconos con una sola lógica, una idea principal por bloque.

**Por qué después de 1 y 2.** La ruta y los iconos se pintan con los colores oficiales y conviven
con la firma. Hacerlo antes obligaría a rehacerlo.

**Alcance.** La ruta de marca como divisor, marco y guía de lectura —una sola dominante por
composición, con nodos que marcan origen, decisión o destino—; la iconografía bajo las reglas del
manual (azul de base, turquesa y naranja solo como acento, sin mezclar lineal con sólido, máximo
4-5 por composición) revisando los nueve archivos que ya usan iconos; y los marcos abiertos.

**La ruta ya existe** en «Cómo funciona» —espinazo animado con nodos— y está bien resuelta. El
trabajo no es diseñarla: es nombrarla, declararla en el sistema y dejar de contradecirla con los
otros cuatro tratamientos de línea que conviven hoy en el sitio.

**Fuera de alcance.** Sustituir la familia de iconos. La decisión vigente (`@phosphor-icons/react`,
`weight="regular"`) **cumple** las reglas del manual; cambiarla es coste sin beneficio mientras no
exista un set oficial en vector.

**Terminado cuando.** Ninguna composición tiene dos rutas compitiendo ni más de cinco iconos, y
ningún icono usa un color que no sea de la paleta.

---

### Fase 5 · Fotografía

**Intención.** Que las imágenes muestren **cómo se siente viajar**, con espacio negativo pensado
para los titulares, y no postales intercambiables.

**Por qué aquí.** Necesita la firma resuelta (placa de protección) y es la fase con mayor
dependencia externa, así que va después de lo que sí controlamos.

**Alcance.** Auditar las 22 imágenes actuales contra los seis criterios del manual —personas, luz,
composición, momentos, destinos, edición—; decidir cuáles se quedan, cuáles se recortan distinto y
cuáles hay que reemplazar; fijar las reglas de recorte y de espacio negativo para que un titular
nunca aterrice sobre detalle; y llevar la dirección fotográfica **al panel**, que es de donde salen
las fotos del catálogo y donde hoy no se dice nada sobre qué subir.

**Fuera de alcance.** Producir fotografía. Y la imagen del manual vivo **no sirve**: es generada y
su propio pie la declara de uso referencial; publicarla chocaría con «imágenes que aparenten
servicios no ofrecidos».

**Terminado cuando.** Cada imagen publicada pasa los seis criterios o está marcada como provisional
con su reemplazo pedido.

**Dependencia externa, ya resuelta como decisión (D-D).** La fotografía propia sigue sin
llegar y la fase **no la espera**: entrega veredictos, recortes, `alt` y la guía del panel, y deja
pedida la lista priorizada.

---

### Fase 6 · Tipografía

**Intención.** Cerrar la única contradicción del sistema de identidad que no se puede resolver
leyendo los manuales.

**Ya no va al final.** Estaba ahí porque no dependía de nosotros; con D-A cerrada sube al tercer
puesto, detrás de la Fase 1 y de las que pueden ir en paralelo: toca los mismos archivos que la
paleta, y hacerlas seguidas evita medir el sitio dos veces.

**Alcance decidido (D-A y D-B).** Manrope en los dos layouts —el público y el del panel—, la
jerarquía por peso (800 / 700 / 400-500), las alternativas de sistema que declara el manual, y la
retirada de Caveat, que hoy no usa ningún componente.

**Y tres correcciones que ya venían con el terreno**, independientes de la familia que se elija:
el panel carga
el rango variable completo de Montserrat para usar tres pesos; sus variables de `next/font` se
llaman igual que los tokens del sistema y funcionan solo por una regla de la cascada que nadie
eligió; y la cadena de respaldo no es la que declara el manual (`Arial`, `Helvetica`).

**Fuera de alcance.** La escala. H1-H4, cuerpo, botón, mínimo de 14 px e
interlineado 1,45 vienen del manual v2.0 y valen con cualquier familia: ya están implementados y no
se tocan.

**Terminado cuando.** El sitio y el panel cargan exactamente las familias que la marca declara, sin
ninguna cargada y sin usar.

---

### Fase 7 · Gobierno: que no se vuelva a desviar

**Intención.** Que la próxima desviación falle en el `build` en lugar de descubrirse un año
después.

**Por qué existe.** El desvío de color no fue descuido: fue un documento diciendo que los colores se
habían «extraído del logo oficial» y nadie con un modo de contradecirlo. Sin verificación
mecánica, esto se repite.

**Alcance.** Un `pnpm check:marca` dentro del `build`, junto a los dos checks que ya existen, que
verifique lo mecanizable: la escritura del nombre, el léxico prohibido, que no haya hex de marca
fuera del `@theme` y que «Next Stop» no aparezca dos veces en una misma página. Más el Pre-Flight
de marca en el brief y el registro de aprobaciones del manual (§7 del sistema de identidad).

**Adelanto deliberado, en dos tramos.** La comprobación de **hex** se escribe con la Fase 1 y las
tres reglas de **texto** —léxico, nombre y «Next Stop» repetido— con la Fase 3. Si el guardián
llega al final, el trabajo de las fases intermedias puede desviarse otra vez mientras tanto. A esta
fase le queda el Pre-Flight de marca y el registro de aprobaciones.

**Terminado cuando.** `pnpm build` falla ante un hex de marca fuera de sitio, una grafía incorrecta
del nombre o una promesa prohibida.

---

## 6. Secuenciación y dependencias

```
Fase 1 Paleta ──┬──→ Fase 2 Firma ──→ Fase 5 Fotografía
                │         ↑ SVG maestro: pendiente, pero D-C decidió no esperarlo
                ├──→ Fase 4 Sistema gráfico
                └──→ Fase 7 Gobierno (su check de hex se adelanta a la Fase 1)

Fase 3 Verbal ───── independiente: puede ir en paralelo desde el primer día

Fase 6 Tipografía ─ desbloqueada (D-A: Manrope). Entra tras la Fase 1, con la que comparte
                    el mismo archivo de tokens
```

**El árbol está limpio.** No hay PRs abiertos ni ramas por delante de `main`, así que es el momento
para el cambio transversal: cuanto más tarde, más archivos nacen con el color desviado.

**Orden recomendado de ejecución:** Fase 1 → Fases 2 y 3 en paralelo → Fase 6 → Fase 4 → Fase 5 →
Fase 7. La Fase 6 sube al tercer puesto ahora que está decidida: toca `app/globals.css` y los dos
layouts, los mismos archivos que la Fase 1, y hacerlas seguidas evita medir dos veces. Si hubiera
que elegir solo dos, son las **Fases 1 y 2**: son las que hacen que el sitio deje de mostrar una
marca que no es la de la empresa.

## 7. Decisiones — cerradas el 2026-09-11

Las siete están **ratificadas por dirección de marca** y registradas en
[`aprobaciones.md`](aprobaciones.md), que es el documento que manda sobre esta tabla: aquí queda el
resumen para leer el intent de corrido.

| # | Decisión | Qué se decidió | Afecta a |
|---|---|---|---|
| **D-A** | Familia tipográfica | **Manrope**, una sola familia (400-800). La escala y los pesos por nivel no cambian | Fase 6, rama A |
| **D-B** | «Next Stop» en cursiva | **No.** Caveat sale del sistema; coste nulo, hoy tiene cero usos | Fase 6 |
| **D-C** | Archivos maestros | **Se ejecuta con provisionales marcados**, sin esperar al SVG. El pie y el panel esperan a la monocromática blanca | Fase 2 |
| **D-D** | Fotografía propia | **La Fase 5 se ejecuta sin material nuevo**; lo que haya que reemplazar se marca y se pide en lista priorizada | Fase 5 |
| **D-E** | El verde de WhatsApp | **Color de canal, no de marca.** Se mantiene `#25D366`, documentado aparte de la paleta | Fase 1 |
| **D-F** | Zona de seguridad en la navegación | **Protege de otros elementos, no del borde del contenedor.** Firma a 180 px, ≥31 px hasta el menú, barra en 80 px | Fase 2 |
| **D-G** | El superlativo «Mejores» | **Se mantiene el nombre del cliente** y los dos listados abren con la aclaración de que es una selección, no un ranking | Fase 3 |

Con esto **ninguna fase queda bloqueada por una decisión**. Lo que sigue pendiente no es criterio
sino material: el paquete de archivos maestros y la fotografía propia, ambos en
[`aprobaciones.md`](aprobaciones.md) §Lo que sigue pendiente.

## 8. Cómo se verifica que la marca quedó aplicada

Tres niveles, del más barato al más caro, y ninguno sustituye a los otros:

1. **Mecánico** (`pnpm check:marca`, Fase 7): nombre, léxico, hex fuera de sitio, «Next Stop»
   repetido. Corre en cada `build`.
2. **Medido en navegador**: contraste real contra la superficie que el componente pinta, no contra
   blanco y no leyendo el JSX. Es la regla que ya existe en este repo porque una vez se publicó un
   botón a 1,19:1 con `text-white` escrito en el código.
3. **Humano**: las seis preguntas del checklist de gobierno, página por página. Ningún script
   contesta «¿el tono es cercano?».

## 9. Lo que produce cada fase

| Artefacto | Dónde | Cuándo |
|---|---|---|
| Spec de la fase | `docs/brand/specs/fase-N-<slug>.md` — escritos: [`fase-1`](specs/fase-1-paleta-y-superficies.md) · [`fase-2`](specs/fase-2-la-firma.md) · [`fase-3`](specs/fase-3-identidad-verbal.md) · [`fase-4`](specs/fase-4-sistema-grafico.md) · [`fase-5`](specs/fase-5-fotografia.md) · [`fase-6`](specs/fase-6-tipografia.md) · [`fase-7`](specs/fase-7-gobierno.md) | antes de tocar código |
| Plan de ejecución | según el spec, con sus pasos verificables | después del spec |
| PR de migración | rama `arq/<slug>`, desde `main`, sin cambio de comportamiento (§0.bis) | antes del PR de marca, cuando la fase toca código reorganizado por `arquitectura-modular.md` |
| Rama de marca | `fase-1/marca-N-<slug>`, desde `main`, sobre la ubicación ya migrada | una por fase |
| PR de marca | a `main`, con `CURRENT.md` actualizado en el mismo PR | al cerrar la fase |
| Evidencia | la medición de contraste o la captura que demuestre el criterio de terminado, más el recorrido de "sin diferencia visual" del PR de migración | dentro de cada PR |

Ninguna fase se da por cerrada con «se ve bien». Se cierra con su criterio de terminado, y el
criterio está escrito arriba antes de empezar, no después.
