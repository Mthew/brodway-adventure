"use server";

import { redirect } from "next/navigation";

import { SITE_URL } from "@/lib/config";
import { getSupabaseAdmin, getUsuarioAdmin } from "@/lib/supabase/admin";

/**
 * Sesión y acceso al panel.
 *
 * Todas empiezan comprobando la sesión salvo `entrar`/`olvideClave`, que la crean.
 * No basta con que el layout redirija a quien no ha entrado: una Server Action es un
 * endpoint, y se puede invocar sin pasar por la página que la contiene. RLS es la
 * última barrera, pero fallar aquí da un mensaje entendible en vez de un error de
 * permisos de Postgres.
 */

export async function exigirSesion() {
  const usuario = await getUsuarioAdmin();
  if (!usuario) redirect("/admin/entrar");
  return usuario;
}

export type EstadoFormulario = { error: string } | null;

export async function entrar(
  _previo: EstadoFormulario,
  datos: FormData,
): Promise<EstadoFormulario> {
  const correo = String(datos.get("correo") ?? "").trim();
  const clave = String(datos.get("clave") ?? "");

  if (!correo || !clave) {
    return { error: "Escribe tu correo y tu contraseña." };
  }

  const supabase = await getSupabaseAdmin();
  const { error } = await supabase.auth.signInWithPassword({
    email: correo,
    password: clave,
  });

  if (error) {
    /*
     * Mensaje genérico a propósito: distinguir "ese correo no existe" de "la
     * contraseña es incorrecta" le confirma a un desconocido qué correos tienen
     * cuenta. El texto dice qué hacer, que es lo que necesita quien sí trabaja aquí.
     */
    return { error: "No pudimos entrar con esos datos. Revísalos e inténtalo otra vez." };
  }

  redirect("/admin");
}

export async function salir() {
  const supabase = await getSupabaseAdmin();
  await supabase.auth.signOut();
  redirect("/admin/entrar");
}

export type EstadoOlvide = { error: string } | { enviado: true } | null;

/** Pide el enlace de recuperación. Ver `app/admin/auth/confirmar/route.ts` para el otro lado. */
export async function olvideClave(
  _previo: EstadoOlvide,
  datos: FormData,
): Promise<EstadoOlvide> {
  const correo = String(datos.get("correo") ?? "").trim();
  if (!correo) return { error: "Escribe tu correo." };

  const supabase = await getSupabaseAdmin();
  await supabase.auth.resetPasswordForEmail(correo, {
    redirectTo: `${SITE_URL}/admin/auth/confirmar`,
  });

  // Mismo criterio que en `entrar`: no confirmar si el correo tiene cuenta o no.
  return { enviado: true };
}

/** Pone la contraseña nueva. Sólo llega aquí con sesión, que dejó `verifyOtp`. */
export async function restablecerClave(
  _previo: EstadoFormulario,
  datos: FormData,
): Promise<EstadoFormulario> {
  await exigirSesion();

  const clave = String(datos.get("clave") ?? "");
  const confirmacion = String(datos.get("confirmacion") ?? "");
  if (clave.length < 8) return { error: "La contraseña necesita al menos 8 caracteres." };
  if (clave !== confirmacion) return { error: "Las contraseñas no coinciden." };

  const supabase = await getSupabaseAdmin();
  const { error } = await supabase.auth.updateUser({ password: clave });
  if (error) return { error: `No se pudo cambiar la contraseña: ${error.message}` };

  redirect("/admin?clave_actualizada=1");
}
