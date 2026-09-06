import { redirect } from "next/navigation";

import { FormularioNuevaOferta } from "./formulario";
import { getSupabaseAdmin, getUsuarioAdmin } from "@/lib/supabase/admin";

/**
 * Paso 1 del asistente.
 *
 * Los destinos se cargan en el servidor y se pasan al formulario: son ocho, no hace
 * falta un buscador ni una llamada desde el navegador.
 */
export default async function NuevaOfertaPage() {
  const usuario = await getUsuarioAdmin();
  if (!usuario) redirect("/admin/entrar");

  const supabase = await getSupabaseAdmin();
  const { data: destinos } = await supabase
    .from("destinos")
    .select("id, nombre")
    .order("nombre");

  return <FormularioNuevaOferta destinos={destinos ?? []} />;
}
