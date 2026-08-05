"use client";

import { useEffect } from "react";

import { capturarUtm } from "@/lib/tracking/utm";

/**
 * Captura los UTMs al entrar a la landing.
 *
 * Es un componente y no una llamada en la página porque la página es un Server
 * Component y `sessionStorage` sólo existe en el navegador.
 *
 * Va aquí y no sólo en el formulario porque en una landing la conversión dominante
 * es el clic a WhatsApp, no el envío del formulario: si la persona sale por
 * WhatsApp sin tocar el formulario, los UTMs tienen que estar guardados igual para
 * que el lead que llegue después conserve su origen.
 */
export function CapturaUtm() {
  useEffect(() => {
    capturarUtm();
  }, []);

  return null;
}
