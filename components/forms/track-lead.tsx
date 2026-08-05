"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";

import { trackLead } from "@/lib/tracking/events";

/**
 * Dispara el evento `Lead` al llegar a /gracias.
 *
 * POR QUÉ ES IDEMPOTENTE:
 * El `eventId` viaja al CRM para deduplicar contra los eventos que él emite
 * (spec-tecnica.md §8.5). Esa deduplicación asume que el sitio emite el evento UNA
 * vez. Pero /gracias es una URL normal: se puede recargar, volver atrás y adelante,
 * o compartir. Sin guardia, cada recarga cuenta una conversión más y la
 * optimización de campaña se degrada con datos inflados.
 *
 * La guardia va en `sessionStorage` y no en un `useRef` porque el ref se pierde en
 * una recarga completa, que es justo el caso que hay que cubrir.
 */
export function TrackLead({
  eventId,
  offerId,
  page,
}: {
  eventId: string;
  offerId?: string;
  page: string;
}) {
  const locale = useLocale();
  // Evita el doble disparo del Strict Mode en desarrollo, donde el efecto corre
  // dos veces a propósito. El sessionStorage cubre las recargas; esto cubre eso.
  const disparado = useRef(false);

  useEffect(() => {
    if (disparado.current) return;

    const clave = `broway_lead_${eventId}`;

    try {
      if (sessionStorage.getItem(clave)) return;
      sessionStorage.setItem(clave, "1");
    } catch {
      // Modo privado o storage bloqueado: se prefiere emitir el evento (con el
      // riesgo de duplicarlo si recargan) antes que perder la conversión.
    }

    disparado.current = true;
    trackLead({ eventId, offerId, page, locale });
  }, [eventId, offerId, page, locale]);

  return null;
}
