"use client";

import { useActionState } from "react";

import { restablecerClave } from "@/app/admin/acciones/sesion";
import {
  BotonPrincipal,
  Campo,
  ENTRADA,
  Error as ErrorFormulario,
} from "@/app/admin/piezas";

export function FormularioRestablecer() {
  const [estado, accion, enviando] = useActionState(restablecerClave, null);

  return (
    <form action={accion} className="flex flex-col gap-4">
      <ErrorFormulario mensaje={estado?.error} />

      <Campo etiqueta="Contraseña nueva">
        <input
          name="clave"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={ENTRADA}
        />
      </Campo>

      <Campo etiqueta="Confírmala">
        <input
          name="confirmacion"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={ENTRADA}
        />
      </Campo>

      <BotonPrincipal type="submit" disabled={enviando}>
        {enviando ? "Guardando…" : "Guardar contraseña"}
      </BotonPrincipal>
    </form>
  );
}
