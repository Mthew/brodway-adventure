import { type NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Resuelve el enlace del correo de recuperación.
 *
 * Vive bajo `/admin/**` a propósito: `proxy.ts` excluye `admin` del matcher de
 * next-intl pero no excluye `auth`, así que un handler en la raíz (`/auth/confirm`,
 * el nombre típico en los ejemplos de Supabase) sería reescrito a `/es/auth/confirm`
 * por el middleware de idioma, y el enlace del correo dejaría de servir.
 *
 * Usa `token_hash` + `verifyOtp`, no el intercambio PKCE (`exchangeCodeForSession`):
 * PKCE depende del `code_verifier` guardado en el dispositivo que pidió el reset, y
 * falla si el correo se abre en otro dispositivo o navegador — el caso más probable
 * con diez personas revisando el correo desde el celular.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/admin/restablecer";

  if (token_hash && type) {
    const supabase = await getSupabaseAdmin();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) return NextResponse.redirect(new URL(next, request.url));
  }

  return NextResponse.redirect(
    new URL("/admin/entrar?error=enlace_invalido", request.url),
  );
}
