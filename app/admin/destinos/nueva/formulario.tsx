"use client";

import { useActionState } from "react";

import { crearDestino } from "@/app/admin/acciones/destinos";
import {
  BarraAccion,
  BotonPrincipal,
  Error as ErrorFormulario,
} from "@/app/admin/piezas";
import { CamposDestino } from "@/app/admin/destinos/campos";

export function FormularioNuevoDestino() {
  const [estado, accion, enviando] = useActionState(crearDestino, null);

  return (
    <form action={accion} className="flex min-h-svh flex-col">
      <div className="flex flex-1 flex-col gap-5 px-5 pt-4 pb-6">
        <h1 className="text-h3 font-display">Crear destino</h1>

        <ErrorFormulario mensaje={estado?.error} />

        <CamposDestino />
      </div>

      <BarraAccion>
        <BotonPrincipal type="submit" disabled={enviando}>
          {enviando ? "Guardando…" : "Crear destino"}
        </BotonPrincipal>
      </BarraAccion>
    </form>
  );
}
