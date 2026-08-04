"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { buildWhatsAppUrl } from "@/lib/config";
import { trackWhatsAppClick } from "@/lib/tracking/events";
import { cn } from "@/lib/utils";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 8.24 8.24c0 4.54-3.7 8.23-8.24 8.23z" />
    </svg>
  );
}

/**
 * Botón flotante de WhatsApp, presente en todas las páginas.
 *
 * Lo que este componente NO hace, a propósito (brief-v0-producto.md §8):
 * no se expande en un chat falso y no salta solo a los pocos segundos. Eso es
 * presión comercial, y la presión comercial está vetada por marca.
 */
export function WhatsAppFloating({
  message,
  offerId,
  campaign,
  hidden = false,
}: {
  message?: string;
  offerId?: string;
  campaign?: string;
  /** La ficha de paquete oculta el flotante cuando su barra fija está visible. */
  hidden?: boolean;
}) {
  const t = useTranslations("whatsapp");
  const locale = useLocale();
  const pathname = usePathname();

  const href = buildWhatsAppUrl({
    message: message ?? t("mensajeGenerico"),
    offerId,
    campaign,
  });

  if (hidden) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("aria")}
      onClick={() =>
        trackWhatsAppClick({ offerId, campaign, page: pathname, locale })
      }
      className={cn(
        "bg-whatsapp text-brand-navy fixed right-5 z-40 shadow-lg",
        "flex size-14 items-center justify-center rounded-full",
        "transition-transform hover:scale-105",
        // Respeta el área segura inferior del iPhone.
        "bottom-[calc(1.25rem+env(safe-area-inset-bottom))]",
      )}
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}

export { WhatsAppIcon };
