"use client";

import { useActionState } from "react";

import { guardarSecciones } from "@/app/admin/acciones/ofertas";
import {
  Avance,
  BarraAccion,
  BotonPrincipal,
  Campo,
  ENTRADA,
  Error as ErrorFormulario,
} from "@/app/admin/piezas";

type Oferta = {
  id: string;
  titulo: string;
  mostrar_en_mejores_ofertas: boolean;
  mostrar_en_playas_y_hoteles: boolean;
  mostrar_en_home: boolean;
  orden: number;
};

const SECCIONES = [
  {
    name: "mejores_ofertas",
    campo: "mostrar_en_mejores_ofertas",
    etiqueta: "Mejores Ofertas",
    ayuda: "Para quien busca la tarifa más baja.",
  },
  {
    name: "playas_y_hoteles",
    campo: "mostrar_en_playas_y_hoteles",
    etiqueta: "Mejores Playas y Hoteles",
    ayuda: "Para quien busca mejor experiencia y el precio no manda.",
  },
  {
    name: "home",
    campo: "mostrar_en_home",
    etiqueta: "Portada",
    ayuda: "Aparece en la página de inicio.",
  },
] as const;

/**
 * Paso 3: dónde aparece.
 *
 * Casillas y no una lista de colecciones a la que "añadir" la oferta: en el modelo son
 * banderas de la propia oferta, porque una oferta existe una sola vez y cambiar su
 * precio tiene que actualizar todas las secciones a la vez. La pantalla dice lo mismo
 * que dice la base.
 */
export function FormularioSecciones({ oferta }: { oferta: Oferta }) {
  const [estado, accion, enviando] = useActionState(guardarSecciones, null);

  return (
    <form action={accion} className="flex min-h-svh flex-col">
      <input type="hidden" name="id" value={oferta.id} />

      <div className="flex flex-1 flex-col gap-5 px-5 pt-4 pb-6">
        <Avance paso={3} ofertaId={oferta.id} />

        <div className="flex flex-col gap-1">
          <h1 className="text-h3 font-display">{oferta.titulo}</h1>
          <p className="text-body-sm text-neutral-600">
            Puede estar en varias a la vez. Se guarda una sola vez.
          </p>
        </div>

        <ErrorFormulario mensaje={estado?.error} />

        <fieldset className="flex flex-col gap-2">
          <legend className="sr-only">Secciones donde aparece</legend>
          {SECCIONES.map((seccion) => (
            <label
              key={seccion.name}
              /* Toda la fila es el objetivo táctil, no sólo la casilla. */
              className="bg-surface-base flex min-h-16 items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3"
            >
              <input
                type="checkbox"
                name={seccion.name}
                defaultChecked={oferta[seccion.campo]}
                className="accent-brand-turquoise size-5 shrink-0"
              />
              <span className="flex flex-col">
                <span className="text-body font-display font-semibold">
                  {seccion.etiqueta}
                </span>
                <span className="text-caption text-neutral-600">{seccion.ayuda}</span>
              </span>
            </label>
          ))}
        </fieldset>

        <Campo
          etiqueta="Orden"
          ayuda="Menor va primero. Con el mismo número, se ordenan por fecha."
        >
          <input
            name="orden"
            type="number"
            inputMode="numeric"
            defaultValue={oferta.orden}
            className={ENTRADA}
          />
        </Campo>
      </div>

      <BarraAccion>
        <BotonPrincipal type="submit" disabled={enviando}>
          {enviando ? "Guardando…" : "Guardar y revisar"}
        </BotonPrincipal>
      </BarraAccion>
    </form>
  );
}
