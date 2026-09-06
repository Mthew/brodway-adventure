import { Campo, ENTRADA } from "@/app/admin/piezas";
import type { CamposDestinoValores } from "@/lib/admin/campos";

/**
 * Los campos de texto de un destino: nombre, categoría, resumen, destacado, estado.
 * Compartidos entre crear (`destinos/nueva`) y editar (`destinos/[id]/editar`).
 *
 * Sin `orden` (se asigna solo desde el listado, con botones ↑/↓ — mismo criterio que
 * la galería de imágenes) y sin `imagen` (vive en su propio widget de subida en la
 * pantalla de editar, no en este formulario de texto).
 */
export function CamposDestino({ valores }: { valores?: CamposDestinoValores }) {
  return (
    <>
      <Campo etiqueta="Nombre del destino">
        <input name="nombre" required defaultValue={valores?.nombre} className={ENTRADA} />
      </Campo>

      <Campo etiqueta="Categoría">
        <select name="tipo" required defaultValue={valores?.tipo ?? ""} className={ENTRADA}>
          <option value="" disabled>
            Elige una
          </option>
          <option value="nacional">Nacional</option>
          <option value="internacional">Internacional</option>
          <option value="pueblos-de-antioquia">Pueblos de Antioquia</option>
        </select>
      </Campo>

      <Campo etiqueta="Resumen" ayuda="Una línea para la tarjeta.">
        <input name="resumen" defaultValue={valores?.resumen ?? undefined} className={ENTRADA} />
      </Campo>

      <label className="bg-surface-base flex min-h-16 items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3">
        <input
          type="checkbox"
          name="destacado_en_home"
          defaultChecked={valores?.destacadoEnHome}
          className="accent-brand-turquoise size-5 shrink-0"
        />
        <span className="flex flex-col">
          <span className="text-body font-display font-semibold">Destacado en Home</span>
          <span className="text-caption text-neutral-600">
            Aparece en la selección de la página de inicio.
          </span>
        </span>
      </label>

      <Campo
        etiqueta="Estado"
        ayuda="Inactivo desaparece del sitio sin borrarse. No se puede activar sin las dos fotos."
      >
        <select name="estado" defaultValue={valores?.estado ?? "inactivo"} className={ENTRADA}>
          <option value="inactivo">Inactivo</option>
          <option value="activo">Activo</option>
        </select>
      </Campo>
    </>
  );
}
