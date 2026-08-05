"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
import { Checkbox, Input, Select } from "@/components/ui/field";
import { Link, useRouter } from "@/lib/i18n/navigation";

/**
 * Formulario corto de captación.
 *
 * Es la alternativa a WhatsApp para quien no quiere chatear, no el canal principal.
 * Lo usan la ficha de paquete, /contacto y las landings de campaña: por eso vive en
 * un solo sitio y recibe el contexto por props.
 *
 * LOS CUATRO CAMPOS NO SON NEGOCIABLES (brief-v0-producto.md §9.9). Son exactamente
 * los que el asesor necesita para cotizar sin volver a preguntar:
 *   nombre · WhatsApp · CIUDAD DE SALIDA · fecha aproximada + nº de viajeros
 *
 * La ciudad de salida es la que más se olvida y la que más falta hace: el mismo
 * viaje cuesta distinto saliendo de Medellín o de Bogotá.
 *
 * NO se pide presupuesto (fricción alta; el asesor lo obtiene mejor conversando) y
 * NUNCA ingresos, estrato ni capacidad crediticia.
 */

type EstadoEnvio =
  | { fase: "reposo" }
  | { fase: "enviando" }
  | { fase: "error"; mensaje: string };

export function LeadForm({
  offerId,
  destino,
  paginaOrigen,
}: {
  /**
   * Identificador de la oferta que la persona estaba viendo.
   *
   * Va en el payload, no como `<input type="hidden">`: el asesor debe recibirlo
   * igual, y un campo oculto en el DOM es manipulable y no aporta nada a cambio.
   */
  offerId?: string;
  destino?: string;
  /** Ruta desde la que se envía. Queda en el registro de consentimiento como evidencia. */
  paginaOrigen: string;
}) {
  const t = useTranslations("formulario");
  const tc = useTranslations("consentimiento");
  const locale = useLocale();
  const router = useRouter();

  const [estado, setEstado] = useState<EstadoEnvio>({ fase: "reposo" });
  const [consentimiento, setConsentimiento] = useState(false);

  const enviando = estado.fase === "enviando";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Cinturón y tirantes: el botón ya está deshabilitado sin consentimiento, y
    // el servidor vuelve a rechazarlo. Ninguna de las tres capas sobra.
    if (!consentimiento) return;

    setEstado({ fase: "enviando" });

    const datos = new FormData(event.currentTarget);

    // TODO (Paso 7): leer los UTMs persistidos en sessionStorage por lib/tracking/utm.ts.
    // Hoy sólo se capturan si vienen en la URL de esta misma página.
    const params = new URLSearchParams(window.location.search);
    const utm = Object.fromEntries(
      [...params.entries()].filter(([clave]) => clave.startsWith("utm_")),
    );

    try {
      const respuesta = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: datos.get("nombre"),
          telefono: datos.get("telefono"),
          ciudadOrigen: datos.get("ciudadOrigen"),
          fechaAproximada: datos.get("fechaAproximada"),
          viajeros: { adultos: Number(datos.get("viajeros")) || 1, menores: 0 },
          offerId,
          destino,
          paginaOrigen,
          locale,
          utm: Object.keys(utm).length > 0 ? utm : undefined,
          consentimiento: {
            otorgado: true,
            // El texto EXACTO que se aceptó, no una referencia a él: es lo que
            // permite acreditar después qué autorizó cada persona.
            textoAceptado: tc("texto"),
          },
        }),
      });

      if (!respuesta.ok) {
        setEstado({ fase: "error", mensaje: t("error") });
        return;
      }

      const { eventId } = (await respuesta.json()) as { eventId: string };

      const destinoUrl = new URLSearchParams({ evento: eventId });
      if (offerId) destinoUrl.set("oferta", offerId);
      if (destino) destinoUrl.set("destino", destino);

      router.push(`/gracias?${destinoUrl.toString()}`);
    } catch {
      setEstado({ fase: "error", mensaje: t("error") });
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <Input name="nombre" label={t("nombre")} autoComplete="name" required />

      <Input
        name="telefono"
        type="tel"
        label={t("telefono")}
        hint={t("telefonoAyuda")}
        autoComplete="tel"
        required
      />

      <Input
        name="ciudadOrigen"
        label={t("ciudadOrigen")}
        hint={t("ciudadOrigenAyuda")}
        autoComplete="address-level2"
        required
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          name="fechaAproximada"
          type="month"
          label={t("fechaAproximada")}
          hint={t("fechaAproximadaAyuda")}
        />
        <Select name="viajeros" label={t("viajeros")} defaultValue="2">
          {[1, 2, 3, 4, 5, 6].map((cantidad) => (
            <option key={cantidad} value={cantidad}>
              {cantidad}
              {cantidad === 6 ? "+" : ""}
            </option>
          ))}
        </Select>
      </div>

      <Checkbox
        name="consentimiento"
        checked={consentimiento}
        onChange={(event) => setConsentimiento(event.target.checked)}
        error={
          estado.fase === "error" && !consentimiento
            ? tc("requerido")
            : undefined
        }
        label={
          <>
            {tc("texto")}{" "}
            <span className="block pt-2 text-neutral-600">{tc("derechos")}</span>
            <Link
              href="/legal"
              className="text-brand-turquoise-text mt-2 inline-block font-semibold underline underline-offset-4"
            >
              {tc("enlace")}
            </Link>
          </>
        }
      />

      {/*
        El error va inline y ANTES del botón, no en un toast: si aparece bajo el
        pliegue o desaparece solo, la persona no se entera de que no se envió.
      */}
      {estado.fase === "error" ? (
        <p
          role="alert"
          className="text-body-sm text-error bg-error/10 rounded-md px-4 py-3 font-medium"
        >
          {estado.mensaje}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        fullWidth
        /* Sin consentimiento no se puede enviar (Ley 1581 de 2012). */
        disabled={!consentimiento || enviando}
      >
        {enviando ? t("enviando") : t("enviar")}
      </Button>

      <p className="text-caption text-center text-neutral-600">
        {t("microcopyEnvio")}
      </p>
    </form>
  );
}
