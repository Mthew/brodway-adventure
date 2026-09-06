"use client";

import { useActionState } from "react";

import { actualizarOferta } from "@/app/admin/acciones/ofertas";
import {
  Avance,
  BarraAccion,
  BotonPrincipal,
  Error as ErrorFormulario,
} from "@/app/admin/piezas";
import type { CamposOfertaValores } from "@/lib/admin/campos";

import { CamposOferta } from "../../campos";

import { SeccionAvanzada } from "./seccion-avanzada";

type Destino = { id: string; nombre: string };

export function FormularioEditarOferta({
  ofertaId,
  estadoOferta,
  destinos,
  valores,
}: {
  ofertaId: string;
  estadoOferta: "borrador" | "vigente" | "vencida";
  destinos: Destino[];
  valores: CamposOfertaValores;
}) {
  const [estado, accion, enviando] = useActionState(actualizarOferta, null);

  return (
    <form action={accion} className="flex min-h-svh flex-col">
      <input type="hidden" name="id" value={ofertaId} />
      <div className="flex flex-1 flex-col gap-5 px-5 pt-4 pb-6">
        {estadoOferta === "borrador" ? (
          <Avance paso={1} ofertaId={ofertaId} />
        ) : (
          <h1 className="text-h3 font-display">Editar oferta</h1>
        )}

        <ErrorFormulario mensaje={estado?.error} />

        <CamposOferta destinos={destinos} valores={valores} />
        <SeccionAvanzada valores={valores} />
      </div>

      <BarraAccion>
        <BotonPrincipal type="submit" disabled={enviando}>
          {enviando ? "Guardando…" : "Guardar cambios"}
        </BotonPrincipal>
      </BarraAccion>
    </form>
  );
}
