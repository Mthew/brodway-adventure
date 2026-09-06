import { redirect } from "next/navigation";

import { getUsuarioAdmin } from "@/lib/supabase/admin";

import { FormularioNuevoDestino } from "./formulario";

export default async function NuevoDestinoPage() {
  const usuario = await getUsuarioAdmin();
  if (!usuario) redirect("/admin/entrar");

  return <FormularioNuevoDestino />;
}
