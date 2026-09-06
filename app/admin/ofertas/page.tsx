import Link from "next/link";
import { redirect } from "next/navigation";

import { getSupabaseAdmin, getUsuarioAdmin } from "@/lib/supabase/admin";

type FilaOferta = {
  id: string;
  titulo: string;
  estado: string;
  vigencia_hasta: string;
  destinos: { nombre: string } | null;
};

/**
 * Listado completo de ofertas, agrupado por vigencia.
 *
 * Vivía en `/admin` (el panel era esta lista). Se mudó aquí cuando el panel pasó a
 * ser un dashboard de estadísticas: la lista sigue existiendo entera, sólo que ya no
 * es lo primero que se ve al entrar.
 */
export default async function ListaOfertasPage({
  searchParams,
}: {
  searchParams: Promise<{ publicada?: string; actualizada?: string }>;
}) {
  const usuario = await getUsuarioAdmin();
  if (!usuario) redirect("/admin/entrar");

  const { publicada, actualizada } = await searchParams;
  const supabase = await getSupabaseAdmin();

  const { data: ofertas } = await supabase
    .from("ofertas")
    .select("id, titulo, estado, vigencia_hasta, destinos(nombre)")
    .order("actualizado_el", { ascending: false })
    .limit(30);

  const borradores = (ofertas ?? []).filter((o) => o.estado === "borrador");
  const noBorrador = (ofertas ?? []).filter((o) => o.estado !== "borrador");

  const hoy = new Date().toISOString().slice(0, 10);
  const en15Dias = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const vencidas = noBorrador.filter(
    (o) => o.estado === "vencida" || o.vigencia_hasta < hoy,
  );
  const porVencer = noBorrador.filter(
    (o) => o.estado === "vigente" && o.vigencia_hasta >= hoy && o.vigencia_hasta <= en15Dias,
  );
  const vigentes = noBorrador.filter(
    (o) => o.estado === "vigente" && o.vigencia_hasta > en15Dias,
  );

  return (
    <main className="mx-auto flex max-w-md flex-col gap-8 px-5 py-8">
      <header>
        <h1 className="text-h2 font-display">Ofertas</h1>
      </header>

      {publicada ? (
        <p
          role="status"
          className="text-body-sm rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-900"
        >
          Publicada. Ya se ve en el sitio.
        </p>
      ) : null}

      {actualizada ? (
        <p
          role="status"
          className="text-body-sm rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-900"
        >
          Guardado. El cambio ya se ve en el sitio.
        </p>
      ) : null}

      <Link
        href="/admin/ofertas/nueva"
        className="bg-brand-orange text-body font-display flex h-14 items-center justify-center rounded-lg font-semibold text-white active:scale-[0.99]"
      >
        Cargar una oferta nueva
      </Link>

      {borradores.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-h3 font-display">Sin terminar</h2>
          {/* Los borradores van primero y separados: son trabajo empezado que alguien
              tiene que retomar, no catálogo. */}
          <ul className="flex flex-col gap-2">
            {borradores.map((oferta) => (
              <li key={oferta.id}>
                <Link
                  href={`/admin/ofertas/${oferta.id}/fotos`}
                  className="bg-surface-base flex min-h-16 flex-col justify-center gap-0.5 rounded-lg border border-neutral-200 px-4 py-3"
                >
                  <span className="text-body font-display font-semibold">
                    {oferta.titulo}
                  </span>
                  <span className="text-caption text-neutral-600">
                    {(oferta.destinos as { nombre: string } | null)?.nombre} · borrador
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <ListaVigencia
        titulo="Por vencer"
        ayuda="15 días o menos."
        ofertas={porVencer}
        vacia={null}
      />

      <ListaVigencia
        titulo="Vigentes"
        ofertas={vigentes}
        vacia="Todavía no hay ninguna. La primera que publiques aparece aquí."
      />

      <ListaVigencia titulo="Vencidas" ofertas={vencidas} vacia={null} />
    </main>
  );
}

/** Una sección de ofertas agrupadas por vigencia. Sin filas: se omite si no aplica. */
function ListaVigencia({
  titulo,
  ayuda,
  ofertas,
  vacia,
}: {
  titulo: string;
  ayuda?: string;
  ofertas: FilaOferta[];
  /** Mensaje cuando la lista está vacía. `null` = no mostrar la sección. */
  vacia: string | null;
}) {
  if (ofertas.length === 0 && vacia === null) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-h3 font-display">{titulo}</h2>
        {ayuda ? <p className="text-caption text-neutral-600">{ayuda}</p> : null}
      </div>
      {ofertas.length === 0 ? (
        <p className="text-body-sm text-neutral-600">{vacia}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {ofertas.map((oferta) => (
            <li key={oferta.id}>
              <Link
                href={`/admin/ofertas/${oferta.id}/editar`}
                className="bg-surface-base flex min-h-16 flex-col justify-center gap-0.5 rounded-lg border border-neutral-200 px-4 py-3"
              >
                <span className="text-body font-display font-semibold">{oferta.titulo}</span>
                <span className="text-caption text-neutral-600">
                  {oferta.destinos?.nombre} · vence el {oferta.vigencia_hasta}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
