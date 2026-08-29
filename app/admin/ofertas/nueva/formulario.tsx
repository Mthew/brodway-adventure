"use client";

import { useActionState, useState } from "react";

import { crearBorrador } from "@/app/admin/acciones";
import {
  Avance,
  BarraAccion,
  BotonPrincipal,
  Campo,
  ENTRADA,
  Error as ErrorFormulario,
} from "@/app/admin/piezas";

type Destino = { id: string; nombre: string };

/**
 * Paso 1: transcribir el flyer.
 *
 * El flyer se ve ARRIBA mientras se escribe debajo, y esa es la decisión que define la
 * pantalla: la tarea real es copiar de una imagen a unos campos, y obligar a alternar
 * entre la galería del teléfono y el formulario es lo que hace que la gente transcriba
 * mal. La imagen se queda en el navegador —no se sube— porque aquí sólo sirve para
 * leerla; las fotos que sí se publican son el paso 2.
 */
export function FormularioNuevaOferta({ destinos }: { destinos: Destino[] }) {
  const [estado, accion, enviando] = useActionState(crearBorrador, null);
  const [flyer, setFlyer] = useState<string | null>(null);

  return (
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

        <Campo etiqueta="Nombre de la oferta">
          <input name="titulo" required className={ENTRADA} />
        </Campo>

        <Campo etiqueta="Destino">
          <select name="destino_id" required defaultValue="" className={ENTRADA}>
            <option value="" disabled>
              Elige uno
            </option>
            {destinos.map((destino) => (
              <option key={destino.id} value={destino.id}>
                {destino.nombre}
              </option>
            ))}
          </select>
        </Campo>

        <Campo
          etiqueta="En una línea"
          ayuda="Lo que hace distinta a esta oferta. Sale en la tarjeta."
        >
          <input name="beneficio_corto" className={ENTRADA} />
        </Campo>

        <Campo
          etiqueta="Precio desde"
          ayuda="En pesos, por persona. Sin puntos ni símbolos."
        >
          <input
            name="precio_desde"
            type="number"
            min={1}
            required
            inputMode="numeric"
            className={ENTRADA}
          />
        </Campo>

        {/*
          Ciudad de salida y ocupación NO son opcionales, y no por rigor de formulario:
          el bloque de precio del sitio las muestra junto a la cifra, y sin ellas un
          "desde" no significa nada. Es obligación de transparencia, no un capricho.
        */}
        <Campo etiqueta="Ciudad de salida">
          <input name="ciudad_origen" required className={ENTRADA} />
        </Campo>

        <Campo etiqueta="Ocupación del precio" ayuda="Con cuántas personas por habitación se calculó.">
          <select name="ocupacion_base" defaultValue="doble" className={ENTRADA}>
            <option value="sencilla">Sencilla</option>
            <option value="doble">Doble</option>
            <option value="triple">Triple</option>
            <option value="cuádruple">Cuádruple</option>
          </select>
        </Campo>

        <Campo etiqueta="Noches">
          <input
            name="noches"
            type="number"
            min={1}
            required
            inputMode="numeric"
            className={ENTRADA}
          />
        </Campo>

        <Campo etiqueta="Hotel" ayuda="Si la oferta lo lleva.">
          <input name="hotel" className={ENTRADA} />
        </Campo>

        <Campo etiqueta="Alimentación" ayuda="Por ejemplo: todo incluido, o desayuno.">
          <input name="alimentacion" className={ENTRADA} />
        </Campo>

        <Campo
          etiqueta="Fechas del viaje"
          ayuda="Tal como las trae el flyer: «8 al 12 de junio»."
        >
          <input name="fecha_periodo" className={ENTRADA} />
        </Campo>

        {/*
          La vigencia de la TARIFA, que no es lo mismo que las fechas del viaje.
          Confundirlas publica un precio que ya no existe, así que van juntas y
          etiquetadas para que la diferencia se lea.
        */}
        <fieldset className="flex flex-col gap-3 rounded-lg bg-white p-4">
          <legend className="text-body-sm font-display px-1 font-semibold">
            Hasta cuándo vale este precio
          </legend>
          <Campo etiqueta="Desde">
            <input name="vigencia_desde" type="date" required className={ENTRADA} />
          </Campo>
          <Campo etiqueta="Hasta">
            <input name="vigencia_hasta" type="date" required className={ENTRADA} />
          </Campo>
        </fieldset>

        <Campo etiqueta="Incluye" ayuda="Una cosa por línea.">
          <textarea name="incluye" rows={5} className={`${ENTRADA} py-3`} />
        </Campo>

        <Campo etiqueta="No incluye" ayuda="Una cosa por línea.">
          <textarea name="no_incluye" rows={4} className={`${ENTRADA} py-3`} />
        </Campo>
      </div>

      <BarraAccion>
        <BotonPrincipal type="submit" disabled={enviando}>
          {enviando ? "Guardando…" : "Guardar y seguir a fotos"}
        </BotonPrincipal>
      </BarraAccion>
    </form>
  );
}
