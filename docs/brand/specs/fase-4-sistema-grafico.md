# Spec — Fase 4 · Sistema gráfico: ruta, iconos y composición

> **Intent:** [`../intent.md`](../intent.md) §Fase 4 · **Fuente de marca:**
> [`../sistema-de-identidad.md`](../sistema-de-identidad.md) §4.8 (iconografía), §4.10 (ruta y
> recursos) y §4.11 (composición)
> **Depende de:** Fase 1 (la ruta y los iconos se pintan con la paleta oficial) y Fase 2 (conviven
> con la firma)
> **Arquitectura:** [`../intent.md`](../intent.md) §0.bis · mapeo de esta fase en §1.bis
> **PR de migración (primero):** rama `arq/sistema-grafico`, desde `main`, sin cambio de
> comportamiento
> **PR de marca (segundo):** rama `fase-1/marca-4-sistema-grafico` · a `main`, con `CURRENT.md` en
> el mismo PR
> **Escrito:** 2026-09-11 · **Estado:** listo para plan

## 0. Objetivo

Que la identidad se reconozca en la **estructura** de las páginas y no solo en el color: una ruta
que conecta, nodos que significan algo, iconos con una sola lógica y composiciones con un foco.

El punto de partida es mejor de lo esperado: **la ruta ya existe** en el sitio, bien resuelta, en
una sola sección. El trabajo no es inventar un sistema gráfico, es **reconocer el que ya hay,
nombrarlo y dejar de contradecirlo en las otras doce secciones**.

## 1. Punto de partida, verificado

Auditado el 2026-09-11.

### 1.1 La ruta ya existe y nadie la ha llamado así

La sección «Cómo funciona» de la home dibuja **una trayectoria vertical con nodos**: un espinazo
(`.line-draw-y`, `w-px`, blanco al 20 %) que se dibuja con el scroll, y tres nodos circulares navy
con anillo turquesa, cada uno con su icono y su paso
(`app/[locale]/(sitio)/page.tsx:265-300`). Es, literalmente, lo que el manual describe: una ruta
cuyos nodos marcan el recorrido.

### 1.2 Pero hay cinco vocabularios de línea conviviendo

| Tratamiento | Usos | Dónde |
|---|---|---|
| `.line-draw` (horizontal, animada) | 9 | Separadores de sección |
| `border-l-2 border-brand-turquoise/40` | 8 | Listas destacadas en 5 páginas |
| `.line-draw-y` (espinazo vertical) | 4 | «Cómo funciona» |
| `border-t-2` | 1 | Nosotros |
| `border-l-4` | 1 | Suelto |

Cinco maneras de decir lo mismo. El manual pide exactamente lo contrario: «repetir estructura antes
de añadir decoración».

### 1.3 Los iconos cumplen la regla dura, pero el repertorio tiene sinónimos

- **`weight="regular"` en los 9 archivos**, sin una sola excepción ✅
- **Ninguna sección supera 4-5 iconos** ✅ — la home importa 11, pero repartidos: «Cómo funciona» 3,
  «Por qué BroWay» 4, franja de confianza 2, confianza 1
- **18 iconos distintos**, y entre ellos **cuatro maneras de decir «verificado»** (`Check`,
  `CheckCircle`, `SealCheck`, `ShieldCheck`) y **tres de decir «conversación»** (`ChatText`,
  `ChatCircleText`, `ChatCircleDots`) ❌
- `Compass` se importa en la home y **no se usa** ❌

### 1.4 Radios y marcos

`rounded-lg` 46 usos · `rounded-md` 16 · `rounded-full` 8 · `rounded-sm` 3 · **`rounded-xl` 1**, que
está fuera de los tres valores que el sistema declara. Las fotos se enmarcan con radio uniforme y
`overflow-hidden`; no hay marcos decorativos.

## 1.bis Migración de arquitectura

Para cuando esta fase corre (depende de Fase 1 y 2), la mayor parte de los 9 archivos con iconos ya
migró: `shared/ui`, `shared/layout` y lo que la Fase 1 movió. Lo que queda, por `arquitectura-modular.md`
§2, son los dos pares que ninguna fase anterior tenía motivo para tocar:

| Archivo hoy | Destino |
|---|---|
| `components/destinos/listado-categoria.tsx` · `components/ui/filtro-categoria.tsx` | `src/modules/destinations/presentation/components/{category-list,category-filter}.tsx` |
| `components/oferta/galeria.tsx` · `components/oferta/tarifa-vencida.tsx` · `components/ui/price-disclosure.tsx` | `src/modules/offers/presentation/components/` (`price-disclosure.tsx` se muda aquí por tener regla de negocio propia, `arquitectura-modular.md` §4) |

La ruta de marca (`.line-draw`, `.line-draw-y`) vive en `app/globals.css` y en
`app/[locale]/(sitio)/page.tsx` — ambos archivos de convención de Next.js, se quedan donde están
(`intent.md` §0.bis). Si al auditar aparece un tercer archivo de `components/` sin migrar, se mueve
con el mismo criterio antes de tocar su contenido.

## 2. Alcance

| Superficie | Qué entra |
|---|---|
| **Sistema de diseño** | La ruta como utilidad declarada en `app/globals.css` y documentada en `/design-system`; los tres radios; el repertorio de iconos |
| **Sitio** | Las 13 secciones de la home y las 17 rutas restantes: unificación del vocabulario de línea, racionalización de iconos y revisión de foco por composición |
| **Backoffice** | Solo el repertorio de iconos (usa `List`). El panel no lleva ruta: es una herramienta, no una pieza de comunicación |

**Fuera de alcance:** cambiar la familia de iconos —`@phosphor-icons/react` con `weight="regular"`
cumple las reglas del manual y sustituirla es coste sin beneficio mientras no exista un set oficial
en vector— · los SVG de recursos del manual vivo, que no usan la paleta y sirven como referencia de
repertorio, no como assets · la fotografía (Fase 5) · el motion, que ya está resuelto y medido.

## 3. La ruta de marca

### 3.1 Qué es

> **La paloma encuentra el camino. La ruta lo hace visible.** La ruta es el elemento reconocible
> que conecta piezas, secciones y formatos. Puede ser divisor, marco, transición o guía de lectura.
> **Nunca es un adorno.**

En este sitio la ruta es la que ya existe: **trazo fino + nodos**. Se formaliza a partir de
`.line-draw` y `.line-draw-y`, no se diseña otra.

### 3.2 Reglas

**G-1 · Una sola ruta dominante por composición.** Si una sección tiene espinazo con nodos, no
lleva además bordes laterales decorativos.

**G-2 · Los nodos marcan origen, decisión o destino.** Un nodo por paso real del recorrido. No se
ponen nodos para dar ritmo visual: si no significa nada, es adorno y se quita.

**G-3 · Color de la ruta, por contraste y por significado.** La estela del logo es naranja y esa es
la lógica de la marca, pero el naranja no llega a 3:1 sobre fondo claro (2,36):

| Dónde | Ruta decorativa (acompaña a algo que ya se lee) | Ruta informativa (único portador del significado) |
|---|---|---|
| Sobre blanco, gris o arena | naranja | **navy** (11,45) o `turquoise-text` (6,18) |
| Sobre navy | naranja (4,84) o turquesa (4,57) | las mismas |

**G-4 · El naranja nunca rellena superficie.** Es trazo, nodo o punto de atención (P-6).

**G-5 · Un solo vocabulario de línea.** Los cinco tratamientos de §1.2 se reducen a dos: **ruta**
(trazo fino con o sin nodos, la del sistema) y **borde de lista** (el `border-l` de las listas
destacadas), que se declara como variante única y no cinco.

## 4. Iconografía

### 4.1 Reglas del manual, ya cumplidas

Estilo lineal, geométrico, esquinas suaves y grosor consistente (`weight="regular"`); máximo 4-5
por composición; sin mezclar lineal con sólido o 3D. **Se verifican, no se cambian.**

### 4.2 Un concepto, un icono

El repertorio se racionaliza: cada concepto tiene **un** icono en todo el proyecto, y la tabla vive
en `/design-system` para que la siguiente página no invente el suyo.

| Concepto | Hoy | Objetivo |
|---|---|---|
| Verificado / respaldo | `Check`, `CheckCircle`, `SealCheck`, `ShieldCheck` | **Uno** para «incluido en el plan» y **uno** para «respaldo institucional». Dos como máximo, con criterio escrito |
| Conversación | `ChatText`, `ChatCircleText`, `ChatCircleDots` | **Uno** |
| Lo que no incluye | `X` | Se mantiene: es el par de «incluido» |
| Resto (`MapPin`, `Clock`, `CalendarBlank`, `Tag`, `UsersThree`, `ListChecks`, `HourglassSimple`, `Phone`, `List`) | uno por concepto | Sin cambio |
| `Compass` | importado sin usar | Se retira |

### 4.3 Color del icono

Azul como base; turquesa y naranja **solo como acento**. Los diez iconos turquesa sobre superficie
clara que la Fase 1 verificó —todos con `aria-hidden` y acompañando texto equivalente— **se
quedan**: son decorativos y el manual admite el turquesa como elemento gráfico sin texto. Un icono
que sea el único portador de información va en navy.

## 5. Composición

> Cada pieza tiene **un foco, una ruta visual y una acción**.

**G-6 · Un foco por sección.** Una idea principal, un titular que la enuncia, y como mucho una
acción. Dos CTAs compitiendo en la misma sección es dos focos.

**G-7 · Aire antes que decoración.** Si una sección necesita un elemento gráfico para no verse
vacía, el problema es el espaciado, no la falta de gráfico.

**G-8 · Marcos abiertos.** El encuadre acompaña la imagen, no la encierra: sin bordes gruesos ni
contornos sobre las fotos. **El marco asimétrico del manual vivo no se adopta**: es un recurso de
esa pieza de comunicación, y trasladarlo a las tarjetas del sitio sería un rediseño, no una
aplicación del manual.

**G-9 · Los tres radios del sistema** (`sm`, `md`, `lg`) y `full` para elementos circulares. El
`rounded-xl` suelto se normaliza.

## 6. Criterios de aceptación

| # | Criterio | Cómo se verifica |
|---|---|---|
| **G-A** | La ruta está declarada como utilidad del sistema y documentada en `/design-system`, con sus dos colores según superficie | Abrir la guía |
| **G-B** | Ninguna composición tiene dos rutas compitiendo | Recorrido de las 18 rutas |
| **G-C** | El vocabulario de línea se reduce a dos tratamientos | `grep` de `border-l-*`, `border-t-*`, `line-draw*` |
| **G-D** | Cada concepto tiene un icono y la tabla está en `/design-system`; `Compass` retirado | `grep` de imports de Phosphor |
| **G-E** | Ninguna sección supera 5 iconos y todos llevan `weight="regular"` | Conteo por sección |
| **G-F** | Ningún icono ni trazo informativo queda por debajo de 3:1 | Medición en navegador |
| **G-G** | Solo se usan los tres radios del sistema más `rounded-full` | `grep` de `rounded-` |
| **G-H** | Cada sección tiene un foco y como mucho una acción | Recorrido escrito, sección por sección, en el PR |
| **G-I** | El Pre-Flight §11.B sigue pasando: ninguna familia de layout se repite y no hay tres secciones seguidas con el mismo patrón | Checklist del Pre-Flight |
| **G-J** | `pnpm build` pasa, `check:marca` incluido | CI local |

## 7. Verificación

1. **Mecánica.** Los `grep` de G-C, G-D y G-G, que son contables y no admiten interpretación.
2. **Medida.** El contraste de los trazos y de los iconos que llevan información, contra la
   superficie real.
3. **Vista, sección por sección.** Es la verificación principal de esta fase: el recorrido de las
   18 rutas anotando foco, ruta y acción de cada composición. La tabla va en el PR.

## 8. Riesgos

| Riesgo | Señal | Respuesta |
|---|---|---|
| La fase se convierte en rediseño | Aparecen secciones nuevas o cambia el orden de la home | El alcance es vocabulario gráfico, no arquitectura. Las 13 secciones y su orden no se tocan (`CURRENT.md`) |
| «Una ruta por composición» se aplica quitando todas las líneas | Páginas planas y sin guía de lectura | La regla es **una dominante**, no ninguna: la sección que pierda su borde de lista gana la ruta del sistema |
| Unificar iconos rompe el significado | Un icono genérico donde había uno preciso | Un concepto puede conservar dos iconos si la distinción es real (incluido vs. respaldo institucional); lo que no se admite son sinónimos |
| El naranja se cuela como relleno al «aplicar la ruta» | Superficies naranjas nuevas | G-4 y P-6: trazo y nodo, nunca superficie |
| El motion se toca al mover las líneas | `animation-timeline` deja de componer | `.line-draw` y `.line-draw-y` ya están medidos: se conserva su comportamiento y su `@supports` |

## 9. Entregables del PR

0. El PR de migración de §1.bis (`arq/sistema-grafico`) ya mergeado.
1. La ruta declarada como utilidad en `app/globals.css`, con sus dos variantes de color.
2. El vocabulario de línea reducido a dos tratamientos en las 18 rutas.
3. El repertorio de iconos racionalizado, `Compass` retirado y la tabla concepto→icono publicada en
   `/design-system`.
4. Los radios normalizados a los tres del sistema.
5. **La tabla de composición** —foco, ruta y acción por sección— en el cuerpo del PR. Sin ella no se
   cumple G-H.
6. `CURRENT.md` actualizado en el mismo PR.
