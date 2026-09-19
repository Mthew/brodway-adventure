import { notFound, redirect } from "next/navigation";

import { getSupabaseAdmin, getUsuarioAdmin } from "@/lib/supabase/admin";

import { FormularioSecciones } from "./formulario";

/**
 * Extraído de `app/admin/ofertas/[id]/secciones/page.tsx` (N-01.0b): esa ruta ahora
 * sólo importa y renderiza `SeccionesOferta`.
 */
export default async function SeccionesOferta({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const usuario = await getUsuarioAdmin();
  if (!usuario) redirect("/admin/entrar");

  const { id } = await params;
  const supabase = await getSupabaseAdmin();

  const { data: oferta } = await supabase
    .from("ofertas")
    .select(
      "id, titulo, mostrar_en_mejores_ofertas, mostrar_en_playas_y_hoteles, mostrar_en_home, orden",
    )
    .eq("id", id)
    .maybeSingle();

  if (!oferta) notFound();

  return <FormularioSecciones oferta={oferta} />;
}
