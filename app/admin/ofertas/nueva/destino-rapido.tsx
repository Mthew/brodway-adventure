"use client";

import { useActionState, useEffect, useRef } from "react";

import { crearDestinoRapido } from "@/app/admin/acciones/destinos";
import { BotonPrincipal, Campo, ENTRADA, Error as ErrorFormulario } from "@/app/admin/piezas";

/**
 * Diálogo de creación rápida de destino, invocado desde el Paso 1 del asistente de
 * ofertas (`ofertas/nueva/formulario.tsx`) sin abandonar lo ya transcrito.
 *
 * Vive como HERMANO del `<form>` exterior del asistente, nunca anidado en él — un
 * `<form>` dentro de otro `<form>` es HTML inválido, y este componente trae el suyo
 * propio. El `<dialog>` se abre/cierra de forma imperativa vía `dialogRef`, dueño del
 * padre (también lo necesita para el botón "+ Crear destino nuevo" de `CamposOferta`).
 */
export function DestinoRapido({
  dialogRef,
  onCreado,
}: {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  onCreado: (destino: { id: string; nombre: string }) => void;
}) {
  const [estado, accion, enviando] = useActionState(crearDestinoRapido, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (estado && "destino" in estado) {
      onCreado(estado.destino);
      dialogRef.current?.close();
    }
    // Solo reacciona a un éxito nuevo de la action; `onCreado`/`dialogRef` son
    // estables desde la perspectiva de este efecto.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="destino-rapido-titulo"
      onClose={() => formRef.current?.reset()}
      onClick={(evento) => {
        // Un click en el `::backdrop` reporta `target === currentTarget` (el propio
        // `<dialog>`), porque no cae en ningún hijo. Cerrar ahí simula "click fuera".
        if (evento.target === evento.currentTarget) dialogRef.current?.close();
      }}
      className="m-auto w-[min(28rem,calc(100vw-2rem))] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-xl border-0 bg-white p-0 shadow-xl backdrop:bg-neutral-900/40"
    >
      <form ref={formRef} action={accion} className="flex flex-col gap-4 p-5">
        <h2 id="destino-rapido-titulo" className="text-h3 font-display">
          Crear destino nuevo
        </h2>

        <ErrorFormulario mensaje={estado && "error" in estado ? estado.error : undefined} />

        <Campo etiqueta="Nombre del destino">
          <input name="nombre" required autoFocus className={ENTRADA} />
        </Campo>

        <Campo etiqueta="Categoría">
          <select name="tipo" required defaultValue="" className={ENTRADA}>
            <option value="" disabled>
              Elige una
            </option>
            <option value="nacional">Nacional</option>
            <option value="internacional">Internacional</option>
            <option value="pueblos-de-antioquia">Pueblos de Antioquia</option>
          </select>
        </Campo>

        <Campo etiqueta="Resumen" ayuda="Opcional. Una línea para la tarjeta.">
          <input name="resumen" className={ENTRADA} />
        </Campo>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="text-body h-12 flex-1 rounded-lg border border-neutral-300 font-display font-semibold text-neutral-700"
          >
            Cancelar
          </button>
          <BotonPrincipal type="submit" disabled={enviando} className="h-12 flex-1">
            {enviando ? "Creando…" : "Crear"}
          </BotonPrincipal>
        </div>
      </form>
    </dialog>
  );
}
