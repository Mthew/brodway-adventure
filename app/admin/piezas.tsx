import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Piezas del asistente.
 *
 * Viven aquí y no en `components/ui/` porque son del backoffice: el sitio público no
 * tiene pasos ni barras fijas de acción, y mezclarlas obligaría a mantener variantes
 * que nadie usa. Los tokens y las tipografías sí son los mismos.
 */

export const PASOS = ["Transcribir", "Fotos", "Secciones", "Publicar"] as const;

/**
 * Barra de avance de cuatro pasos.
 *
 * Muestra el número Y el nombre del paso actual, no sólo un porcentaje: quien entra a
 * medias necesita saber en qué está, no cuánto le falta. Los pasos ya recorridos son
 * enlaces, porque volver a corregir una tilde no debería costar reiniciar el asistente.
 */
export function Avance({
  paso,
  ofertaId,
}: {
  /** 1 a 4. */
  paso: number;
  /** Existe desde el paso 2 en adelante. */
  ofertaId?: string;
}) {
  const rutas = ["", "fotos", "secciones", "publicar"];

  return (
    <nav aria-label="Avance de la publicación" className="flex flex-col gap-2">
      <p className="text-caption font-display font-semibold text-neutral-600">
        Paso {paso} de 4 · {PASOS[paso - 1]}
      </p>
      <ol className="flex gap-1.5">
        {PASOS.map((nombre, i) => {
          const numero = i + 1;
          const recorrido = numero < paso;
          const actual = numero === paso;
          const contenido = (
            <span
              className={cn(
                "block h-1.5 rounded-full transition-colors",
                actual && "bg-brand-orange",
                recorrido && "bg-brand-turquoise",
                !actual && !recorrido && "bg-neutral-200",
              )}
            />
          );

          return (
            <li key={nombre} className="flex-1">
              {recorrido && ofertaId ? (
                <Link
                  href={`/admin/ofertas/${ofertaId}/${rutas[i]}`}
                  aria-label={`Volver a ${nombre}`}
                  /* `py-3` sube el objetivo táctil a 44px sin engordar la barra. */
                  className="block py-3"
                >
                  {contenido}
                </Link>
              ) : (
                <span className="block py-3" aria-current={actual ? "step" : undefined}>
                  {contenido}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Barra de acción fija al fondo.
 *
 * Fija y no al final del formulario: en un móvil con veinte campos, un botón que vive
 * al final del scroll obliga a recorrer todo para avanzar. 56px de alto y ancho
 * completo, que es el objetivo más fácil de acertar con el pulgar.
 *
 * `pb-[env(safe-area-inset-bottom)]` la levanta sobre la barra de gestos del iPhone,
 * donde si no queda medio tapada.
 */
export function BarraAccion({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface-base sticky bottom-0 z-10 border-t border-neutral-200 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      {children}
    </div>
  );
}

export function BotonPrincipal({
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={cn(
        "bg-brand-orange text-body h-14 w-full rounded-lg font-display font-semibold text-white",
        "transition-colors active:scale-[0.99]",
        "disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500",
        props.className,
      )}
    >
      {children}
    </button>
  );
}

/** Campo de una sola columna. En móvil no hay dos columnas que valgan. */
export function Campo({
  etiqueta,
  ayuda,
  children,
}: {
  etiqueta: string;
  ayuda?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-body-sm font-display font-semibold">{etiqueta}</span>
      {ayuda ? <span className="text-caption text-neutral-600">{ayuda}</span> : null}
      {children}
    </label>
  );
}

export const ENTRADA =
  "text-body min-h-12 w-full rounded-lg border border-neutral-300 bg-white px-3 " +
  "focus:border-brand-turquoise focus:ring-brand-turquoise/30 focus:ring-2 focus:outline-none";

/**
 * Error del formulario.
 *
 * `role="alert"` para que un lector de pantalla lo anuncie sin que haya que buscarlo,
 * y arriba del formulario, no junto al botón: quien envía desde el fondo de la pantalla
 * no ve lo que pasó a 600px de scroll.
 */
export function Error({ mensaje }: { mensaje?: string }) {
  if (!mensaje) return null;
  return (
    <p
      role="alert"
      className="text-body-sm rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800"
    >
      {mensaje}
    </p>
  );
}
