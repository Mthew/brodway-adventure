import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/lib/supabase/database.types";

/**
 * Cliente del BACKOFFICE, con sesión.
 *
 * Es un cliente aparte del de `lib/supabase/client.ts` a propósito, no una
 * duplicación por descuido. Aquel sirve al sitio público y desactiva las sesiones
 * porque leer `cookies()` sacaría a cada página del prerenderizado y se llevaría por
 * delante el presupuesto de LCP. Este hace justo lo contrario: necesita la cookie de
 * sesión para saber quién eres, y por eso vive sólo bajo `/admin`, donde ser dinámico
 * es lo correcto.
 *
 * Mezclarlos en un solo cliente convertiría el sitio entero en dinámico para dar
 * sesión a diez personas que entran a un panel interno.
 */
export async function getSupabaseAdmin() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          /*
           * Falla en silencio dentro de un Server Component, y es correcto.
           *
           * Un Server Component no puede escribir cookies; sólo las Server Actions y
           * los Route Handlers pueden. Refrescar el token desde una lectura lanzaría
           * aquí, y quien refresca de verdad es el layout a través de sus acciones.
           */
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Lectura desde un Server Component: no hay dónde escribir.
          }
        },
      },
    },
  );
}

/**
 * La persona autenticada, o `null`.
 *
 * Usa `getUser()` y NO `getSession()`: `getSession` lee la cookie y se fía de ella,
 * mientras que `getUser` valida el token contra el servidor de Supabase. En una
 * comprobación que decide si alguien entra al panel, fiarse de una cookie que el
 * navegador puede haber manipulado no es una comprobación.
 */
export async function getUsuarioAdmin() {
  const supabase = await getSupabaseAdmin();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
