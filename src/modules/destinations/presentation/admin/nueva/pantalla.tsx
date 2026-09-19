import { redirect } from "next/navigation";

import { getUsuarioAdmin } from "@/lib/supabase/admin";

import { FormularioNuevoDestino } from "./formulario";

/**
 * Extraído de `app/admin/destinos/nueva/page.tsx` (N-01.0b): esa ruta ahora sólo
 * importa y renderiza `NuevoDestino`.
 */
export default async function NuevoDestino() {
  const usuario = await getUsuarioAdmin();
  if (!usuario) redirect("/admin/entrar");

  return <FormularioNuevoDestino />;
}
