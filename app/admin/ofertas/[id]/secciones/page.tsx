import { notFound, redirect } from "next/navigation";

import { getSupabaseAdmin, getUsuarioAdmin } from "@/lib/supabase/admin";

import { FormularioSecciones } from "./formulario";

export default async function SeccionesPage({
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
