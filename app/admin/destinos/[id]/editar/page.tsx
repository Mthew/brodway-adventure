import { notFound, redirect } from "next/navigation";

import { getSupabaseAdmin, getUsuarioAdmin } from "@/lib/supabase/admin";

import { FormularioEditarDestino } from "./formulario";
import { SubirImagenDestino } from "./subir-imagen";

/**
 * Editar un destino. No es un asistente de pasos: dos widgets independientes en la
 * misma pantalla (foto y campos de texto), cada uno con su propio guardado — igual
 * que `SubirFotos` vive fuera del `<form>` de `publicar` en el asistente de ofertas.
 */
export default async function EditarDestinoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ creado?: string }>;
}) {
  const usuario = await getUsuarioAdmin();
  if (!usuario) redirect("/admin/entrar");

  const { id } = await params;
  const { creado } = await searchParams;
  const supabase = await getSupabaseAdmin();

  const { data: destino } = await supabase
    .from("destinos")
    .select("id, slug, nombre, tipo, resumen, destacado_en_home, estado, imagen, imagen_hero")
    .eq("id", id)
    .maybeSingle();

  if (!destino) notFound();

  return (
    <div className="flex min-h-svh flex-col">
      <div className="flex flex-col gap-4 px-5 pt-4">
        {creado ? (
          <p
            role="status"
            className="text-body-sm rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-900"
          >
            Destino creado. Sube las dos fotos para poder activarlo.
          </p>
        ) : null}

        <h1 className="text-h3 font-display">Editar destino</h1>

        <SubirImagenDestino
          destinoId={id}
          slug={destino.slug}
          campo="imagen"
          valorActual={destino.imagen}
        />
        <SubirImagenDestino
          destinoId={id}
          slug={destino.slug}
          campo="imagen_hero"
          valorActual={destino.imagen_hero}
        />
      </div>

      <FormularioEditarDestino
        destinoId={id}
        valores={{
          nombre: destino.nombre,
          tipo: destino.tipo,
          resumen: destino.resumen,
          destacadoEnHome: destino.destacado_en_home,
          estado: destino.estado,
        }}
      />
    </div>
  );
}
