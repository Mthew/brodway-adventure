import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Nombres de la escala tipográfica declarada en `app/globals.css` (@theme).
 *
 * tailwind-merge no lee el `@theme`: sólo conoce la escala por defecto de Tailwind
 * (`text-sm`, `text-lg`, `text-2xl`…). Al ver `text-body-sm` no lo reconoce como
 * tamaño, lo clasifica como COLOR de texto, y entonces `text-body-sm` y
 * `text-brand-navy` le parecen el mismo conflicto: se queda con el último y BORRA
 * el otro en silencio.
 *
 * Eso no era hipotético — pasaba en producción: el botón `secondary` perdía su
 * `text-white` y quedaba en texto neutral-900 sobre navy, 1.19:1. Ilegible, y sin
 * ningún error en consola.
 *
 * Al declarar aquí los nombres de la escala, `text-body-sm` vuelve a ser un tamaño
 * y deja de pelearse con los colores.
 *
 * SI AGREGAS UN TOKEN `--text-*` NUEVO EN globals.css, AGRÉGALO TAMBIÉN AQUÍ.
 * No hay test que lo verifique todavía (el proyecto aún no tiene runner), y el
 * síntoma de olvidarlo es mudo: no hay error, sólo un color o un tamaño que
 * desaparece. El bloque @theme de globals.css tiene la nota recíproca.
 */
export const FONT_SIZE_TOKENS = [
  "display",
  "h1",
  "h2",
  "h3",
  "body-lg",
  "body",
  "body-sm",
  "caption",
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...FONT_SIZE_TOKENS] }],
    },
  },
});

/** Combina clases resolviendo conflictos de Tailwind (la última gana). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
