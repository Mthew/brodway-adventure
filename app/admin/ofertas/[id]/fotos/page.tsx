import Image from "next/image";
import { notFound, redirect } from "next/navigation";

import {
  eliminarImagen,
  guardarAlt,
  moverImagen,
  usarComoPortada,
} from "@/app/admin/acciones/imagenes";
import { Avance, BarraAccion, ENTRADA } from "@/app/admin/piezas";
import { sugerirAlt } from "@/lib/admin/imagenes";
import { getSupabaseAdmin, getUsuarioAdmin } from "@/lib/supabase/admin";

import { SeguirASecciones, SubirFotos } from "./subir";

/**
 * Paso 2: fotos.
 *
 * La primera de la lista es la que sale en las tarjetas del sitio, y se dice
 * explícitamente en pantalla. No hay columna de portada dedicada
 * (`plan-backoffice.md` Fase 3): "Usar como portada" mueve la foto a `orden` 0.
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
    .select("id, titulo, slug, hotel, destinos(nombre)")
    .eq("id", id)
    .maybeSingle();

  if (!oferta) notFound();

  const { data: imagenes } = await supabase
    .from("imagenes")
    .select("id, url, orden, alt")
    .eq("oferta_id", id)
    .order("orden");

  const fotos = imagenes ?? [];
  const sugerencia = sugerirAlt({
    destino: oferta.destinos?.nombre ?? "",
    hotel: oferta.hotel,
  });

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
                className="bg-surface-base flex flex-col gap-3 rounded-lg border border-neutral-200 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded bg-neutral-100">
                    <Image
                      src={foto.url}
                      alt={foto.alt ?? ""}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-body-sm flex-1 font-display font-semibold">
                    {i === 0 ? "Portada" : `Foto ${i + 1}`}
                  </span>
                  <form action={moverImagen}>
                    <input type="hidden" name="imagen_id" value={foto.id} />
                    <input type="hidden" name="oferta_id" value={id} />
                    <input type="hidden" name="direccion" value="arriba" />
                    <button
                      type="submit"
                      disabled={i === 0}
                      aria-label={`Subir ${i === 0 ? "Portada" : `foto ${i + 1}`}`}
                      className="text-body inline-flex min-h-11 min-w-11 items-center justify-center font-semibold text-neutral-700 disabled:text-neutral-300"
                    >
                      ↑
                    </button>
                  </form>
                  <form action={moverImagen}>
                    <input type="hidden" name="imagen_id" value={foto.id} />
                    <input type="hidden" name="oferta_id" value={id} />
                    <input type="hidden" name="direccion" value="abajo" />
                    <button
                      type="submit"
                      disabled={i === fotos.length - 1}
                      aria-label={`Bajar ${i === 0 ? "Portada" : `foto ${i + 1}`}`}
                      className="text-body inline-flex min-h-11 min-w-11 items-center justify-center font-semibold text-neutral-700 disabled:text-neutral-300"
                    >
                      ↓
                    </button>
                  </form>
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
                </div>

                <div className="flex items-center gap-2">
                  <form action={guardarAlt} className="flex flex-1 items-center gap-2">
                    <input type="hidden" name="imagen_id" value={foto.id} />
                    <input type="hidden" name="oferta_id" value={id} />
                    <label className="sr-only" htmlFor={`alt-${foto.id}`}>
                      Texto alternativo de la foto {i + 1}
                    </label>
                    <input
                      id={`alt-${foto.id}`}
                      type="text"
                      name="alt"
                      defaultValue={foto.alt ?? sugerencia}
                      placeholder={sugerencia}
                      className={ENTRADA}
                    />
                    <button
                      type="submit"
                      className="text-body-sm inline-flex min-h-11 items-center px-2 font-semibold text-brand-turquoise-text"
                    >
                      Guardar
                    </button>
                  </form>

                  {i !== 0 ? (
                    <form action={usarComoPortada}>
                      <input type="hidden" name="imagen_id" value={foto.id} />
                      <input type="hidden" name="oferta_id" value={id} />
                      <button
                        type="submit"
                        className="text-body-sm inline-flex min-h-11 items-center px-2 font-semibold text-neutral-700"
                      >
                        Usar como portada
                      </button>
                    </form>
                  ) : null}
                </div>
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
