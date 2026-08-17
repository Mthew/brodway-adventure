import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

/**
 * Cliente de LECTURA del sitio público.
 *
 * NO usa `@supabase/ssr`, y no es un descuido. `createServerClient` de ese paquete
 * lee `cookies()` para mantener la sesión del usuario, y en Next.js 16 tocar
 * `cookies()` marca la petición como dinámica: cada página que lo use deja de ser
 * estática. El sitio público no tiene sesiones —son lecturas anónimas resueltas en
 * build o en revalidación— así que pagar ese precio destruiría el presupuesto de LCP
 * a cambio de nada. `@supabase/ssr` entra cuando llegue el backoffice, que sí tiene
 * usuarios autenticados, y sólo bajo `/admin`.
 *
 * Por lo mismo se apagan las tres opciones de sesión: no hay nada que persistir, ni
 * token que refrescar, ni URL de la que leer una sesión.
 *
 * La clave PUBLICABLE es pública a propósito: viaja al navegador y no es un secreto.
 * Lo que protege los datos es RLS —un borrador no se lee, y `mayorista` y
 * `notas_internas` están revocadas para el rol anónimo—, no esconder la clave.
 * NUNCA sustituirla por la clave secreta: saltaría RLS entera.
 */
let cliente: SupabaseClient<Database> | null = null;

export function getSupabase(): SupabaseClient<Database> {
  if (cliente) return cliente;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  /*
   * Falla ruidosamente y en el arranque.
   *
   * La alternativa —devolver listas vacías cuando falta la configuración— publicaría
   * un sitio sin ofertas y sin ningún error visible, que es mucho peor que no
   * construir. Mismo criterio que las etiquetas de medición: antes no medir que
   * medir contra la cuenta equivocada.
   */
  if (!url || !key) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. " +
        "Cópialas de .env.example a .env.local (ver README).",
    );
  }

  cliente = createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return cliente;
}

/**
 * Columnas de `ofertas` que el rol anónimo puede leer.
 *
 * Se enumeran porque `mayorista` y `notas_internas` están revocadas para `anon`: con
 * ellas, un `select("*")` devuelve `permission denied` y tumba la página entera. No
 * es una molestia sino la señal de que la restricción funciona.
 *
 * Al añadir una columna pública hay que concederla a `anon` en la migración Y
 * añadirla aquí.
 */
export const COLUMNAS_OFERTA = [
  "id",
  "offer_id",
  "slug",
  "destino_id",
  "ciudad_origen",
  "noches",
  "ocupacion_base",
  "hotel",
  "alimentacion",
  "fecha_periodo",
  "precio_desde",
  "moneda",
  "titulo",
  "beneficio_corto",
  "highlights",
  "incluye",
  "no_incluye",
  "informacion_importante",
  "requisitos",
  "documentacion",
  "itinerario",
  "fechas_salida",
  "faq",
  "politica_cancelacion",
  "vigencia_desde",
  "vigencia_hasta",
  "validada_el",
  "estado",
  "mostrar_en_mejores_ofertas",
  "mostrar_en_playas_y_hoteles",
  "mostrar_en_home",
  "orden",
  "actualizado_el",
].join(",");
