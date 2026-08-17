"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import type { DestinationCategory } from "@/lib/types/destination";

type Tipo = "todos" | DestinationCategory;

/**
 * Filtro del listado de destinos.
 *
 * Estado local y nada más: sin librería, sin llamadas al servidor y sin meter el
 * filtro en la URL. Son seis destinos ya renderizados en el servidor, así que
 * filtrar es esconder nodos; pedirlos otra vez sería más lento y más frágil.
 *
 * Las tarjetas llegan por `children` ya renderizadas (son Server Components con
 * datos), y este componente sólo decide cuáles se muestran.
 */
export function FiltroDestinos({
  items,
}: {
  items: { slug: string; tipo: DestinationCategory; card: React.ReactNode }[];
}) {
  const t = useTranslations("destinos");
  const [tipo, setTipo] = useState<Tipo>("todos");

  const opciones: { valor: Tipo; etiqueta: string }[] = [
    { valor: "todos", etiqueta: t("filtroTodos") },
    { valor: "nacional", etiqueta: t("filtroNacionales") },
    { valor: "internacional", etiqueta: t("filtroInternacionales") },
    { valor: "pueblos-de-antioquia", etiqueta: t("filtroPueblosAntioquia") },
  ];

  const visibles = items.filter(
    (item) => tipo === "todos" || item.tipo === tipo,
  );

  return (
    <div className="flex flex-col gap-8">
      {/* `role="group"` y no tablist: no son pestañas, no hay paneles asociados. */}
      <div
        role="group"
        aria-label={t("filtroEtiqueta")}
        className="flex flex-wrap gap-2"
      >
        {opciones.map((opcion) => {
          const activo = tipo === opcion.valor;
          return (
            <button
              key={opcion.valor}
              type="button"
              aria-pressed={activo}
              onClick={() => setTipo(opcion.valor)}
              className={cn(
                "text-body-sm inline-flex min-h-11 items-center rounded-full px-5 font-semibold",
                "transition-colors active:scale-[0.98]",
                activo
                  ? "bg-brand-navy text-white"
                  : "border border-neutral-300 text-neutral-700 hover:border-neutral-400",
              )}
            >
              {opcion.etiqueta}
            </button>
          );
        })}
      </div>

      {visibles.length === 0 ? (
        <p className="text-body-lg text-neutral-600">{t("sinResultados")}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibles.map((item) => (
            <div key={item.slug}>{item.card}</div>
          ))}
        </div>
      )}
    </div>
  );
}
