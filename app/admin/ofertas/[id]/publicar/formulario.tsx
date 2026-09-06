"use client";

import { useActionState } from "react";

import { publicar } from "@/app/admin/acciones/ofertas";
import {
  BarraAccion,
  BotonPrincipal,
  Error as ErrorFormulario,
} from "@/app/admin/piezas";

export function FormularioPublicar({
  ofertaId,
  puedePublicar,
}: {
  ofertaId: string;
  puedePublicar: boolean;
}) {
  const [estado, accion, enviando] = useActionState(publicar, null);

  return (
    <form action={accion}>
      <input type="hidden" name="id" value={ofertaId} />
      <div className="px-5 pb-4">
        <ErrorFormulario mensaje={estado?.error} />
      </div>
      <BarraAccion>
        <BotonPrincipal type="submit" disabled={enviando || !puedePublicar}>
          {enviando ? "Publicando…" : "Publicar en el sitio"}
        </BotonPrincipal>
      </BarraAccion>
    </form>
  );
}
