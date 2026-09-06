"use client";

import { List } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useRef } from "react";

import { salir } from "@/app/admin/acciones/sesion";

/**
 * Menú del panel: un único punto de navegación entre Panel, Destinos y Salir.
 *
 * Vive en `AdminLayout` (sólo si hay sesión, ver ahí), así que aparece en TODAS las
 * pantallas del backoffice — incluidas las del asistente de ofertas, que hasta ahora
 * no tenían ninguna forma de saltar a otra sección sin editar la URL a mano.
 *
 * `<details>` nativo, mismo criterio que el `<dialog>` de `DestinoRapido`: sin
 * librería de UI para un menú de tres enlaces. Necesita `"use client"` sólo para
 * cerrarse solo al navegar — si no, el layout no se remonta entre páginas y el menú
 * se queda abierto tapando la siguiente pantalla.
 */
export function MenuAdmin({ correo }: { correo: string }) {
  const detallesRef = useRef<HTMLDetailsElement>(null);
  const cerrar = () => {
    if (detallesRef.current) detallesRef.current.open = false;
  };

  return (
    <header className="bg-surface-base sticky top-0 z-20 flex min-h-12 items-center justify-between gap-3 border-b border-neutral-200 px-3">
      <details ref={detallesRef} className="relative">
        <summary
          aria-label="Abrir menú"
          className="flex size-11 list-none items-center justify-center rounded-lg text-brand-navy [&::-webkit-details-marker]:hidden"
        >
          <List size={22} weight="regular" />
        </summary>
        <nav
          aria-label="Menú del panel"
          className="bg-surface-base absolute top-full left-0 z-30 mt-1 flex w-48 flex-col gap-1 rounded-lg border border-neutral-200 p-2 shadow-lg"
        >
          <Link
            href="/admin"
            onClick={cerrar}
            className="text-body-sm flex min-h-11 items-center rounded-md px-3 font-semibold hover:bg-surface-alt"
          >
            Panel
          </Link>
          <Link
            href="/admin/destinos"
            onClick={cerrar}
            className="text-body-sm flex min-h-11 items-center rounded-md px-3 font-semibold hover:bg-surface-alt"
          >
            Destinos
          </Link>
          <form action={salir} onSubmit={cerrar}>
            <button
              type="submit"
              className="text-body-sm flex min-h-11 w-full items-center rounded-md px-3 text-left font-semibold text-red-700 hover:bg-surface-alt"
            >
              Salir
            </button>
          </form>
        </nav>
      </details>
      <span className="text-caption truncate text-neutral-600">{correo}</span>
    </header>
  );
}
