import Link from "next/link";
import { redirect } from "next/navigation";

import { moverDestino } from "@/app/admin/acciones/destinos";
import { getSupabaseAdmin, getUsuarioAdmin } from "@/lib/supabase/admin";
import type { DestinationCategory } from "@/lib/types/destination";

type FilaDestino = {
  id: string;
  nombre: string;
  tipo: DestinationCategory;
  estado: string;
};

const CATEGORIAS: { tipo: DestinationCategory; etiqueta: string }[] = [
  { tipo: "nacional", etiqueta: "Nacional" },
  { tipo: "internacional", etiqueta: "Internacional" },
  { tipo: "pueblos-de-antioquia", etiqueta: "Pueblos de Antioquia" },
];

/**
 * Listado de destinos, agrupado por categoría.
 *
 * Incluye activos e inactivos: el admin necesita ver y reactivar los que desactivó,
 * no solo los que ya se ven en el sitio.
 */
export default async function DestinosPage({
  searchParams,
}: {
  searchParams: Promise<{ actualizado?: string }>;
}) {
  const usuario = await getUsuarioAdmin();
  if (!usuario) redirect("/admin/entrar");

  const { actualizado } = await searchParams;
  const supabase = await getSupabaseAdmin();

  const { data: destinos } = await supabase
    .from("destinos")
    .select("id, nombre, tipo, estado")
    .order("orden");

  return (
    <main className="mx-auto flex max-w-md flex-col gap-8 px-5 py-8">
      <header className="flex items-start justify-between gap-4">
        <h1 className="text-h2 font-display">Destinos</h1>
        <Link
          href="/admin"
          className="text-body-sm text-brand-turquoise-text inline-flex min-h-11 items-center font-semibold"
        >
          Volver
        </Link>
      </header>

      {actualizado ? (
        <p
          role="status"
          className="text-body-sm rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-900"
        >
          Guardado.
        </p>
      ) : null}

      <Link
        href="/admin/destinos/nueva"
        className="bg-brand-orange text-body font-display flex h-14 items-center justify-center rounded-lg font-semibold text-white active:scale-[0.99]"
      >
        Crear destino nuevo
      </Link>

      {CATEGORIAS.map(({ tipo, etiqueta }) => {
        const delTipo = (destinos ?? []).filter((d) => d.tipo === tipo);
        return (
          <section key={tipo} className="flex flex-col gap-3">
            <h2 className="text-h3 font-display">{etiqueta}</h2>
            {delTipo.length === 0 ? (
              <p className="text-body-sm text-neutral-600">Todavía no hay ninguno.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {delTipo.map((destino, i) => (
                  <ListaDestino
                    key={destino.id}
                    destino={destino}
                    primero={i === 0}
                    ultimo={i === delTipo.length - 1}
                  />
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </main>
  );
}

function ListaDestino({
  destino,
  primero,
  ultimo,
}: {
  destino: FilaDestino;
  primero: boolean;
  ultimo: boolean;
}) {
  return (
    <li className="bg-surface-base flex items-center gap-2 rounded-lg border border-neutral-200 p-3">
      <Link
        href={`/admin/destinos/${destino.id}/editar`}
        className="flex min-h-11 flex-1 flex-col justify-center gap-0.5"
      >
        <span className="text-body font-display font-semibold">{destino.nombre}</span>
        <span className="text-caption text-neutral-600">{destino.estado}</span>
      </Link>
      <form action={moverDestino}>
        <input type="hidden" name="destino_id" value={destino.id} />
        <input type="hidden" name="tipo" value={destino.tipo} />
        <input type="hidden" name="direccion" value="arriba" />
        <button
          type="submit"
          disabled={primero}
          aria-label={`Subir ${destino.nombre}`}
          className="text-body inline-flex min-h-11 min-w-11 items-center justify-center font-semibold text-neutral-700 disabled:text-neutral-300"
        >
          ↑
        </button>
      </form>
      <form action={moverDestino}>
        <input type="hidden" name="destino_id" value={destino.id} />
        <input type="hidden" name="tipo" value={destino.tipo} />
        <input type="hidden" name="direccion" value="abajo" />
        <button
          type="submit"
          disabled={ultimo}
          aria-label={`Bajar ${destino.nombre}`}
          className="text-body inline-flex min-h-11 min-w-11 items-center justify-center font-semibold text-neutral-700 disabled:text-neutral-300"
        >
          ↓
        </button>
      </form>
    </li>
  );
}
