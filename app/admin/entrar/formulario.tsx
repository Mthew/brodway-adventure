"use client";

import Link from "next/link";
import { useActionState } from "react";

import { entrar } from "@/app/admin/acciones/sesion";
import {
  BotonPrincipal,
  Campo,
  ENTRADA,
  Error as ErrorFormulario,
} from "@/app/admin/piezas";

export function FormularioEntrar({ errorEnlace }: { errorEnlace?: string }) {
  const [estado, accion, enviando] = useActionState(entrar, null);

  return (
    <form action={accion} className="flex flex-col gap-4">
      <ErrorFormulario mensaje={estado?.error ?? errorEnlace} />

      <Campo etiqueta="Correo">
        <input
          name="correo"
          type="email"
          required
          autoComplete="username"
          /* Sin autocapitalize ni autocorrect: en móvil convierten un correo en
             "Juan@Agencia.Com" y el login falla sin decir por qué. */
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          inputMode="email"
          className={ENTRADA}
        />
      </Campo>

      <Campo etiqueta="Contraseña">
        <input
          name="clave"
          type="password"
          required
          autoComplete="current-password"
          className={ENTRADA}
        />
      </Campo>

      <BotonPrincipal type="submit" disabled={enviando}>
        {enviando ? "Entrando…" : "Entrar"}
      </BotonPrincipal>

      <Link
        href="/admin/olvide"
        className="text-body-sm text-brand-turquoise-text text-center font-semibold"
      >
        ¿Olvidaste tu contraseña?
      </Link>
    </form>
  );
}
