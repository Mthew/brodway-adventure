import { redirect } from "next/navigation";

import { getUsuarioAdmin } from "@/lib/supabase/admin";

import { FormularioRestablecer } from "./formulario";

/**
 * Paso final de la recuperación.
 *
 * Sólo se llega aquí con sesión: la deja `verifyOtp` en
 * `app/admin/auth/confirmar/route.ts`. Si el enlace venció o ya se usó, no hay
 * sesión, y esta misma guardia manda de vuelta a pedir uno nuevo.
 */
export default async function RestablecerPage() {
  const usuario = await getUsuarioAdmin();
  if (!usuario) redirect("/admin/entrar?error=enlace_invalido");

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-5 py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-h2 font-display">Nueva contraseña</h1>
          <p className="text-body text-neutral-600">
            Elige una contraseña de al menos 8 caracteres.
          </p>
        </div>

        <FormularioRestablecer />
      </div>
    </main>
  );
}
