import Link from "next/link";
import { redirect } from "next/navigation";

import { salir } from "@/app/admin/acciones/sesion";
import { getSupabaseAdmin, getUsuarioAdmin } from "@/lib/supabase/admin";

type FilaOferta = {
  id: string;
  titulo: string;
  estado: string;
  vigencia_hasta: string;
  destinos: { nombre: string } | null;
};

/**
 * Entrada del panel.
 *
 * No es el asistente: es el sitio desde donde se arranca uno y donde se retoman los
 * borradores a medias. Con diez personas repartiéndose la carga, ver los borradores
 * ajenos es lo que evita que dos transcriban el mismo flyer.
 */
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    publicada?: string;
    actualizada?: string;
    clave_actualizada?: string;
  }>;
}) {
  const usuario = await getUsuarioAdmin();
  if (!usuario) redirect("/admin/entrar");

  const { publicada, actualizada, clave_actualizada } = await searchParams;
  const supabase = await getSupabaseAdmin();

  const { data: ofertas } = await supabase
    .from("ofertas")
    .select("id, titulo, estado, vigencia_hasta, destinos(nombre)")
    .order("actualizado_el", { ascending: false })
    .limit(30);

  const borradores = (ofertas ?? []).filter((o) => o.estado === "borrador");
  const noBorrador = (ofertas ?? []).filter((o) => o.estado !== "borrador");

  /*
   * Agrupación de vigencia (§27 del cliente: una tarifa vencida tiene que "ser
   * identificada para revisión administrativa", no vivir en un filtro escondido).
   * Comparación directa sobre las columnas de la fila, sin pasar por `isExpired` de
   * `lib/types/offer.ts`: ese helper trabaja sobre el `Offer` de dominio en
   * camelCase, y construir uno completo aquí sólo para dos comparaciones de fecha no
   * vale la pena — tres líneas de fecha están bien duplicadas.
   */
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
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-h2 font-display">Panel</h1>
          <p className="text-caption text-neutral-600">{usuario.email}</p>
        </div>
        <form action={salir}>
          <button
            type="submit"
            className="text-body-sm text-brand-turquoise-text inline-flex min-h-11 items-center font-semibold"
          >
            Salir
          </button>
        </form>
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

      {clave_actualizada ? (
        <p
          role="status"
          className="text-body-sm rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-900"
        >
          Contraseña actualizada.
        </p>
      ) : null}

      <Link
        href="/admin/ofertas/nueva"
        className="bg-brand-orange text-body font-display flex h-14 items-center justify-center rounded-lg font-semibold text-white active:scale-[0.99]"
      >
        Cargar una oferta nueva
      </Link>

      <Link
        href="/admin/destinos"
        className="text-body-sm text-brand-turquoise-text self-center font-semibold"
      >
        Gestionar destinos
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
