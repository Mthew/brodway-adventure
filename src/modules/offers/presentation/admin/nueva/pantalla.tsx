import { redirect } from "next/navigation";

import { getSupabaseAdmin, getUsuarioAdmin } from "@/lib/supabase/admin";

import { FormularioNuevaOferta } from "./formulario";

/**
 * Paso 1 del asistente.
 *
 * Los destinos se cargan en el servidor y se pasan al formulario: son ocho, no hace
 * falta un buscador ni una llamada desde el navegador.
 *
 * Extraído de `app/admin/ofertas/nueva/page.tsx` (N-01.0b): esa ruta ahora sólo
 * importa y renderiza `NuevaOferta`.
 */
export default async function NuevaOferta() {
  const usuario = await getUsuarioAdmin();
  if (!usuario) redirect("/admin/entrar");

  const supabase = await getSupabaseAdmin();
  const { data: destinos } = await supabase
    .from("destinos")
    .select("id, nombre")
    .order("nombre");

  return <FormularioNuevaOferta destinos={destinos ?? []} />;
}
