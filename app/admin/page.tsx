import Link from "next/link";
import { redirect } from "next/navigation";

import { cn } from "@/lib/utils";
import { getSupabaseAdmin, getUsuarioAdmin } from "@/lib/supabase/admin";

/**
 * Entrada del panel: un dashboard, no la lista de ofertas.
 *
 * Antes esta pantalla ERA el listado de ofertas — confundía qué pertenecía a qué
 * entidad, porque no había nada que dijera "esto es de ofertas" (el listado completo
 * vive ahora en `/admin/ofertas`, ver `ListaOfertasPage`). Esta pantalla sólo
 * responde una pregunta — "¿cómo está el catálogo hoy?" — y de ahí navega a las
 * pantallas específicas. Ningún porcentaje aquí es inventado: los tres vienen de
 * contar filas reales, nunca de una tendencia sin datos históricos que la respalden
 * (el mismo criterio que ya rechaza "Más de 5000 viajeros felices" en el sitio
 * público, `sistema-comercial.md`).
 */
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ clave_actualizada?: string }>;
}) {
  const usuario = await getUsuarioAdmin();
  if (!usuario) redirect("/admin/entrar");

  const { clave_actualizada } = await searchParams;
  const supabase = await getSupabaseAdmin();

  const [{ data: ofertas }, { data: destinos }] = await Promise.all([
    supabase.from("ofertas").select("estado, vigencia_hasta"),
    supabase.from("destinos").select("estado"),
  ]);

  const hoy = new Date().toISOString().slice(0, 10);
  const en15Dias = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const todas = ofertas ?? [];
  const borradores = todas.filter((o) => o.estado === "borrador");
  const noBorrador = todas.filter((o) => o.estado !== "borrador");
  const vencidas = noBorrador.filter(
    (o) => o.estado === "vencida" || o.vigencia_hasta < hoy,
  );
  const vigentes = noBorrador.filter(
    (o) => o.estado === "vigente" && o.vigencia_hasta >= hoy,
  );
  const porVencer = vigentes.filter((o) => o.vigencia_hasta <= en15Dias);

  const todosDestinos = destinos ?? [];
  const destinosActivos = todosDestinos.filter((d) => d.estado === "activo");

  const salud = noBorrador.length > 0 ? Math.round((vigentes.length / noBorrador.length) * 100) : 0;

  return (
    <main className="mx-auto flex max-w-md flex-col gap-8 px-5 py-8">
      {/* Correo y "Salir" ya viven en MenuAdmin (barra superior de todo el panel):
          repetirlos aquí sería el mismo dato dos veces en la misma pantalla. */}
      <h1 className="text-h2 font-display">Panel</h1>

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

      {/* Tarjeta principal: salud del catálogo publicado, no de los borradores. */}
      <div className="bg-surface-base flex items-center gap-4 rounded-lg border border-neutral-200 p-4">
        <Anillo porcentaje={salud} />
        <div className="flex flex-col gap-0.5">
          <p className="text-caption text-neutral-600">Ofertas vigentes</p>
          <p className="text-h1 font-display leading-none font-bold text-brand-navy">
            {vigentes.length}
          </p>
          <p className="text-caption text-neutral-600">
            {vencidas.length === 0
              ? "Ninguna vencida"
              : `${vencidas.length} vencida${vencidas.length === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <TarjetaEstadistica
          etiqueta="Por vencer"
          ayuda="15 días o menos"
          valor={porVencer.length}
          fraccion={vigentes.length > 0 ? porVencer.length / vigentes.length : 0}
          color="amber"
        />
        <TarjetaEstadistica
          etiqueta="Sin terminar"
          ayuda="borradores"
          valor={borradores.length}
          fraccion={todas.length > 0 ? borradores.length / todas.length : 0}
          color="turquesa"
        />
      </div>

      <Link
        href="/admin/destinos"
        className="bg-surface-base flex flex-col gap-2 rounded-lg border border-neutral-200 p-4"
      >
        <div className="flex items-baseline justify-between">
          <p className="text-body-sm font-display font-semibold">Destinos activos</p>
          <span className="text-body-sm text-brand-turquoise-text font-semibold">
            Gestionar →
          </span>
        </div>
        <p className="text-h2 font-display font-bold text-brand-navy">
          {destinosActivos.length}
          <span className="text-body-sm font-normal text-neutral-500">
            {" "}
            de {todosDestinos.length}
          </span>
        </p>
        <Barra
          fraccion={todosDestinos.length > 0 ? destinosActivos.length / todosDestinos.length : 0}
          color="turquesa"
        />
      </Link>

      <Link
        href="/admin/ofertas"
        className="text-body-sm text-brand-turquoise-text self-center font-semibold"
      >
        Ver todas las ofertas
      </Link>
    </main>
  );
}

const COLORES = {
  turquesa: "bg-brand-turquoise",
  amber: "bg-amber-500",
} as const;

/** Barra de progreso de una sola fracción, mismo lenguaje visual que los puntos de `Avance`. */
function Barra({
  fraccion,
  color,
}: {
  /** 0 a 1. */
  fraccion: number;
  color: keyof typeof COLORES;
}) {
  const porcentaje = Math.max(0, Math.min(1, fraccion)) * 100;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
      <div
        className={cn("h-full rounded-full", COLORES[color])}
        style={{ width: `${porcentaje}%` }}
      />
    </div>
  );
}

function TarjetaEstadistica({
  etiqueta,
  ayuda,
  valor,
  fraccion,
  color,
}: {
  etiqueta: string;
  ayuda: string;
  valor: number;
  fraccion: number;
  color: keyof typeof COLORES;
}) {
  return (
    <div className="bg-surface-base flex flex-col gap-2 rounded-lg border border-neutral-200 p-4">
      <div className="flex flex-col gap-0.5">
        <p className="text-body-sm font-display font-semibold">{etiqueta}</p>
        <p className="text-caption text-neutral-600">{ayuda}</p>
      </div>
      <p className="text-h1 font-display leading-none font-bold text-brand-navy">{valor}</p>
      <Barra fraccion={fraccion} color={color} />
    </div>
  );
}

/**
 * Anillo de progreso en SVG puro, sin librería de charts para un solo valor.
 *
 * Rotado -90° para que el relleno empiece arriba, como cualquier anillo de progreso;
 * `strokeLinecap="round"` para que combine con las puntas redondeadas que ya usa
 * `Avance`. El texto va centrado encima, no sólo el color: un lector de pantalla o
 * alguien con daltonismo tienen que poder leer "80%" sin interpretar el arco.
 */
function Anillo({ porcentaje }: { porcentaje: number }) {
  const radio = 26;
  const circunferencia = 2 * Math.PI * radio;
  const relleno = (Math.max(0, Math.min(100, porcentaje)) / 100) * circunferencia;

  return (
    <div className="relative flex size-16 shrink-0 items-center justify-center">
      <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
        <circle cx="32" cy="32" r={radio} strokeWidth="7" className="fill-none stroke-neutral-200" />
        <circle
          cx="32"
          cy="32"
          r={radio}
          strokeWidth="7"
          strokeDasharray={`${relleno} ${circunferencia}`}
          strokeLinecap="round"
          className="stroke-brand-turquoise fill-none transition-[stroke-dasharray]"
        />
      </svg>
      <span className="text-caption font-display absolute font-bold text-brand-navy">
        {porcentaje}%
      </span>
    </div>
  );
}
