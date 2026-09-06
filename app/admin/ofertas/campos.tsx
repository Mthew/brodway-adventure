import { Campo, ENTRADA } from "@/app/admin/piezas";
import { aTexto, type CamposOfertaValores } from "@/lib/admin/campos";

type Destino = { id: string; nombre: string };

/**
 * Los campos comerciales de una oferta: nombre, destino, precio, vigencia, qué
 * incluye y qué no. Compartidos entre crear (`ofertas/nueva`) y editar
 * (`ofertas/[id]/editar`, Fase 1 de `docs/product/plan-backoffice.md`) — un solo
 * lugar donde un campo se agrega o cambia de nombre.
 *
 * Sin `valores`, cada campo nace vacío (crear). Con `valores`, se precarga con lo que
 * ya está guardado (editar) vía `defaultValue` — son formularios no controlados en
 * ambos casos, consistente con el resto del asistente.
 *
 * `destinoSeleccionadoId` y `onCrearDestino` solo los pasa `ofertas/nueva/formulario.tsx`
 * (crear un destino sin abandonar la carga de la oferta). En editar quedan `undefined`:
 * el botón de creación rápida ni se renderiza y el `key` del `<select>` queda estable
 * durante toda la sesión de edición.
 */
export function CamposOferta({
  destinos,
  valores,
  destinoSeleccionadoId,
  onCrearDestino,
}: {
  destinos: Destino[];
  valores?: CamposOfertaValores;
  /** Id de un destino recién creado desde el diálogo rápido, para preseleccionarlo. */
  destinoSeleccionadoId?: string;
  /** Abre el diálogo de creación rápida. Sin esta prop, el botón no existe. */
  onCrearDestino?: () => void;
}) {
  const destinoDefaultValue = destinoSeleccionadoId ?? valores?.destinoId ?? "";

  return (
    <>
      <Campo etiqueta="Nombre de la oferta">
        <input name="titulo" required defaultValue={valores?.titulo} className={ENTRADA} />
      </Campo>

      <div className="flex flex-col gap-2">
        <Campo etiqueta="Destino">
          <select
            key={destinoDefaultValue}
            name="destino_id"
            required
            defaultValue={destinoDefaultValue}
            className={ENTRADA}
          >
            <option value="" disabled>
              Elige uno
            </option>
            {destinos.map((destino) => (
              <option key={destino.id} value={destino.id}>
                {destino.nombre}
              </option>
            ))}
          </select>
        </Campo>
        {onCrearDestino ? (
          <button
            type="button"
            onClick={onCrearDestino}
            className="text-body-sm font-display self-start font-semibold text-brand-turquoise-text"
          >
            + Crear destino nuevo
          </button>
        ) : null}
      </div>

      <Campo
        etiqueta="En una línea"
        ayuda="Lo que hace distinta a esta oferta. Sale en la tarjeta."
      >
        <input name="beneficio_corto" defaultValue={valores?.beneficioCorto} className={ENTRADA} />
      </Campo>

      <Campo
        etiqueta="Precio desde"
        ayuda="En pesos, por persona. Sin puntos ni símbolos."
      >
        <input
          name="precio_desde"
          type="number"
          min={1}
          required
          inputMode="numeric"
          defaultValue={valores?.precioDesde}
          className={ENTRADA}
        />
      </Campo>

      {/*
        Ciudad de salida y ocupación NO son opcionales, y no por rigor de formulario:
        el bloque de precio del sitio las muestra junto a la cifra, y sin ellas un
        "desde" no significa nada. Es obligación de transparencia, no un capricho.
      */}
      <Campo etiqueta="Ciudad de salida">
        <input
          name="ciudad_origen"
          required
          defaultValue={valores?.ciudadOrigen}
          className={ENTRADA}
        />
      </Campo>

      <Campo etiqueta="Ocupación del precio" ayuda="Con cuántas personas por habitación se calculó.">
        <select
          name="ocupacion_base"
          defaultValue={valores?.ocupacionBase ?? "doble"}
          className={ENTRADA}
        >
          <option value="sencilla">Sencilla</option>
          <option value="doble">Doble</option>
          <option value="triple">Triple</option>
          <option value="cuádruple">Cuádruple</option>
        </select>
      </Campo>

      <Campo etiqueta="Noches">
        <input
          name="noches"
          type="number"
          min={1}
          required
          inputMode="numeric"
          defaultValue={valores?.noches}
          className={ENTRADA}
        />
      </Campo>

      <Campo etiqueta="Hotel" ayuda="Si la oferta lo lleva.">
        <input name="hotel" defaultValue={valores?.hotel ?? undefined} className={ENTRADA} />
      </Campo>

      <Campo etiqueta="Alimentación" ayuda="Por ejemplo: todo incluido, o desayuno.">
        <input
          name="alimentacion"
          defaultValue={valores?.alimentacion ?? undefined}
          className={ENTRADA}
        />
      </Campo>

      <Campo
        etiqueta="Fechas del viaje"
        ayuda="Tal como las trae el flyer: «8 al 12 de junio»."
      >
        <input
          name="fecha_periodo"
          defaultValue={valores?.fechaPeriodo ?? undefined}
          className={ENTRADA}
        />
      </Campo>

      {/*
        La vigencia de la TARIFA, que no es lo mismo que las fechas del viaje.
        Confundirlas publica un precio que ya no existe, así que van juntas y
        etiquetadas para que la diferencia se lea.
      */}
      <fieldset className="flex flex-col gap-3 rounded-lg bg-white p-4">
        <legend className="text-body-sm font-display px-1 font-semibold">
          Hasta cuándo vale este precio
        </legend>
        <Campo etiqueta="Desde">
          <input
            name="vigencia_desde"
            type="date"
            required
            defaultValue={valores?.vigenciaDesde}
            className={ENTRADA}
          />
        </Campo>
        <Campo etiqueta="Hasta">
          <input
            name="vigencia_hasta"
            type="date"
            required
            defaultValue={valores?.vigenciaHasta}
            className={ENTRADA}
          />
        </Campo>
      </fieldset>

      <Campo etiqueta="Incluye" ayuda="Una cosa por línea.">
        <textarea
          name="incluye"
          rows={5}
          defaultValue={valores ? aTexto(valores.incluye) : undefined}
          className={`${ENTRADA} py-3`}
        />
      </Campo>

      <Campo etiqueta="No incluye" ayuda="Una cosa por línea.">
        <textarea
          name="no_incluye"
          rows={4}
          defaultValue={valores ? aTexto(valores.noIncluye) : undefined}
          className={`${ENTRADA} py-3`}
        />
      </Campo>

      <fieldset className="flex flex-col gap-3 rounded-lg bg-neutral-100 p-4">
        <legend className="text-body-sm font-display px-1 font-semibold text-neutral-700">
          Interno — nunca se muestra en el sitio
        </legend>
        <Campo etiqueta="Mayorista" ayuda="De dónde salió esta tarifa.">
          <input
            name="mayorista"
            defaultValue={valores?.mayorista ?? undefined}
            className={ENTRADA}
          />
        </Campo>
        <Campo etiqueta="Notas internas" ayuda="Para el equipo. No se publica.">
          <textarea
            name="notas_internas"
            rows={3}
            defaultValue={valores?.notasInternas ?? undefined}
            className={`${ENTRADA} py-3`}
          />
        </Campo>
      </fieldset>
    </>
  );
}
