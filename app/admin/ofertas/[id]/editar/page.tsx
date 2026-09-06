import { notFound, redirect } from "next/navigation";

import { reactivarOferta, vencerOferta } from "@/app/admin/acciones/ofertas";
import { Error as ErrorMensaje } from "@/app/admin/piezas";
import { getSupabaseAdmin, getUsuarioAdmin } from "@/lib/supabase/admin";

import { FormularioEditarOferta } from "./formulario";

/**
 * Editar una oferta que ya existe, sea borrador, vigente o vencida.
 *
 * También es el destino real del primer paso del asistente ("Volver a Editar" en
 * `Avance`, `app/admin/piezas.tsx`): antes apuntaba a una ruta que nunca existió
 * (`/admin/ofertas/{id}`, sin `page.tsx`) y daba 404 desde los pasos 2 a 4.
 */
export default async function EditarOfertaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ vencida?: string; reactivada?: string; error?: string }>;
}) {
  const usuario = await getUsuarioAdmin();
  if (!usuario) redirect("/admin/entrar");

  const { id } = await params;
  const { vencida, reactivada, error } = await searchParams;
  const supabase = await getSupabaseAdmin();

  const { data: oferta } = await supabase
    .from("ofertas")
    .select(
      "id, titulo, destino_id, beneficio_corto, precio_desde, ciudad_origen, ocupacion_base, noches, hotel, alimentacion, fecha_periodo, vigencia_desde, vigencia_hasta, incluye, no_incluye, estado, mayorista, notas_internas, informacion_importante, requisitos, documentacion, politica_cancelacion",
    )
    .eq("id", id)
    .maybeSingle();

  if (!oferta) notFound();

  const { data: destinos } = await supabase
    .from("destinos")
    .select("id, nombre")
    .order("nombre");

  const mensajeError =
    error === "vigencia_vencida"
      ? "Esta oferta venció por fecha. Actualiza la vigencia antes de reactivarla."
      : undefined;

  return (
    <>
      <div className="flex flex-col gap-3 px-5 pt-4">
        {vencida ? (
          <p
            role="status"
            className="text-body-sm rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-900"
          >
            Se venció. Ya no se ve en el sitio.
          </p>
        ) : null}
        {reactivada ? (
          <p
            role="status"
            className="text-body-sm rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-900"
          >
            Reactivada. Vuelve a verse en el sitio.
          </p>
        ) : null}
        <ErrorMensaje mensaje={mensajeError} />

        {/*
          Zona de vigencia: sólo para una oferta que ya salió del asistente. Vencer
          es la confirmación misma —color y copy inequívocos, sin diálogo de
          JavaScript— consistente con que "Quitar" una foto tampoco lo pide.
        */}
        {oferta.estado !== "borrador" ? (
          <div className="flex flex-col gap-2 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-body-sm font-display font-semibold text-red-900">
              Zona de vigencia
            </p>
            {oferta.estado === "vigente" ? (
              <form action={vencerOferta} className="flex flex-col gap-1">
                <input type="hidden" name="id" value={id} />
                <button
                  type="submit"
                  className="text-body-sm inline-flex min-h-11 items-center self-start font-semibold text-red-700 underline"
                >
                  Vencer esta oferta ahora
                </button>
                <p className="text-caption text-red-800">
                  Deja de verse en el sitio de inmediato.
                </p>
              </form>
            ) : (
              <form action={reactivarOferta} className="flex flex-col gap-1">
                <input type="hidden" name="id" value={id} />
                <button
                  type="submit"
                  className="text-body-sm inline-flex min-h-11 items-center self-start font-semibold text-red-700 underline"
                >
                  Reactivar
                </button>
                <p className="text-caption text-red-800">
                  Vuelve a verse en el sitio si su vigencia sigue vigente.
                </p>
              </form>
            )}
          </div>
        ) : null}
      </div>

      <FormularioEditarOferta
        ofertaId={id}
        estadoOferta={oferta.estado}
        destinos={destinos ?? []}
        valores={{
          titulo: oferta.titulo,
          destinoId: oferta.destino_id,
          beneficioCorto: oferta.beneficio_corto,
          precioDesde: oferta.precio_desde,
          ciudadOrigen: oferta.ciudad_origen,
          ocupacionBase: oferta.ocupacion_base,
          noches: oferta.noches,
          hotel: oferta.hotel,
          alimentacion: oferta.alimentacion,
          fechaPeriodo: oferta.fecha_periodo,
          vigenciaDesde: oferta.vigencia_desde,
          vigenciaHasta: oferta.vigencia_hasta,
          incluye: oferta.incluye,
          noIncluye: oferta.no_incluye,
          mayorista: oferta.mayorista,
          notasInternas: oferta.notas_internas,
          informacionImportante: oferta.informacion_importante,
          requisitos: oferta.requisitos,
          documentacion: oferta.documentacion,
          politicaCancelacion: oferta.politica_cancelacion,
        }}
      />
    </>
  );
}
