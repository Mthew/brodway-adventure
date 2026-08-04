"use client";

import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Selector de idioma.
 *
 * Dos reglas del spec §3.3 y del brief:
 * - Cambiar de idioma mantiene al usuario en la MISMA página. Rebotar al home
 *   rompería el message match de una landing de campaña, que es justo lo que hace
 *   que la pauta convierta.
 * - Texto, nunca banderas: una bandera representa un país, no un idioma.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("idioma");
  const activeLocale = useLocale();
  // `usePathname` de next-intl devuelve la ruta SIN el prefijo de locale, ya con
  // los segmentos dinámicos resueltos. Pasársela a `Link` con otro `locale` es lo
  // que mantiene al usuario en la misma página al cambiar de idioma.
  const pathname = usePathname();

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="group"
      aria-label={t("label")}
    >
      {routing.locales.map((locale) => {
        const isActive = locale === activeLocale;
        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            aria-current={isActive ? "true" : undefined}
            aria-label={t("cambiarA", { idioma: t(locale) })}
            className={cn(
              "text-caption min-h-11 rounded-sm px-2 font-semibold",
              "inline-flex items-center transition-colors",
              isActive
                ? "text-brand-navy"
                : "text-neutral-500 hover:text-brand-navy",
            )}
          >
            {t(locale)}
          </Link>
        );
      })}
    </div>
  );
}
