/**
 * Verifica que la escala tipográfica del `@theme` y `FONT_SIZE_TOKENS` no se separen.
 *
 * POR QUÉ EXISTE:
 * tailwind-merge no lee el `@theme` de Tailwind v4. Si un token `--text-foo` existe en
 * `app/globals.css` pero NO está en `FONT_SIZE_TOKENS` de `lib/utils.ts`, tailwind-merge
 * clasifica `text-foo` como COLOR de texto. Entonces `cn("text-foo", "text-white")` le
 * parece un conflicto y BORRA uno de los dos, sin error y sin aviso.
 *
 * Eso ya llegó a producción una vez: el botón navy quedó con texto neutral-900 sobre
 * navy (1.19:1, ilegible) mientras el código fuente decía `text-white`.
 *
 * Y volvió a pasar el 4 de agosto de 2026: `shadcn init` sobrescribió `lib/utils.ts`
 * entero y dejó el `cn()` por defecto, sin `extendTailwindMerge`. El síntoma habría sido
 * el mismo botón ilegible. Un `git diff` lo detectó; este script lo detecta sin depender
 * de que alguien mire el diff.
 *
 * Corre con `pnpm check:tokens` y en el `build`.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const css = readFileSync(join(root, "app/globals.css"), "utf8");
const utils = readFileSync(join(root, "lib/utils.ts"), "utf8");

/**
 * Tokens declarados en el @theme.
 *
 * Se excluyen los modificadores (`--text-display--line-height`,
 * `--text-body--letter-spacing`): no son tamaños, son propiedades del tamaño.
 */
const declared = new Set(
  [...css.matchAll(/^\s*--text-([a-z0-9-]+)\s*:/gm)]
    .map((match) => match[1])
    .filter((name) => !name.includes("--")),
);

const arrayLiteral = utils.match(
  /export const FONT_SIZE_TOKENS\s*=\s*\[([\s\S]*?)\]\s*as const/,
);

if (!arrayLiteral) {
  console.error(
    "\n✗ No se encontró `export const FONT_SIZE_TOKENS = [...] as const` en lib/utils.ts.\n" +
      "  Si `cn()` perdió su configuración de extendTailwindMerge, los tamaños de texto\n" +
      "  vuelven a pelearse con los colores y un botón puede quedar ilegible sin ningún\n" +
      "  error. Restaura la configuración antes de seguir.\n",
  );
  process.exit(1);
}

const registered = new Set(
  [...arrayLiteral[1].matchAll(/["']([^"']+)["']/g)].map((match) => match[1]),
);

const missing = [...declared].filter((token) => !registered.has(token));
const orphaned = [...registered].filter((token) => !declared.has(token));

if (missing.length === 0 && orphaned.length === 0) {
  console.log(
    `✓ Escala tipográfica sincronizada (${declared.size} tokens en @theme y en FONT_SIZE_TOKENS).`,
  );
  process.exit(0);
}

if (missing.length > 0) {
  console.error(
    "\n✗ Tokens en el @theme de app/globals.css que FALTAN en FONT_SIZE_TOKENS:\n" +
      missing.map((token) => `    --text-${token}`).join("\n") +
      "\n\n  tailwind-merge los va a tratar como colores de texto y borrará clases en\n" +
      "  silencio. Agrégalos al array de lib/utils.ts.\n",
  );
}

if (orphaned.length > 0) {
  console.error(
    "\n✗ Nombres en FONT_SIZE_TOKENS que ya NO existen en el @theme:\n" +
      orphaned.map((token) => `    ${token}`).join("\n") +
      "\n\n  Si el token se renombró o se borró, actualiza también lib/utils.ts.\n",
  );
}

process.exit(1);
