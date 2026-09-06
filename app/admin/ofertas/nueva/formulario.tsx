"use client";

import { useActionState, useRef, useState } from "react";

import { crearBorrador } from "@/app/admin/acciones/ofertas";
import { Avance, BarraAccion, BotonPrincipal, Error as ErrorFormulario } from "@/app/admin/piezas";

import { CamposOferta } from "../campos";
import { DestinoRapido } from "./destino-rapido";

type Destino = { id: string; nombre: string };

/**
 * Paso 1: transcribir el flyer.
 *
 * El flyer se ve ARRIBA mientras se escribe debajo, y esa es la decisión que define la
 * pantalla: la tarea real es copiar de una imagen a unos campos, y obligar a alternar
 * entre la galería del teléfono y el formulario es lo que hace que la gente transcriba
 * mal. La imagen se queda en el navegador —no se sube— porque aquí sólo sirve para
 * leerla; las fotos que sí se publican son el paso 2.
 *
 * El componente ya NO devuelve un único `<form>` como raíz: `DestinoRapido` trae su
 * propio `<form>` interno para el diálogo de creación rápida de destino, y un `<form>`
 * anidado dentro de otro es HTML inválido. Viven como hermanos en un Fragment.
 */
export function FormularioNuevaOferta({ destinos: destinosIniciales }: { destinos: Destino[] }) {
  const [estado, accion, enviando] = useActionState(crearBorrador, null);
  const [flyer, setFlyer] = useState<string | null>(null);
  const [destinos, setDestinos] = useState<Destino[]>(destinosIniciales);
  const [destinoSeleccionadoId, setDestinoSeleccionadoId] = useState<string | undefined>(
    undefined,
  );
  const dialogDestinoRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <form action={accion} className="flex min-h-svh flex-col">
        <div className="flex flex-1 flex-col gap-5 px-5 pt-4 pb-6">
          <Avance paso={1} />

          <ErrorFormulario mensaje={estado?.error} />

          {/* El flyer, arriba de todo. */}
          <div className="flex flex-col gap-2">
            {flyer ? (
              <div className="flex flex-col gap-2">
                {/* `<img>` y no `next/image`: es un archivo local del navegador vía
                    createObjectURL, sin URL remota que optimizar. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={flyer}
                  alt="Flyer del mayorista"
                  className="max-h-[45svh] w-full rounded-lg border border-neutral-200 bg-white object-contain"
                />
                <button
                  type="button"
                  onClick={() => setFlyer(null)}
                  className="text-body-sm text-brand-turquoise-text min-h-11 self-start font-semibold"
                >
                  Quitar el flyer
                </button>
              </div>
            ) : (
              <label className="text-body-sm flex min-h-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-neutral-300 bg-white px-4 text-center text-neutral-600">
                <span className="font-display font-semibold text-neutral-800">
                  Abre el flyer aquí
                </span>
                <span>Lo verás mientras escribes. No se publica.</span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const archivo = e.target.files?.[0];
                    if (archivo) setFlyer(URL.createObjectURL(archivo));
                  }}
                />
              </label>
            )}
          </div>

          <CamposOferta
            destinos={destinos}
            destinoSeleccionadoId={destinoSeleccionadoId}
            onCrearDestino={() => dialogDestinoRef.current?.showModal()}
          />
        </div>

        <BarraAccion>
          <BotonPrincipal type="submit" disabled={enviando}>
            {enviando ? "Guardando…" : "Guardar y seguir a fotos"}
          </BotonPrincipal>
        </BarraAccion>
      </form>

      <DestinoRapido
        dialogRef={dialogDestinoRef}
        onCreado={(destino) => {
          setDestinos((actuales) =>
            [...actuales, destino].sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
          );
          setDestinoSeleccionadoId(destino.id);
        }}
      />
    </>
  );
}
