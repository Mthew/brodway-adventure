# 007 · La marca tenía dos manuales, y el sitio implementó el equivocado

**Archivado:** 2026-09-10. Se archiva desde `CURRENT.md` la decisión abierta de `--text-hero` (ya
resuelta), la de tooling de skills (ya cerrada) y el bloqueo de «hex oficiales» (ya resuelto),
más el contexto de por qué apareció una deuda de identidad que antes no existía.

Fuente de verdad resultante: [`docs/brand/sistema-de-identidad.md`](../docs/brand/sistema-de-identidad.md).

## Qué pasó

El cliente entregó el **manual vivo** de identidad visual (una web: *Brand system 01.1*, 2026) y
resultó que **no es la misma versión del sistema que el PDF** que ya estaba en el repo
(*Manual de marca v2.0*). El PDF sigue siendo la única fuente de estrategia, voz, tono, léxico,
gobierno, escala tipográfica y contraste; el manual vivo **reemplazó el logo y la tipografía**.

- **El logo cambió por completo.** El del PDF era una firma cursiva con avioncito y una carretera
  en «S», más un sello «B». El real es un wordmark geométrico: «Bro» azul + «Way» naranja, bajada
  `ADVENTURES` y símbolo de **paloma** con estela naranja. El sitio publicaba —y al archivar esto
  seguía publicando— la firma cursiva en `navbar.tsx` y en `lp/[campana]/layout.tsx`.
- **Los hex nunca fueron los de la marca.** `brief-v0.md` §2 dijo que los colores se «extrajeron
  del logo oficial» cuando el PDF §15 ya los traía con HEX, RGB y CMYK. Se muestreó una captura en
  vez de leer la paleta, y el valor derivado se propagó a `app/globals.css`, `spec-tecnica.md` §4,
  `/design-system`, los dos briefs y `app/admin/layout.tsx`:

  | Repo | Marca | Desvío |
  |---|---|---|
  | `#003062` | `#0D3B66` | azul más oscuro y menos azul |
  | `#00aac3` | `#16B4C6` | turquesa |
  | `#ff6a03` | `#FF8A00` | **32 puntos en el canal verde** — el naranja se veía rojizo |

  Comprobado por muestreo del logo real: el naranja del wordmark mide `#FE8201`. La paleta
  declarada es la del logo; la del repo, no.
- **`CLAUDE.md` y `docs/README.md` afirmaban que el PDF «no define hex de color, tipografías ni
  fotografía».** Es falso: §15 (paleta con CMYK), §17 (tabla de contraste), §18-19 (tres familias,
  escala y 10 restricciones) y §20 (fotografía). Corregido en los dos archivos.

## Decisiones que dejaron de estar abiertas

- **`--text-hero` hasta 72 px vs. el H1 48/56 del manual: resuelto, se queda.** El manual vivo usa
  para su propio titular `clamp(4.7rem, 10vw, 9.8rem)` —hasta ~157 px— y H2 de hasta ~102 px. El
  sistema vigente sí contempla un nivel de portada por encima de H1, y 72 px queda muy por debajo
  del techo que la marca se permite a sí misma. Ya no hace falta confirmarlo con nadie.
- **Tooling de skills** (`.agents/`, `.claude/`, `.codex/`, `.impeccable/`, `.playwright-mcp/`,
  `skills-lock.json`): decidido y cerrado — gitignorados.

## Lo que sí quedó abierto (sigue en `CURRENT.md`)

- **Familia tipográfica.** Manrope (manual vivo, una familia 400-800) vs. Montserrat + Lato +
  Caveat (PDF, tres familias con funciones separadas). No lo decide desarrollo: el PDF §24
  clasifica «nuevas tipografías» como cambio que requiere aprobación de dirección de marca.
  Recomendación y coste de cada opción en `sistema-de-identidad.md` §8.1. Pregunta que va junto:
  ¿«Next Stop» sigue firmándose en cursiva? Si no, Caveat sale del sistema.
- **Archivos maestros.** No hay SVG de nada. El logo horizontal solo existe como PNG/JPEG de ~1 MB,
  la versión vertical y las monocromáticas no se entregaron, y en el manual vivo el enlace del
  símbolo aislado (`assets/logo-simbolo.png`) **devuelve 404**: el símbolo se sirve como un
  `favicon.png` de 1254×1254 y 1 MB.
- **La fuente de verdad visual vive en un dominio `*.chatgpt.site`** que puede desaparecer. El
  código y los SVG están archivados en `docs/brand/manual-vivo/`; los PNG (7 MB entre los cuatro)
  no, porque lo que se necesita es el SVG.

## Lo que estaba bien y conviene no romper

La identidad **verbal** del repo cumple el manual sin excepciones: cero apariciones del léxico
prohibido, cero grafías incorrectas del nombre, «Next Stop» exactamente una vez en la home y sin
traducir en ninguno de los dos idiomas, y CTA tomado de los cinco aprobados. La **escala
tipográfica** de `app/globals.css` también: implementa H1-H4, cuerpo, botón y texto pequeño del
manual, con el mínimo de 14 px y el interlineado 1,45 respetados.
