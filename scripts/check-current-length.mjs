/**
 * Verifica que CURRENT.md no rebase su techo de 50 líneas.
 *
 * POR QUÉ EXISTE:
 * CURRENT.md sirve para que una sesión nueva sepa en qué punto va el proyecto leyendo
 * un solo archivo. Eso solo funciona si se puede leer de un vistazo. Un archivo de
 * estado que crece sin límite deja de ser un resumen y se convierte en otro documento
 * largo que nadie lee, que es justo el problema que venía a resolver.
 *
 * El techo no se sube: cuando se rebasa, lo viejo se archiva en `history/`.
 * Ver CLAUDE.md §Flujo de trabajo.
 */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const MAX_LINES = 50;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const lines = readFileSync(join(root, "CURRENT.md"), "utf8").split("\n");

// Un salto de línea final deja un elemento vacío que no es una línea real.
const count =
  lines.length > 0 && lines[lines.length - 1] === ""
    ? lines.length - 1
    : lines.length;

if (count <= MAX_LINES) {
  console.log(`✓ CURRENT.md: ${count}/${MAX_LINES} líneas.`);
  process.exit(0);
}

let siguiente = "001";
try {
  const usados = readdirSync(join(root, "history"))
    .map((archivo) => archivo.match(/^(\d{3})-/)?.[1])
    .filter(Boolean)
    .map(Number);
  if (usados.length > 0) {
    siguiente = String(Math.max(...usados) + 1).padStart(3, "0");
  }
} catch {
  // No existe history/ todavía: 001 es correcto.
}

console.error(
  `\n✗ CURRENT.md tiene ${count} líneas y el techo es ${MAX_LINES}.\n\n` +
    "  No subas el techo. Archiva lo que ya no describe el estado ACTUAL:\n\n" +
    `    1. Mueve esas secciones a history/${siguiente}-<tema>.md\n` +
    "    2. Deja en CURRENT.md solo el punto en que va el proyecto ahora\n" +
    "    3. Si el archivo histórico importa para entender el presente, enlázalo\n\n" +
    "  Lo que casi siempre sobra: pasos ya cerrados con su detalle, bloqueos ya\n" +
    "  resueltos, y decisiones que dejaron de estar abiertas.\n",
);
process.exit(1);
