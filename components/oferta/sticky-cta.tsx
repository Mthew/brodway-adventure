"use client";

import { useEffect, useRef, useState } from "react";
import { useFormatter, useLocale, useTranslations } from "next-intl";

import { WhatsAppIcon } from "@/components/layout/whatsapp-floating";
import { buildWhatsAppUrl } from "@/lib/config";
import { trackWhatsAppClick } from "@/lib/tracking/events";
import type { Offer } from "@/lib/types/offer";

/**
 * Barra fija de conversión, sólo en móvil.
 *
 * Aparece al pasar el hero y lleva el precio "desde" a la izquierda y el CTA a la
 * derecha. Mientras está visible, el botón flotante de WhatsApp se oculta: apilar
 * dos CTAs al mismo canal es ruido, no insistencia (brief-v0.md §6).
 *
 * CÓMO SE COORDINA CON EL FLOTANTE:
 * marcando `data-sticky-cta` en el <body>, y `globals.css` oculta el flotante
 * cuando ese atributo está presente. El flotante se monta en el layout, que es un
 * Server Component: no hay forma de pasarle una prop desde aquí sin envolver toda
 * la aplicación en un contexto de cliente sólo para esto. Un atributo en el body
 * cuesta una línea de CSS y no obliga a hidratar nada más.
 *
 * La visibilidad se detecta con IntersectionObserver sobre un centinela, NO con un
 * listener de scroll: el dial de motion 3 prohíbe `window.addEventListener('scroll')`
 * y un observer no dispara en cada frame del scroll.
 */
export function StickyCta({ offer }: { offer: Offer }) {
  const t = useTranslations("ofertas");
  const tp = useTranslations("precio");
  const locale = useLocale();
  const format = useFormatter();

  const [visible, setVisible] = useState(false);
  const centinela = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodo = centinela.current;
    if (!nodo) return;

    const observer = new IntersectionObserver(
      ([entrada]) =>
        /**
         * `!isIntersecting` por sí solo NO sirve: es cierto tanto si el centinela
         * quedó ARRIBA del viewport (la persona ya pasó el bloque de conversión,
         * que es cuando la barra debe aparecer) como si está ABAJO, que es el caso
         * al cargar la página. Sin comprobar la dirección, la barra sale a
         * scrollY 0 y tapa el CTA principal desde el primer momento.
         */
        setVisible(
          !entrada.isIntersecting && entrada.boundingClientRect.top < 0,
        ),
      { rootMargin: "0px" },
    );
    observer.observe(nodo);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (visible) {
      document.body.dataset.stickyCta = "true";
    } else {
      delete document.body.dataset.stickyCta;
    }
    // Al desmontar (navegar a otra página) hay que soltarlo, o el flotante queda
    // oculto en la página siguiente.
    return () => {
      delete document.body.dataset.stickyCta;
    };
  }, [visible]);

  const href = buildWhatsAppUrl({
    message: t("mensajeWhatsapp", { titulo: offer.titulo }),
    offerId: offer.offerId,
  });

  return (
    <>
      {/* Centinela: marca dónde termina el bloque de conversión de arriba. */}
      <div ref={centinela} aria-hidden="true" className="h-px" />

      <div
        className={[
          "bg-surface-base fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 md:hidden",
          "pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(0,48,98,0.08)]",
          "transition-transform duration-200 motion-reduce:transition-none",
          visible ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
        /* Fuera de pantalla no debe ser alcanzable por teclado ni por lector.
           React 19 admite `inert` como booleano nativo: pasarle una cadena vacía
           lo interpreta como `false` y además avisa por consola. */
        inert={!visible}
      >
        <div className="flex items-center justify-between gap-4 px-5 py-3">
          <p className="flex flex-col leading-tight">
            <span className="text-caption text-neutral-600">{tp("desde")}</span>
            <span className="text-body text-brand-navy font-bold">
              {format.number(offer.precioDesde, {
                style: "currency",
                currency: offer.moneda,
                maximumFractionDigits: 0,
              })}
            </span>
          </p>

          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackWhatsAppClick({
                offerId: offer.offerId,
                page: `/ofertas/${offer.slug}`,
                locale,
              })
            }
            className="bg-whatsapp text-brand-navy inline-flex min-h-11 items-center gap-2 rounded-md px-5 font-semibold active:scale-[0.98]"
          >
            <WhatsAppIcon className="size-5" />
            {t("barraCta")}
          </a>
        </div>
      </div>
    </>
  );
}
