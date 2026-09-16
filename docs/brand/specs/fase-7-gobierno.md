# Spec — Fase 7 · Gobierno: que no se vuelva a desviar

> **Intent:** [`../intent.md`](../intent.md) §Fase 7 · **Fuente de marca:**
> [`../sistema-de-identidad.md`](../sistema-de-identidad.md) §7
> **Depende de:** nada para arrancar; **cierra** sobre lo que entregan las fases 1 a 6
> **Arquitectura:** [`../intent.md`](../intent.md) §0.bis — esta fase no migra código propio, pero
> **escribe `check:marca` para que funcione con la migración en cualquier estado de avance** (§3.bis)
> **Rama:** `fase-1/marca-7-gobierno` · **PR:** a `main`, con `CURRENT.md` en el mismo PR
> **Escrito:** 2026-09-11 · **Estado:** listo para plan

## 0. Objetivo

Que la próxima desviación **falle en el `build`** en vez de descubrirse un año después leyendo un
manual.

## 1. Por qué existe esta fase: tres pruebas del propio repo

No es una precaución teórica. Las tres veces que la marca se desvió, había un documento que lo
prohibía y nadie tenía forma de contradecirlo a tiempo:

1. **El color.** `brief-v0.md` §2 afirmó que los hex se habían «extraído del logo oficial» cuando el
   manual ya los traía con HEX, RGB y CMYK. El valor derivado se propagó a cinco documentos y cuatro
   archivos de código, y sobrevivió meses.
2. **Los CTAs.** El Pre-Flight §11.B tiene, desde hace tiempo, esta casilla literal:
   «*Ningún CTA repite intención con otro texto: "Cotiza por WhatsApp" y "Habla con un asesor" no
   conviven como el mismo botón*». Hoy conviven: 5 usos y 6 usos. **La casilla existía y se
   incumplió igual.**
3. **Los ratios.** `app/globals.css` documenta «5.98 / 5.56 / 5.32» para un token que mide
   4,91 / 4,57 / 4,50. El comentario decía lo correcto; el número, no.

De ahí las dos reglas de esta fase: **lo que se puede contar, se cuenta en el `build`**; y **lo que
no, se mira con una lista escrita antes de mirar**, no con buena voluntad.

## 2. Estado de los guardianes

| Guardián | Qué cubre | Cuándo corre |
|---|---|---|
| `check:tokens` | La escala tipográfica del `@theme` y `FONT_SIZE_TOKENS` no se separan | `pnpm build` |
| `check:current` | `CURRENT.md` no rebasa 50 líneas | `pnpm build` |
| `check:marca` (Fase 1) | Hex de marca: los antiguos no reaparecen, los oficiales no salen del `@theme` | `pnpm build` |
| `check:marca` (Fase 3) | Léxico prohibido, grafías del nombre, «Next Stop» repetido | `pnpm build` |
| Pre-Flight §11 | Versiones, anti-slop, contraste y contrato de negocio, legal y marca | Revisión humana |

**No hay CI ni hooks de git.** No hacen falta: `pnpm build` invoca `pnpm check`, y Vercel ejecuta el
build en cada *preview*, así que el guardián ya corre en cada PR. Esta fase **no añade
infraestructura**; añade reglas al guardián que ya existe.

## 3. El `check:marca` completo

Las cinco reglas que llegan de las fases 1 y 3, más cinco nuevas. Todas son contables —`grep` sobre
el código, no análisis semántico— y todas nacen de un defecto real que este proyecto tuvo.

| # | Regla | Origen |
|---|---|---|
| **R-1** | Los tres hex antiguos no aparecen. Lista blanca: `history/` y `docs/brand/**`, que los citan como defecto corregido | Fase 1 |
| **R-2** | Ningún hex de los cinco colores de marca fuera de `app/globals.css`. Excepción declarada en el script: `design-system/page.tsx`, cuya razón de existir es publicar la paleta | Fase 1 |
| **R-3** | Ninguna de las ocho promesas prohibidas en `messages/`, `app/` y `components/` | Fase 3 |
| **R-4** | Ninguna grafía incorrecta del nombre | Fase 3 |
| **R-5** | «Next Stop» no aparece dos veces en la misma página | Fase 3 |
| **R-6** | **`text-white` no convive con `bg-brand-orange` ni con `bg-brand-turquoise`** en la misma lista de clases | Los cuatro botones del panel a 2,36:1 (Fase 1 §6.1) |
| **R-7** | Ninguna referencia a `logo-broway.png` ni a ningún archivo de la firma anterior | Fase 2 |
| **R-8** | Ningún `rounded-` fuera de `sm`, `md`, `lg` y `full` | Fase 4: el `rounded-xl` suelto |
| **R-9** | Ningún icono fuera de `@phosphor-icons/react`, y ningún `weight` distinto de `regular` | Pre-Flight §11.B, hoy sin mecanizar |
| **R-10** | Ninguna familia tipográfica cargada que no sea la declarada por la marca | Fase 6 |

**Forma del script.** Un solo `scripts/check-marca.mjs`, en el estilo de los dos que ya existen: una
cabecera que explica **por qué existe cada regla y qué fallo real evita** —no qué hace—, un fallo
por regla con el archivo y la línea, y salida con código 1. Las listas blancas van **escritas en el
script**, no descubiertas por quien lo ejecuta.

## 3.bis Patrones de búsqueda: `app/`/`components/`/`lib/` y `src/**` a la vez

Esta fase es la última en ejecutarse, pero `scripts/check-marca.mjs` **no puede asumir que la
migración de arquitectura (`../intent.md` §0.bis) ya terminó** para todos los módulos cuando se
escribe: dos fases pueden ir en paralelo (`intent.md` §6) y sus PRs de migración pueden mergear en
cualquier orden. La solución es la misma que ya usan las reglas de `dependency-cruiser` y ESLint de
`ADR-0002` para lo mismo: **los patrones de cada regla cubren las dos ubicaciones posibles a la
vez** (`app/**`, `components/**`, `lib/**` y `src/**`), en vez de asumir una. Un archivo que ya
migró no aparece en la ruta antigua y uno que no ha migrado no aparece en `src/`, así que no hay
falso positivo por buscar en las dos: la regla encuentra el archivo esté donde esté. Si algún día
`app/`, `components/` y `lib/` dejan de existir (paso atómico final), esos patrones simplemente
dejan de matchear nada — no hace falta volver a este script para retirarlos.

## 4. Lo que no se mecaniza, y qué lo cubre

Decirlo es parte del gobierno: un guardián que promete más de lo que puede se convierte en un sello
de calidad falso.

| No se puede contar | Lo cubre |
|---|---|
| Si el tono es cercano o suena a folleto | Lectura en voz alta (Fase 3) |
| Si una composición tiene un foco | La tabla foco/ruta/acción por sección (Fase 4) |
| Si una foto muestra «cómo se siente viajar» | La auditoría imagen por imagen (Fase 5) |
| Si el contraste real cumple sobre la superficie que se pinta | Medición en navegador (Fase 1) |
| Si la zona de seguridad del logo se respeta | Medición en DevTools (Fase 2) |
| Si un `alt` describe la foto que hay | Revisión foto contra `alt` (Fase 5) |

## 5. El Pre-Flight de marca

El Pre-Flight §11 ya tiene cuatro casillas de marca en su sección D —nombre, «Next Stop», léxico,
sin countdown—. Esta fase añade el **bloque E**, con lo que las seis fases dejaron establecido y
ninguna casilla actual cubre:

- **Color:** los cinco hex salen del `@theme`; ninguna combinación en uso baja de 4,5:1 medido
  contra su superficie real; el naranja no rellena superficie amplia.
- **Firma:** es la firma real; ≥180 px de ancho; ≥1X hasta cualquier otro elemento; para icono se
  usa el símbolo, nunca la firma reducida; nada añadido al logo.
- **Social:** la página comparte tarjeta con imagen, título y descripción; probado pegando la URL en
  WhatsApp.
- **Gráfico:** una sola ruta dominante; los nodos significan origen, decisión o destino; ≤5 iconos;
  un concepto, un icono.
- **Fotografía:** los seis criterios; el hero lleva personas; el espacio negativo está donde va el
  texto; el `alt` describe la foto publicada.
- **Voz:** el CTA sale de los cinco aprobados o de la variante de canal; el bloque recorre los cuatro
  pasos del mensaje.

Y una casilla que es de proceso, no de diseño: **¿esta pieza cambia logo, color, tipografía, tono,
posicionamiento, eslogan o submarca?** Si la respuesta es sí, requiere aprobación (§6) y no entra
sin ella.

## 6. El registro de aprobaciones

El manual v2.0 §24 define quién puede modificar la identidad y qué requiere aprobación, pero el
proyecto no tiene dónde anotar que una aprobación ocurrió. Sin ese registro, cada decisión se
vuelve a discutir y las interpretaciones declaradas en los specs quedan flotando.

**El registro ya existe**: [`../aprobaciones.md`](../aprobaciones.md), creado el 2026-09-11 con las
**siete decisiones cerradas y ratificadas** —D-A familia tipográfica · D-B «Next Stop» en cursiva ·
D-C archivos maestros · D-D fotografía propia · D-E el verde de WhatsApp como color de canal · D-F
zona de seguridad en la navegación · D-G el superlativo «Mejores»— y cuatro **interpretaciones
declaradas**: la proporción de fotos con personas, la variante británica del inglés, el alcance de
los cinco CTAs aprobados y el marco asimétrico que no se adopta.

Lo que esta fase añade no es el archivo, es **que se mantenga vivo**: cada PR que aplica una
decisión actualiza su fila, y una decisión se reabre con una fila nueva, nunca editando la
anterior.

Una interpretación declarada y anotada es una decisión reversible con nombre. Una interpretación
silenciosa es cómo se desvió el color.

## 7. Criterios de aceptación

| # | Criterio | Cómo se verifica |
|---|---|---|
| **H-1** | `pnpm build` falla ante un hex de marca fuera de sitio, una grafía incorrecta del nombre o una promesa prohibida | Se introduce cada defecto a propósito y se comprueba que falla |
| **H-2** | Las diez reglas de §3 están implementadas, cada una con su mensaje de error apuntando al archivo y la línea | Lectura del script y prueba de cada regla |
| **H-3** | Las listas blancas están escritas en el script, con su motivo | Lectura del script |
| **H-4** | El script no da falsos positivos sobre el repo tal como está al terminar las fases 1-6 | `pnpm check:marca` en verde |
| **H-5** | El bloque E del Pre-Flight está en `brief-v0.md` §11 | Abrir el documento |
| **H-6** | Cada decisión de `aprobaciones.md` tiene su columna «Aplicada en» rellena por el PR que la ejecutó | Contraste del registro con los PRs de las fases 1-6 |
| **H-7** | `sistema-de-identidad.md` §7 enlaza el registro y el `check:marca` | Abrir el documento |
| **H-8** | Ningún guardián nuevo fuera del `build`: sin CI adicional, sin hooks impuestos | `package.json` y ausencia de `.github/workflows` |

## 8. Verificación

1. **Se rompe a propósito.** Un guardián que nunca ha fallado no está verificado: por cada regla se
   introduce el defecto que debe detectar, se comprueba que el `build` falla con un mensaje útil, y
   se revierte. Es la única prueba que vale.
2. **Se corre sobre el repo limpio** para descartar falsos positivos.
3. **Se lee el mensaje de error como lo leería alguien que no escribió la regla**: si no dice qué
   hacer, no está terminado.

## 9. Riesgos

| Riesgo | Señal | Respuesta |
|---|---|---|
| El guardián da falsos positivos y alguien lo desactiva | `// eslint-disable` mental: se saca del `check` | H-4. Una regla que molesta sin motivo se corrige o se retira; no se deja rota |
| Se mecaniza lo que no se puede mecanizar | Reglas frágiles que fallan por una coma | §4: lo que no se cuenta, se revisa. No se fuerza |
| El Pre-Flight crece hasta que nadie lo lee | Bloque E de 40 casillas | El bloque E son seis grupos con lo que ninguna casilla actual cubre. Si una casilla se mecaniza, **sale** del Pre-Flight |
| El registro de aprobaciones se queda vacío | Decisiones tomadas y no anotadas | Cada spec que aplique una decisión actualiza su fila; el PR que la aplica también toca el registro |
| Esta fase se hace antes que las otras y bloquea el trabajo | El `build` falla por defectos que las fases 1-6 aún no han corregido | Las reglas entran **cuando su fase las deja en verde**: R-1 y R-2 con la Fase 1, R-3 a R-5 con la 3, R-6 a R-10 aquí |

## 10. Entregables del PR

1. `scripts/check-marca.mjs` completo, con las diez reglas y sus listas blancas justificadas.
2. La prueba de que cada regla falla cuando debe: la tabla de los diez defectos introducidos y
   revertidos, en el cuerpo del PR.
3. El bloque E del Pre-Flight en `brief-v0.md` §11.
4. `docs/brand/aprobaciones.md` con las siete decisiones y las dos interpretaciones declaradas.
5. `sistema-de-identidad.md` §7 enlazando registro y guardián.
6. `CURRENT.md` actualizado en el mismo PR.
