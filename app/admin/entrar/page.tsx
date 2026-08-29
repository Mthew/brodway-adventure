"use client";

import { useActionState } from "react";

import { entrar } from "@/app/admin/acciones";
import {
  BotonPrincipal,
  Campo,
  ENTRADA,
  Error as ErrorFormulario,
} from "@/app/admin/piezas";

/**
 * Entrada al panel.
 *
 * Sin recuperación de contraseña todavía: con diez personas y correo/contraseña, quien
 * administra la cuenta de Supabase restablece desde el panel de Supabase. Añadirla es
 * de las primeras cosas que pedirá el equipo.
 */
export default function EntrarPage() {
  const [estado, accion, enviando] = useActionState(entrar, null);

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-5 py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-h2 font-display">Panel de BroWay</h1>
          <p className="text-body text-neutral-600">
            Entra para cargar y publicar ofertas.
          </p>
        </div>

        <form action={accion} className="flex flex-col gap-4">
          <ErrorFormulario mensaje={estado?.error} />

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
        </form>
      </div>
    </main>
  );
}
