/**
 * Verifica que los cinco hex del manual de marca sean los únicos valores de
 * color de marca del repo (docs/brand/specs/fase-1-paleta-y-superficies.md §9).
 *
 * POR QUÉ EXISTE:
 * Nada frenaba a alguien de escribir un hex "parecido" directamente en un
 * componente. Este script adelanta, del check:marca completo de la Fase 7,
 * solo la comprobación de hex — las dos reglas que N-01.1 necesita para no
 * regresar a la desviación que acaba de corregir.
 *
 * DOS REGLAS, NADA MÁS (nombre, léxico y "Next Stop" los añade la Fase 3):
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
 * La segunda regla es la que impide que la desviación se repita: comparar
 * solo contra los tres hex viejos no detecta que alguien escriba un cuarto
 * hex "parecido" directo en un componente en lugar de usar el token.
 *
 * MODO DE PRUEBA (N-01.2):
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

// Directorios que no se recorren: dependencias, build, control de versiones,
// y los fixtures sintéticos de este mismo script (N-01.2) — contienen hex a
// propósito para probar las reglas, no son código ni docs reales del repo.
const DIRS_IGNORADOS = new Set([
  "node_modules",
  ".git",
  ".next",
  ".vercel",
  "coverage",
  "__fixtures__",
  ".turbo",
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

// Única excepción declarada de la regla 2: la guía viva, que existe para
// publicar la paleta oficial.
const EXCEPCION_HEX_OFICIALES = join(
  "app",
  "[locale]",
  "(sitio)",
  "design-system",
  "page.tsx",
);

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
    rutaRelativa !== EXCEPCION_HEX_OFICIALES
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
    "  La única excepción es la guía viva en /design-system.\n",
);
process.exit(1);
