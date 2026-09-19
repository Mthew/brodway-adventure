/**
 * Único punto fuera de `app/globals.css` donde el navy oficial se declara
 * como hex literal.
 *
 * `viewport.themeColor` (Next.js Metadata API, `app/[locale]/layout.tsx`)
 * pinta la barra de direcciones del navegador / la PWA a través de
 * `<meta name="theme-color">`. Ese atributo no es CSS: no puede leer
 * `var(--color-brand-navy)` como lo hace una clase de Tailwind, así que
 * necesita el string de color final.
 *
 * `scripts/check-marca.mjs` (regla 2) excluye explícitamente este archivo,
 * igual que excluye `app/[locale]/(sitio)/design-system/page.tsx`: es la
 * única vía legítima para citar un hex oficial fuera del token CSS, no una
 * fuga de la desviación que la regla previene.
 */
export const THEME_COLOR_NAVY = "#0D3B66";
