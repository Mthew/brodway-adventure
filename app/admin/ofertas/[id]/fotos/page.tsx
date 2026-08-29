import Image from "next/image";
import { notFound, redirect } from "next/navigation";

import { eliminarImagen } from "@/app/admin/acciones";
import { Avance, BarraAccion } from "@/app/admin/piezas";
import { getSupabaseAdmin, getUsuarioAdmin } from "@/lib/supabase/admin";

import { SeguirASecciones, SubirFotos } from "./subir";

/**
 * Paso 2: fotos.
 *
 * La primera de la lista es la que sale en las tarjetas del sitio, y se dice
 * explícitamente en pantalla: es el dato que más se aprende por sorpresa cuando falta.
 */
export default async function FotosPage({
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
    .select("id, titulo, slug")
    .eq("id", id)
    .maybeSingle();

  if (!oferta) notFound();

  const { data: imagenes } = await supabase
    .from("imagenes")
    .select("id, url, orden")
    .eq("oferta_id", id)
    .order("orden");

  const fotos = imagenes ?? [];

  return (
    <div className="flex min-h-svh flex-col">
      <div className="flex flex-1 flex-col gap-5 px-5 pt-4 pb-6">
        <Avance paso={2} ofertaId={id} />

        <div className="flex flex-col gap-1">
          <h1 className="text-h3 font-display">{oferta.titulo}</h1>
          <p className="text-body-sm text-neutral-600">
            La primera foto es la que se ve en las tarjetas del sitio.
          </p>
        </div>

        <SubirFotos ofertaId={id} slug={oferta.slug} desde={fotos.length} />

        {fotos.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {fotos.map((foto, i) => (
              <li
                key={foto.id}
                className="bg-surface-base flex items-center gap-3 rounded-lg border border-neutral-200 p-3"
              >
                <div className="relative size-20 shrink-0 overflow-hidden rounded bg-neutral-100">
                  <Image
                    src={foto.url}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <span className="text-body-sm flex-1 font-display font-semibold">
                  {i === 0 ? "Portada" : `Foto ${i + 1}`}
                </span>
                <form action={eliminarImagen}>
                  <input type="hidden" name="imagen_id" value={foto.id} />
                  <input type="hidden" name="oferta_id" value={id} />
                  <button
                    type="submit"
                    className="text-body-sm inline-flex min-h-11 items-center px-2 font-semibold text-red-700"
                  >
                    Quitar
                  </button>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body-sm text-neutral-600">
            Todavía no hay fotos. Se necesita al menos una para publicar.
          </p>
        )}
      </div>

      <BarraAccion>
        <SeguirASecciones ofertaId={id} />
      </BarraAccion>
    </div>
  );
}
