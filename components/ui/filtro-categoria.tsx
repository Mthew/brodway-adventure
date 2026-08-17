"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import type { DestinationCategory } from "@/lib/types/destination";

export type ValorFiltro = "todos" | DestinationCategory;

export type ItemFiltrable = {
  /** Clave de React. */
  id: string;
  categoria: DestinationCategory;
  /** Ya renderizado en el servidor: este componente sólo decide si se muestra. */
  card: React.ReactNode;
};

/**
 * Pestañas de categoría sobre una rejilla ya renderizada.
 *
 * Lo usan `/destinos` y `/ofertas`, que piden las mismas cuatro pestañas
 * (`estructura-funcional-cliente.md` §6). Es un componente compartido y no una copia
 * en cada página porque el día que se añada una cuarta categoría hay un solo sitio
 * que tocar.
 *
 * Estado local y nada más: sin librería, sin llamadas al servidor y sin meter el
 * filtro en la URL. Son decenas de tarjetas ya renderizadas, así que filtrar es
 * esconder nodos; pedirlas otra vez sería más lento y más frágil.
 *
 * Las tarjetas llegan por props ya construidas (son Server Components con datos),
 * de modo que filtrar en cliente no obliga a que los datos crucen al navegador.
 */
export function FiltroCategoria({
  items,
  etiquetas,
  etiquetaGrupo,
  textoVacio,
  columnas = "tres",
}: {
  items: ItemFiltrable[];
  /** Texto de cada pestaña. El orden de las claves es el orden en pantalla. */
  etiquetas: Record<ValorFiltro, string>;
  /** Nombre accesible del grupo de botones. */
  etiquetaGrupo: string;
  textoVacio: string;
  /** La rejilla de ofertas respira mejor a dos columnas que a tres. */
  columnas?: "dos" | "tres";
}) {
  const [valor, setValor] = useState<ValorFiltro>("todos");

  const opciones = Object.entries(etiquetas) as [ValorFiltro, string][];
  const visibles = items.filter(
    (item) => valor === "todos" || item.categoria === valor,
  );

  return (
    <div className="flex flex-col gap-8">
      {/* `role="group"` y no tablist: no son pestañas ARIA, no hay paneles asociados. */}
      <div role="group" aria-label={etiquetaGrupo} className="flex flex-wrap gap-2">
        {opciones.map(([opcion, etiqueta]) => {
          const activo = valor === opcion;
          return (
            <button
              key={opcion}
              type="button"
              aria-pressed={activo}
              onClick={() => setValor(opcion)}
              className={cn(
                "text-body-sm inline-flex min-h-11 items-center rounded-full px-5 font-semibold",
                "transition-colors active:scale-[0.98]",
                activo
                  ? "bg-brand-navy text-white"
                  : "border border-neutral-300 text-neutral-700 hover:border-neutral-400",
              )}
            >
              {etiqueta}
            </button>
          );
        })}
      </div>

      {visibles.length === 0 ? (
        <p className="text-body-lg text-neutral-600">{textoVacio}</p>
      ) : (
        <div
          className={cn(
            "grid gap-6 md:grid-cols-2",
            columnas === "tres" && "lg:grid-cols-3",
          )}
        >
          {visibles.map((item) => (
            <div key={item.id}>{item.card}</div>
          ))}
        </div>
      )}
    </div>
  );
}
