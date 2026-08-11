"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import {
  actualizarConsentimiento,
  cargarEtiquetas,
  declararConsentimientoPorDefecto,
} from "@/lib/tracking/analytics";
import {
  CONSENT_CONCEDIDO,
  CONSENT_DENEGADO,
  guardarConsentimiento,
  leerConsentimiento,
  type ConsentState,
} from "@/lib/tracking/consent";

/**
 * Banner de consentimiento de cookies (Consent Mode v2).
 *
 * CUATRO REGLAS QUE NO SON DE DISEÑO:
 *
 * 1. Rechazar cuesta lo mismo que aceptar. Los dos botones tienen el mismo peso
 *    visual y el mismo número de clics. Un "Aceptar" grande junto a un enlace
 *    pequeño de "preferencias" es un patrón oscuro, no una elección.
 * 2. No hay opción por defecto. El banner no se cierra solo, no se cierra al hacer
 *    scroll y seguir navegando NO cuenta como aceptar.
 * 3. El consentimiento por defecto se declara ANTES de cargar ninguna etiqueta.
 * 4. No bloquea la página. Es una franja inferior, no un modal que secuestra el
 *    contenido: el sitio tiene que poder leerse sin decidir sobre cookies.
 *
 * Y no se confunde con la autorización de datos de la Ley 1581, que vive en el
 * formulario y se registra con el lead. Son permisos distintos.
 */
export function CookieBanner() {
  const t = useTranslations("cookies");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Antes que nada: declarar todo denegado, para que ninguna etiqueta pueda
    // medir mientras la persona decide.
    declararConsentimientoPorDefecto();

    const decidido = leerConsentimiento();

    if (!decidido) {
      setVisible(true);
      return;
    }

    // Ya decidió en una visita anterior: se aplica sin volver a preguntar.
    actualizarConsentimiento(decidido);
    if (decidido.analytics_storage === "granted") cargarEtiquetas();
  }, []);

  function decidir(estado: ConsentState) {
    guardarConsentimiento(estado);
    actualizarConsentimiento(estado);
    if (estado.analytics_storage === "granted") cargarEtiquetas();
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t("titulo")}
      className={[
        "bg-surface-base fixed inset-x-0 bottom-0 z-[60]",
        "border-t border-neutral-200 shadow-[0_-4px_16px_rgba(0,48,98,0.10)]",
        "pb-[env(safe-area-inset-bottom)]",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 md:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-body-sm text-brand-navy font-semibold">
            {t("titulo")}
          </p>
          <p className="text-body-sm max-w-[70ch] text-neutral-700">
            {t("texto")}{" "}
            <Link
              href="/legal"
              /* `min-h-11` = 44px: el mínimo táctil aplica también a este enlace,
                 que medía 41px dentro del párrafo del banner. */
              className="text-brand-turquoise-text inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
            >
              {t("enlace")}
            </Link>
          </p>
        </div>

        {/*
          Rechazar va PRIMERO en el DOM y con el mismo tamaño que aceptar.
          El orden de lectura importa tanto como el tamaño.
        */}
        {/*
          En fila desde el primer píxel, no apilados hasta `sm`. Apilados el
          banner medía 314px, el 39% de una pantalla de 812px, y tapaba los CTA
          del hero en la primera visita, que es justo la visita que importa.
          "Rechazar" y "Aceptar" caben de sobra en una fila a 375px.
          `flex-1` reparte el ancho para que ninguno parezca el botón principal.
        */}
        <div className="flex shrink-0 gap-3 [&>*]:flex-1 sm:[&>*]:flex-none">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => decidir(CONSENT_DENEGADO)}
          >
            {t("rechazar")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => decidir(CONSENT_CONCEDIDO)}
          >
            {t("aceptar")}
          </Button>
        </div>
      </div>
    </div>
  );
}
