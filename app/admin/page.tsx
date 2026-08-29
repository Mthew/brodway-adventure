import Link from "next/link";
import { redirect } from "next/navigation";

import { salir } from "@/app/admin/acciones";
import { getSupabaseAdmin, getUsuarioAdmin } from "@/lib/supabase/admin";

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
  searchParams: Promise<{ publicada?: string }>;
}) {
  const usuario = await getUsuarioAdmin();
  if (!usuario) redirect("/admin/entrar");

  const { publicada } = await searchParams;
  const supabase = await getSupabaseAdmin();

  const { data: ofertas } = await supabase
    .from("ofertas")
    .select("id, titulo, estado, vigencia_hasta, destinos(nombre)")
    .order("actualizado_el", { ascending: false })
    .limit(30);

  const borradores = (ofertas ?? []).filter((o) => o.estado === "borrador");
  const publicadas = (ofertas ?? []).filter((o) => o.estado !== "borrador");

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

      <section className="flex flex-col gap-3">
        <h2 className="text-h3 font-display">Publicadas</h2>
        {publicadas.length === 0 ? (
          <p className="text-body-sm text-neutral-600">
            Todavía no hay ninguna. La primera que publiques aparece aquí.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {publicadas.map((oferta) => (
              <li
                key={oferta.id}
                className="bg-surface-base flex min-h-16 flex-col justify-center gap-0.5 rounded-lg border border-neutral-200 px-4 py-3"
              >
                <span className="text-body font-display font-semibold">
                  {oferta.titulo}
                </span>
                <span className="text-caption text-neutral-600">
                  {(oferta.destinos as { nombre: string } | null)?.nombre} · vence el{" "}
                  {oferta.vigencia_hasta}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
