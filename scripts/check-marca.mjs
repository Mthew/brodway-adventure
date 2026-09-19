/**
 * Verifica que los cinco hex del manual de marca sean los únicos valores de
 * color de marca del repo (docs/brand/specs/fase-1-paleta-y-superficies.md §9),
 * y que el copy respete el nombre, el léxico y la firma «Next Stop» que fija
 * docs/brand/specs/fase-3-identidad-verbal.md §4 y §6.
 *
 * POR QUÉ EXISTE:
 * Nada frenaba a alguien de escribir un hex "parecido" directamente en un
 * componente, ni de escribir "Bro Way" o una de las ocho promesas prohibidas
 * del manual en una cadena nueva. Este script cubre, del check:marca completo
 * de la Fase 7 (fase-7-gobierno.md §3), las cinco reglas contables de las
 * Fases 1 y 3 — R-1/R-2 (hex, N-01.2) y R-3/R-4/R-5 (texto, N-03.5).
 *
 * CINCO REGLAS (R-6 a R-10 — gráfico, tipografía, contraste — quedan para la
 * Fase 7):
 *
 *   1. Los tres hex antiguos no aparecen en ningún sitio fuera de la lista
 *      blanca (`history/`, que archiva el defecto ya corregido, y
 *      `docs/brand/**`, que los cita explícitamente como tal).
 *
 *   2. Ningún hex de los cinco colores oficiales aparece fuera de
 *      `app/globals.css` — que es donde se declaran los tokens — salvo la
 *      única excepción declarada aquí mismo: la guía viva `/design-system`,
 *      cuya razón de existir es publicar la paleta.
 *
 *   3. Ninguna de las ocho promesas prohibidas (sistema-de-identidad.md §3.5,
 *      fila P-10) aparece en `messages/`, `app/`, `components/`, `lib/` o
 *      `src/**` — las superficies donde el copy llega al usuario.
 *
 *   4. Ninguna grafía incorrecta del nombre ("Bro Way", "Broway", "Bro-Way",
 *      "BRO WAY"…) aparece en esas mismas superficies. El nombre correcto es
 *      "BroWay Adventures" — B y W mayúsculas, una sola palabra (CLAUDE.md,
 *      sección "Naming note").
 *
 *   5. «Next Stop» no se repite dentro del mismo archivo — la firma se usa
 *      una sola vez por pieza (sistema-de-identidad.md §3, V-6).
 *
 * La segunda regla es la que impide que la desviación de color se repita:
 * comparar solo contra los tres hex viejos no detecta que alguien escriba un
 * cuarto hex "parecido" directo en un componente en lugar de usar el token.
 *
 * LÍMITE DECLARADO DE R-3 (no se inventa lo que el manual no hace contable):
 * de las ocho promesas prohibidas, siete son frases literales y se buscan tal
 * cual. La octava — "exceso de diminutivos o jerga" — no es una cadena de
 * texto, es un juicio de estilo; fase-7-gobierno.md §4 ya reserva esa clase de
 * criterio para la lectura en voz alta, no para un guardián mecánico. Forzar
 * aquí una lista de sufijos "-ito/-ita" sería inventar una regla que el manual
 * no define y produciría falsos positivos sin fin. Queda fuera de R-3 a
 * propósito.
 *
 * MODO DE PRUEBA (N-01.2, extendido en N-03.5):
 * `CHECK_MARCA_ROOT=<ruta>` reemplaza la raíz del repo por un fixture aislado
 * (ver `scripts/__fixtures__/check-marca/`), para poder probar por mutación
 * sin ensuciar el repo real. En modo normal (sin la variable) la raíz es el
 * repo real.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, sep } from "node:path";

const defaultRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const root = process.env.CHECK_MARCA_ROOT
  ? join(process.cwd(), process.env.CHECK_MARCA_ROOT)
  : defaultRoot;

// Hex antiguos (la desviación que este nodo corrige). Case-insensitive.
const HEX_ANTIGUOS = ["003062", "00aac3", "ff6a03"];

// Los cinco hex oficiales del manual (§15).
const HEX_OFICIALES = ["0d3b66", "16b4c6", "ff8a00", "f6e7c3", "f2f4f7"];

// Regla 3: siete de las ocho promesas prohibidas (sistema-de-identidad.md
// §3.5, fila P-10) que SÍ son una cadena literal buscable. Comparación
// case-insensitive, igual que los hex. La octava ("exceso de diminutivos o
// jerga") queda fuera — ver el límite declarado en la cabecera del archivo.
const LEXICO_PROHIBIDO = [
  "la mejor oferta",
  "precio garantizado",
  "viaja sin preocupaciones",
  "cumplimos tus sueños",
  "últimos cupos",
  "te resolvemos todo",
  "financiamos",
];

// Regla 4: cualquier variante de "bro"+"way" (con o sin espacio, con o sin
// guion, en cualquier combinación de mayúsculas) que NO sea exactamente
// "BroWay". Detecta "Bro Way", "Broway", "Bro-Way", "BRO WAY", etc. El límite
// derecho es \b a propósito: "browayadventures.com" (dominio técnico, ver
// lib/config.ts) no matchea porque "way" sigue pegado a "adventures" sin
// separador — un dominio no es una grafía del nombre, es un identificador.
const NOMBRE_INCORRECTO_REGEX = /\bbro[\s-]?way\b/gi;
const NOMBRE_CORRECTO = "BroWay";

// Regla 5: «Next Stop» —tal cual, con esa capitalización— no se repite
// dentro del mismo archivo. Case-SENSITIVE a propósito: messages/en.json
// usa "next stop" en minúscula como frase corriente del idioma ("Plan your
// next stop"), no como la firma de marca (D-B, siempre "Next Stop", nunca
// traducida ni en otra capitalización) — contarla sería un falso positivo.
const NEXT_STOP_REGEX = /Next Stop/g;

// Reglas 3/4/5 sólo se aplican donde el copy llega al usuario o se declara
// como contenido de marca: `messages/` (next-intl), `app/`, `components/`,
// `lib/` y, en paralelo, `src/**` — la migración de arquitectura puede estar a
// medias (fase-7-gobierno.md §3.bis), así que ambas ubicaciones se cubren a
// la vez en lugar de asumir una.
function enAlcanceTexto(rutaRelativa) {
  return (
    rutaRelativa.startsWith(`messages${sep}`) ||
    rutaRelativa.startsWith(`app${sep}`) ||
    rutaRelativa.startsWith(`components${sep}`) ||
    rutaRelativa.startsWith(`lib${sep}`) ||
    rutaRelativa.startsWith(`src${sep}`)
  );
}

// Directorios que no se recorren: dependencias, build, control de versiones,
// los fixtures sintéticos de este mismo script (N-01.2, contienen hex a
// propósito para probar las reglas) y `.claude/` — gitignorado, local a cada
// máquina, puede contener git worktrees enteros con copias de archivos de
// commits anteriores a este (ver `.gitignore`: "Skills y agentes de Claude
// Code: locales a cada máquina, no se versionan").
const DIRS_IGNORADOS = new Set([
  "node_modules",
  ".git",
  ".next",
  ".vercel",
  "coverage",
  "__fixtures__",
  ".turbo",
  ".claude",
]);

// Extensiones de archivo de texto donde un hex de marca tiene sentido.
const EXTENSIONES = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".css",
  ".md",
  ".mdx",
  ".json",
]);

// Regla 2 sólo aplica a código que PINTA: componentes y hojas de estilo. La
// documentación (`docs/`, `history/`) tiene licencia para citar los hex en
// prosa — de hecho tiene que hacerlo, es donde se publica la paleta oficial.
const EXTENSIONES_REGLA_2 = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".css",
]);

// Extensiones sobre las que corren las reglas 3/4/5: las mismas de siempre
// MENOS `.css`. Una hoja de estilos no lleva copy de marca — solo lleva
// nombres de `@keyframes`/clases como `broway-reveal` (ver app/globals.css),
// que son identificadores kebab-case, no una mención en prosa del nombre.
// Tratarlos como grafía incorrecta sería exactamente el mismo error que
// tratar un hex citado en un comentario como si pintara — la Regla 2 ya
// resuelve ese caso análogo quitando comentarios; este lo resuelve quitando
// la extensión que nunca contiene prosa.
const EXTENSIONES_TEXTO = new Set(
  [...EXTENSIONES].filter((extension) => extension !== ".css"),
);

function fueraDeCodigoFuente(rutaRelativa) {
  return (
    rutaRelativa.startsWith(`docs${sep}`) ||
    rutaRelativa.startsWith(`history${sep}`) ||
    rutaRelativa.startsWith(`.impeccable${sep}`)
  );
}

/**
 * Quita comentarios antes de aplicar la regla 2: un hex mencionado en la
 * prosa de un comentario (p.ej. el bloque THESIS/OWN-WORLD de admin-shell.tsx,
 * o el porqué de una opacidad) no es un token escrito a mano en una clase o un
 * estilo — es documentación embebida, la misma categoría que un archivo .md.
 * Preserva los saltos de línea para no desalinear los números de línea.
 */
function quitarComentarios(contenido) {
  const sinBloques = contenido.replace(/\/\*[\s\S]*?\*\//g, (m) =>
    m.replace(/[^\n]/g, " "),
  );
  return sinBloques.replace(/\/\/[^\n]*/g, (m) => " ".repeat(m.length));
}

// Este script contiene los hex arriba como literales de detección: se excluye
// de su propio escaneo o se detectaría a sí mismo como violación de la regla 2.
const RUTA_PROPIA = relative(root, fileURLToPath(import.meta.url));

// Lista blanca de la regla 1: historial archivado y documentos de marca que
// citan los hex antiguos como defecto ya corregido, no como valor oficial.
function enListaBlancaHexAntiguos(rutaRelativa) {
  return (
    rutaRelativa === "history" ||
    rutaRelativa.startsWith(`history${sep}`) ||
    rutaRelativa === "docs/brand" ||
    rutaRelativa.startsWith(`docs${sep}brand${sep}`)
  );
}

// Excepciones declaradas de la regla 2: la guía viva, que existe para
// publicar la paleta oficial, y `lib/theme-color.ts`, el único punto donde
// `viewport.themeColor` (que pinta la barra de direcciones vía
// `<meta name="theme-color">`, no CSS, y por eso no puede leer
// `var(--color-brand-navy)`) necesita el hex como string literal — ver el
// comentario de ese archivo.
const EXCEPCIONES_HEX_OFICIALES = new Set([
  join("app", "[locale]", "(sitio)", "design-system", "page.tsx"),
  join("lib", "theme-color.ts"),
]);

function listarArchivos(dir) {
  const resultado = [];
  for (const entrada of readdirSync(dir)) {
    if (DIRS_IGNORADOS.has(entrada)) continue;
    const rutaAbsoluta = join(dir, entrada);
    const info = statSync(rutaAbsoluta);
    if (info.isDirectory()) {
      resultado.push(...listarArchivos(rutaAbsoluta));
    } else if (EXTENSIONES.has(entrada.slice(entrada.lastIndexOf(".")))) {
      resultado.push(rutaAbsoluta);
    }
  }
  return resultado;
}

const archivos = listarArchivos(root);
const violaciones = [];

for (const rutaAbsoluta of archivos) {
  const rutaRelativa = relative(root, rutaAbsoluta);
  if (rutaRelativa === RUTA_PROPIA) continue;

  const extension = rutaRelativa.slice(rutaRelativa.lastIndexOf("."));
  const contenido = readFileSync(rutaAbsoluta, "utf8");

  // Regla 1: se evalúa sobre el archivo tal cual, comentarios incluidos — un
  // hex antiguo citado en un comentario sigue siendo un hex antiguo citado.
  if (!enListaBlancaHexAntiguos(rutaRelativa)) {
    contenido.split("\n").forEach((linea, indice) => {
      const lineaMin = linea.toLowerCase();
      for (const hex of HEX_ANTIGUOS) {
        if (lineaMin.includes(hex)) {
          violaciones.push({
            regla: 1,
            archivo: rutaRelativa,
            linea: indice + 1,
            detalle: `hex antiguo #${hex} — la paleta oficial ya no lo usa`,
          });
        }
      }
    });
  }

  // Regla 2: sólo código fuente que pinta (no docs/history/.impeccable), y
  // sólo fuera de comentarios — ver quitarComentarios().
  if (
    EXTENSIONES_REGLA_2.has(extension) &&
    !fueraDeCodigoFuente(rutaRelativa) &&
    rutaRelativa !== "app/globals.css" &&
    !EXCEPCIONES_HEX_OFICIALES.has(rutaRelativa)
  ) {
    quitarComentarios(contenido)
      .split("\n")
      .forEach((linea, indice) => {
        const lineaMin = linea.toLowerCase();
        for (const hex of HEX_OFICIALES) {
          if (lineaMin.includes(hex)) {
            violaciones.push({
              regla: 2,
              archivo: rutaRelativa,
              linea: indice + 1,
              detalle: `hex de marca #${hex} escrito fuera de app/globals.css — usa el token`,
            });
          }
        }
      });
  }

  // Reglas 3/4/5: sólo dentro de messages/app/components/lib/src, y sólo
  // fuera de comentarios para el código que los admite (mismo criterio que
  // la Regla 2: una mención en un comentario es documentación, no copy real
  // — es exactamente el caso de los comentarios de app/[locale]/layout.tsx y
  // .../page.tsx que citan "Next Stop" al explicar la firma). Los JSON de
  // `messages/` no tienen sintaxis de comentario, así que se leen tal cual.
  if (enAlcanceTexto(rutaRelativa) && EXTENSIONES_TEXTO.has(extension)) {
    const contenidoTexto = EXTENSIONES_REGLA_2.has(extension)
      ? quitarComentarios(contenido)
      : contenido;
    const lineas = contenidoTexto.split("\n");

    // Regla 3: léxico prohibido.
    lineas.forEach((linea, indice) => {
      const lineaMin = linea.toLowerCase();
      for (const frase of LEXICO_PROHIBIDO) {
        if (lineaMin.includes(frase)) {
          violaciones.push({
            regla: 3,
            archivo: rutaRelativa,
            linea: indice + 1,
            detalle: `promesa prohibida "${frase}" — sistema-de-identidad.md §3.5 (P-10)`,
          });
        }
      }
    });

    // Regla 4: grafía incorrecta del nombre.
    lineas.forEach((linea, indice) => {
      for (const coincidencia of linea.matchAll(NOMBRE_INCORRECTO_REGEX)) {
        if (coincidencia[0] !== NOMBRE_CORRECTO) {
          violaciones.push({
            regla: 4,
            archivo: rutaRelativa,
            linea: indice + 1,
            detalle: `grafía incorrecta del nombre "${coincidencia[0]}" — debe ser "BroWay Adventures" (B y W mayúsculas, una sola palabra)`,
          });
        }
      }
    });

    // Regla 5: "Next Stop" no se repite en el mismo archivo.
    let contadorNextStop = 0;
    lineas.forEach((linea, indice) => {
      const coincidencias = linea.match(NEXT_STOP_REGEX);
      if (!coincidencias) return;
      for (const coincidencia of coincidencias) {
        contadorNextStop += 1;
        if (contadorNextStop > 1) {
          violaciones.push({
            regla: 5,
            archivo: rutaRelativa,
            linea: indice + 1,
            detalle: `"${coincidencia}" repetido (aparición #${contadorNextStop} en este archivo) — la firma se usa una sola vez por pieza`,
          });
        }
      }
    });
  }
}

if (violaciones.length === 0) {
  console.log(
    `✓ check:marca — 0 violaciones sobre ${archivos.length} archivos revisados.`,
  );
  process.exit(0);
}

console.error(`\n✗ check:marca encontró ${violaciones.length} violación(es):\n`);
for (const v of violaciones) {
  console.error(`  [regla ${v.regla}] ${v.archivo}:${v.linea} — ${v.detalle}`);
}
console.error(
  "\n  Regla 1: los hex antiguos (#003062/#00aac3/#ff6a03) solo pueden citarse en\n" +
    "  history/ o docs/brand/** como defecto ya corregido.\n" +
    "  Regla 2: los cinco hex oficiales solo se declaran en app/globals.css — en\n" +
    "  cualquier otro archivo, usa el token (bg-brand-navy, text-brand-navy, …).\n" +
    "  La única excepción es la guía viva en /design-system.\n" +
    "  Regla 3: ninguna de las ocho promesas prohibidas (sistema-de-identidad.md\n" +
    "  §3.5) en messages/, app/, components/, lib/ o src/**.\n" +
    "  Regla 4: el nombre se escribe \"BroWay Adventures\" — B y W mayúsculas, una\n" +
    "  sola palabra. Nunca \"Bro Way\", \"Broway\", \"Bro-Way\" ni \"BRO WAY\".\n" +
    "  Regla 5: «Next Stop» se firma una sola vez por archivo/pieza.\n",
);
process.exit(1);
