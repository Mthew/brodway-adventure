import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

/**
 * Envoltorios de navegación conscientes del locale. Úsalos SIEMPRE en lugar de
 * los de `next/link` y `next/navigation`: son los que mantienen el prefijo de
 * idioma al navegar.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
