import { Campo, ENTRADA } from "@/app/admin/piezas";
import { aTexto, type CamposOfertaValores } from "@/lib/admin/campos";

/**
 * Campos largos de la ficha pública (`estructura-funcional-cliente.md` §17):
 * información importante, requisitos, documentación y política de cancelación.
 *
 * Plegable y SOLO en editar, nunca en el asistente de carga
 * (`plan-backoffice.md` Fase 4): quien transcribe un flyer no tiene estos datos a
 * mano, y meterlos en el Paso 1 alarga el flujo que más se usa. Vive fuera de
 * `CamposOferta` a propósito — ese componente es compartido con `nueva/formulario.tsx`
 * y esta sección no debe aparecer ahí.
 */
export function SeccionAvanzada({ valores }: { valores: CamposOfertaValores }) {
  return (
    <details className="rounded-lg border border-neutral-200 bg-white">
      <summary className="text-body-sm min-h-11 cursor-pointer px-4 py-3 font-display font-semibold text-neutral-800 marker:content-none [&::-webkit-details-marker]:hidden">
        Información adicional de la ficha (opcional)
      </summary>
      <div className="flex flex-col gap-4 px-4 pb-4">
        <Campo
          etiqueta="Información importante"
          ayuda="Una cosa por línea. Ej: altura, clima, nivel de esfuerzo."
        >
          <textarea
            name="informacion_importante"
            rows={4}
            defaultValue={aTexto(valores.informacionImportante)}
            className={`${ENTRADA} py-3`}
          />
        </Campo>

        <Campo
          etiqueta="Requisitos"
          ayuda="Una cosa por línea. Ej: pasaporte vigente, edad mínima."
        >
          <textarea
            name="requisitos"
            rows={4}
            defaultValue={aTexto(valores.requisitos)}
            className={`${ENTRADA} py-3`}
          />
        </Campo>

        <Campo
          etiqueta="Documentación"
          ayuda="Una cosa por línea. Ej: visa, seguro de viaje."
        >
          <textarea
            name="documentacion"
            rows={4}
            defaultValue={aTexto(valores.documentacion)}
            className={`${ENTRADA} py-3`}
          />
        </Campo>

        <Campo etiqueta="Política de cancelación" ayuda="Se muestra tal cual en la ficha pública.">
          <textarea
            name="politica_cancelacion"
            rows={4}
            defaultValue={valores.politicaCancelacion ?? undefined}
            className={`${ENTRADA} py-3`}
          />
        </Campo>
      </div>
    </details>
  );
}
