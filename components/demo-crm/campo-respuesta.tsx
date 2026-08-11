"use client";

import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Respuesta } from "@/lib/demo-crm/respuestas";
import { cn } from "@/lib/utils";

/**
 * Campo para anotar la respuesta del proveedor durante la demo.
 *
 * Guarda contra `/api/demo-crm/respuestas`, que escribe en un archivo del repo. Ese
 * endpoint sólo existe en desarrollo, así que `editable` llega en false en cualquier
 * otro entorno y el campo se muestra en sólo lectura en vez de ofrecer un botón que
 * fallaría.
 */

type Estado = "limpio" | "sucio" | "guardando" | "guardado" | "error";

function formatearHora(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CampoRespuesta({
  id,
  pregunta,
  inicial,
  editable,
}: {
  id: string;
  pregunta: string;
  inicial?: Respuesta;
  editable: boolean;
}) {
  const campoId = useId();
  const [texto, setTexto] = useState(inicial?.texto ?? "");
  const [estado, setEstado] = useState<Estado>("limpio");

  /*
    Se guarda el ISO, no la hora ya formateada.

    `toLocaleTimeString` usa la zona del servidor al renderizar y la del navegador
    al hidratar: el mismo instante produce dos textos distintos. El formateo ocurre
    en el render y la discrepancia se declara con `suppressHydrationWarning` sobre
    el `<time>` — es el caso para el que existe esa prop. Calcularlo en un efecto
    también funcionaría, pero encadena un render extra por cada uno de los
    veintitantos campos de la página.
  */
  const [guardadoEl, setGuardadoEl] = useState<string | null>(
    inicial?.guardadoEl ?? null,
  );

  async function guardar(event: React.FormEvent) {
    event.preventDefault();
    if (!editable || estado === "guardando") return;

    setEstado("guardando");

    try {
      const respuesta = await fetch("/api/demo-crm/respuestas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, texto }),
      });

      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

      const datos = (await respuesta.json()) as { guardadoEl: string | null };

      setGuardadoEl(datos.guardadoEl);
      setEstado("guardado");
    } catch (error) {
      console.error("[demo-crm] no se pudo guardar la respuesta", error);
      setEstado("error");
    }
  }

  return (
    <form onSubmit={guardar} className="flex flex-col gap-1.5">
      <label
        htmlFor={campoId}
        className="text-caption font-medium text-neutral-600"
      >
        Respuesta del proveedor
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={campoId}
          type="text"
          value={texto}
          disabled={!editable}
          aria-label={`Respuesta a: ${pregunta}`}
          placeholder={editable ? "Lo que respondieron, textual" : undefined}
          onChange={(event) => {
            setTexto(event.target.value);
            setEstado("sucio");
          }}
          className={cn(
            "text-body min-h-11 w-full flex-1 rounded-md border bg-white px-4 py-2 text-neutral-900",
            "border-neutral-300 placeholder:text-neutral-400",
            "disabled:bg-neutral-50 disabled:text-neutral-500",
          )}
        />
        {/*
          Contorno navy y no naranja: en este sitio el naranja significa "enviar el
          formulario de leads" y el verde "WhatsApp". Una página interna no se
          apropia de ninguna de las dos intenciones.
        */}
        <Button
          type="submit"
          variant="outline"
          size="sm"
          disabled={!editable || estado === "guardando"}
          className="shrink-0"
        >
          {estado === "guardando" ? "Guardando…" : "Guardar respuesta"}
        </Button>
      </div>

      <p
        aria-live="polite"
        className={cn(
          "text-caption",
          estado === "error" ? "text-error font-medium" : "text-neutral-500",
        )}
      >
        {!editable ? (
          "Sólo lectura: el guardado escribe un archivo del repositorio y sólo funciona con el servidor de desarrollo."
        ) : estado === "error" ? (
          "No se pudo guardar. Revisa la consola del servidor."
        ) : estado === "sucio" ? (
          "Sin guardar"
        ) : guardadoEl ? (
          <>
            Guardada a las{" "}
            <time dateTime={guardadoEl} suppressHydrationWarning>
              {formatearHora(guardadoEl)}
            </time>
          </>
        ) : estado === "guardado" ? (
          "Respuesta borrada"
        ) : (
          ""
        )}
      </p>
    </form>
  );
}
