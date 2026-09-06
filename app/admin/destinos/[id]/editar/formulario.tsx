"use client";

import { useActionState } from "react";

import { actualizarDestino } from "@/app/admin/acciones/destinos";
import { CamposDestino } from "@/app/admin/destinos/campos";
import {
  BarraAccion,
  BotonPrincipal,
  Error as ErrorFormulario,
} from "@/app/admin/piezas";
import type { CamposDestinoValores } from "@/lib/admin/campos";

export function FormularioEditarDestino({
  destinoId,
  valores,
}: {
  destinoId: string;
  valores: CamposDestinoValores;
}) {
  const [estado, accion, enviando] = useActionState(actualizarDestino, null);

  return (
    <form action={accion} className="flex flex-1 flex-col">
      <input type="hidden" name="id" value={destinoId} />

      <div className="flex flex-1 flex-col gap-5 px-5 pb-6">
        <ErrorFormulario mensaje={estado?.error} />
        <CamposDestino valores={valores} />
      </div>

      <BarraAccion>
        <BotonPrincipal type="submit" disabled={enviando}>
          {enviando ? "Guardando…" : "Guardar cambios"}
        </BotonPrincipal>
      </BarraAccion>
    </form>
  );
}
