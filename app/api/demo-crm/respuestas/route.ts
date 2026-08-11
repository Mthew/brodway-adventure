import { NextResponse } from "next/server";

import { IDS_VALIDOS } from "@/lib/demo-crm/guion";
import { guardarRespuesta } from "@/lib/demo-crm/respuestas";

/**
 * Guardado de las respuestas de la demo de GoHighLevel.
 *
 * CERRADO FUERA DE DESARROLLO, y no por prudencia decorativa: escribe un archivo
 * del repositorio sin autenticación. En producción sería una escritura anónima
 * expuesta a Internet, y además inútil — el sistema de archivos de Vercel es de
 * sólo lectura. Responde 404 en vez de 403 para no confirmar que la ruta existe.
 */

/** Un párrafo de notas cabe de sobra; el tope evita que un pegado accidental infle el archivo. */
const LARGO_MAXIMO = 4000;

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let body: { id?: unknown; texto?: unknown };

  try {
    body = (await request.json()) as { id?: unknown; texto?: unknown };
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (typeof body.id !== "string" || !IDS_VALIDOS.has(body.id)) {
    return NextResponse.json({ error: "id_desconocido" }, { status: 422 });
  }

  if (typeof body.texto !== "string") {
    return NextResponse.json({ error: "texto_invalido" }, { status: 422 });
  }

  const texto = body.texto.trim();

  if (texto.length > LARGO_MAXIMO) {
    return NextResponse.json(
      { error: "texto_demasiado_largo", maximo: LARGO_MAXIMO },
      { status: 422 },
    );
  }

  try {
    const archivo = await guardarRespuesta(body.id, texto);

    return NextResponse.json({
      ok: true,
      guardadoEl: archivo.respuestas[body.id]?.guardadoEl ?? null,
    });
  } catch (error) {
    console.error("[demo-crm] no se pudo escribir la respuesta", error);
    return NextResponse.json({ error: "escritura_fallida" }, { status: 500 });
  }
}
