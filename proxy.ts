import createMiddleware from "next-intl/middleware";

import { routing } from "@/lib/i18n/routing";

/**
 * Detección y enrutado de idioma.
 *
 * OJO con el nombre del archivo: desde Next.js 16 el middleware se llama `proxy.ts`
 * (spec-tecnica.md §2.1.1). La funcionalidad es la misma; solo cambió la convención.
 * El paquete de next-intl sigue exportándose desde `next-intl/middleware`.
 *
 * En la primera visita detecta `Accept-Language` y redirige al locale correspondiente,
 * con fallback a `es`. La elección se persiste en la cookie `NEXT_LOCALE`.
 */
export default createMiddleware(routing);

export const config = {
  /**
   * Excluye rutas internas de Next, la API y cualquier archivo con extensión
   * (imágenes, fuentes, robots.txt). Sin esto el proxy intentaría prefijar
   * assets estáticos con el locale.
   */
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
