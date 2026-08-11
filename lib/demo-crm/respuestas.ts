import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

/**
 * Almacenamiento de las respuestas de la demo.
 *
 * Es un archivo JSON dentro del repositorio, a propósito: lo que se responda en la
 * reunión queda versionado con `git diff` al lado de las preguntas que lo
 * originaron, y no en una base de datos que habría que montar para una sola tarde.
 *
 * ⚠️ SÓLO FUNCIONA EN LOCAL. En Vercel el sistema de archivos es de sólo lectura y
 * efímero: escribir ahí no falla de forma visible, simplemente se pierde al
 * siguiente despliegue. Por eso el endpoint que llama a `guardarRespuesta` está
 * cerrado fuera de desarrollo (`app/api/demo-crm/respuestas/route.ts`).
 */

const ARCHIVO = path.join(process.cwd(), "data", "demo-crm-respuestas.json");

export type Respuesta = {
  texto: string;
  guardadoEl: string;
};

export type Archivo = {
  actualizado: string | null;
  respuestas: Record<string, Respuesta>;
};

const VACIO: Archivo = { actualizado: null, respuestas: {} };

export async function leerRespuestas(): Promise<Archivo> {
  try {
    const crudo = await readFile(ARCHIVO, "utf8");
    const datos = JSON.parse(crudo) as Partial<Archivo>;

    return {
      actualizado: datos.actualizado ?? null,
      respuestas: datos.respuestas ?? {},
    };
  } catch (error) {
    // El archivo aún no existe: es el estado normal antes de la primera respuesta.
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return VACIO;

    /*
      Un JSON corrupto NO se sobrescribe en silencio: si alguien lo editó a mano y
      dejó una coma de más, devolver `VACIO` haría que el primer guardado borrara
      todas las respuestas de la reunión. Se prefiere fallar y que se vea.
    */
    throw error;
  }
}

/**
 * Cola de escritura.
 *
 * Guardar es leer-modificar-escribir. Con dos botones pulsados casi a la vez —lo
 * normal tomando notas— las dos lecturas ven el mismo estado y la segunda escritura
 * pisa la primera. Encadenar las operaciones lo evita sin añadir dependencias.
 */
let cola: Promise<unknown> = Promise.resolve();

function enCola<T>(operacion: () => Promise<T>): Promise<T> {
  const resultado = cola.then(operacion, operacion);
  cola = resultado.catch(() => {});
  return resultado;
}

export function guardarRespuesta(id: string, texto: string): Promise<Archivo> {
  return enCola(async () => {
    const actual = await leerRespuestas();
    const respuestas = { ...actual.respuestas };

    if (texto.length === 0) {
      // Vaciar el campo borra la respuesta en vez de guardar una cadena vacía.
      delete respuestas[id];
    } else {
      respuestas[id] = { texto, guardadoEl: new Date().toISOString() };
    }

    const siguiente: Archivo = {
      actualizado: new Date().toISOString(),
      respuestas,
    };

    await mkdir(path.dirname(ARCHIVO), { recursive: true });
    // Con salto de línea final para que el archivo no ensucie el diff de git.
    await writeFile(ARCHIVO, `${JSON.stringify(siguiente, null, 2)}\n`, "utf8");

    return siguiente;
  });
}
