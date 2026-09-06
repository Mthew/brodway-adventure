"use client";

import Link from "next/link";
import { useActionState } from "react";

import { olvideClave } from "@/app/admin/acciones/sesion";
import {
  BotonPrincipal,
  Campo,
  ENTRADA,
  Error as ErrorFormulario,
} from "@/app/admin/piezas";

/** Pide el correo para enviar el enlace de recuperación. Ver `acciones.ts:olvideClave`. */
export default function OlvidePage() {
  const [estado, accion, enviando] = useActionState(olvideClave, null);
  const enviado = !!estado && "enviado" in estado;
  const error = estado && "error" in estado ? estado.error : undefined;

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-5 py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-h2 font-display">Recuperar acceso</h1>
          <p className="text-body text-neutral-600">
            Escribe tu correo y te enviamos un enlace para poner una contraseña nueva.
          </p>
        </div>

        {enviado ? (
          <p
            role="status"
            className="text-body-sm rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-900"
          >
            Si ese correo tiene una cuenta, llegó un enlace. Revisa tu bandeja de entrada.
          </p>
        ) : (
          <form action={accion} className="flex flex-col gap-4">
            <ErrorFormulario mensaje={error} />

            <Campo etiqueta="Correo">
              <input
                name="correo"
                type="email"
                required
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                inputMode="email"
                className={ENTRADA}
              />
            </Campo>

            <BotonPrincipal type="submit" disabled={enviando}>
              {enviando ? "Enviando…" : "Enviar enlace"}
            </BotonPrincipal>
          </form>
        )}

        <Link
          href="/admin/entrar"
          className="text-body-sm text-brand-turquoise-text text-center font-semibold"
        >
          Volver a entrar
        </Link>
      </div>
    </main>
  );
}
