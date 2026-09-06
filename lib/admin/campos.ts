import { SLUGS_RESERVADOS } from "@/lib/destinations/categorias";
import type { DestinationCategory } from "@/lib/types/destination";

/**
 * Parseo de `FormData` para los formularios del backoffice.
 *
 * Sin JSX y sin `"use server"`: son conversiones puras, reutilizadas por cualquier
 * Server Action que reciba un formulario del panel.
 */

/** Los campos comerciales de `CamposOferta`, ya validados y con su tipo real. */
export type CamposOfertaValores = {
  titulo: string;
  destinoId: string;
  beneficioCorto: string;
  precioDesde: number;
  ciudadOrigen: string;
  ocupacionBase: string;
  noches: number;
  hotel: string | null;
  alimentacion: string | null;
  fechaPeriodo: string | null;
  vigenciaDesde: string;
  vigenciaHasta: string;
  incluye: string[];
  noIncluye: string[];
  mayorista: string | null;
  notasInternas: string | null;
  informacionImportante: string[];
  requisitos: string[];
  documentacion: string[];
  politicaCancelacion: string | null;
};

export type ResultadoCamposOferta = { valores: CamposOfertaValores } | { error: string };

/**
 * Parsea y valida los campos de `CamposOferta`.
 *
 * Compartido entre `crearBorrador` y `actualizarOferta`: son las mismas 13 columnas y
 * las mismas 5 reglas, y duplicarlas entre crear y editar es exactamente la
 * duplicación que `plan-backoffice.md` §2.1 pedía evitar.
 */
export function parsearCamposOferta(datos: FormData): ResultadoCamposOferta {
  const titulo = String(datos.get("titulo") ?? "").trim();
  const destinoId = String(datos.get("destino_id") ?? "");
  const precioDesde = Number(datos.get("precio_desde") ?? 0);
  const noches = Number(datos.get("noches") ?? 0);
  const ciudadOrigen = String(datos.get("ciudad_origen") ?? "").trim();
  const ocupacionBase = String(datos.get("ocupacion_base") ?? "doble").trim();
  const vigenciaDesde = String(datos.get("vigencia_desde") ?? "");
  const vigenciaHasta = String(datos.get("vigencia_hasta") ?? "");

  if (!titulo || !destinoId || !ciudadOrigen) {
    return { error: "Faltan el nombre de la oferta, el destino o la ciudad de salida." };
  }
  if (!(precioDesde > 0)) {
    return { error: "El precio tiene que ser mayor que cero." };
  }
  if (!(noches > 0)) {
    return { error: "Las noches tienen que ser al menos una." };
  }
  if (!vigenciaDesde || !vigenciaHasta) {
    return { error: "La vigencia necesita fecha de inicio y de fin." };
  }
  if (vigenciaHasta < vigenciaDesde) {
    return { error: "La vigencia termina antes de empezar. Revisa las fechas." };
  }

  return {
    valores: {
      titulo,
      destinoId,
      beneficioCorto: String(datos.get("beneficio_corto") ?? "").trim(),
      precioDesde,
      ciudadOrigen,
      ocupacionBase,
      noches,
      hotel: vacioANulo(datos.get("hotel")),
      alimentacion: vacioANulo(datos.get("alimentacion")),
      fechaPeriodo: vacioANulo(datos.get("fecha_periodo")),
      vigenciaDesde,
      vigenciaHasta,
      incluye: aLista(datos.get("incluye")),
      noIncluye: aLista(datos.get("no_incluye")),
      mayorista: vacioANulo(datos.get("mayorista")),
      notasInternas: vacioANulo(datos.get("notas_internas")),
      informacionImportante: aLista(datos.get("informacion_importante")),
      requisitos: aLista(datos.get("requisitos")),
      documentacion: aLista(datos.get("documentacion")),
      politicaCancelacion: vacioANulo(datos.get("politica_cancelacion")),
    },
  };
}

/**
 * `null` si el nombre es válido; el mensaje de error si no.
 *
 * Compartido entre el formulario completo de destino y el diálogo rápido del
 * asistente de ofertas: un destino llamado "Nacionales" chocaría con su propio
 * listado de categoría y quedaría inalcanzable sin ningún error visible
 * (`lib/destinations/categorias.ts`).
 */
export function validarNombreDestino(nombre: string): string | null {
  if (!nombre) return "Falta el nombre del destino.";
  if (SLUGS_RESERVADOS.includes(aSlug(nombre))) {
    return "Ese nombre choca con una categoría del menú. Usa otro.";
  }
  return null;
}

export type CamposDestinoValores = {
  nombre: string;
  tipo: DestinationCategory;
  resumen: string | null;
  destacadoEnHome: boolean;
  estado: "activo" | "inactivo";
};

export type ResultadoCamposDestino = { valores: CamposDestinoValores } | { error: string };

/**
 * Parsea y valida los campos de `CamposDestino`.
 *
 * Sin `orden`: se asigna solo desde el listado (botones ↑/↓), nunca como número
 * editable aquí — el mismo criterio que ya sigue la galería de `imagenes`. Sin
 * `imagen`: vive en su propio widget de subida en la pantalla de editar, no en este
 * formulario de texto.
 */
export function parsearCamposDestino(datos: FormData): ResultadoCamposDestino {
  const nombre = String(datos.get("nombre") ?? "").trim();
  const tipo = String(datos.get("tipo") ?? "");

  const errorNombre = validarNombreDestino(nombre);
  if (errorNombre) return { error: errorNombre };
  if (!["nacional", "internacional", "pueblos-de-antioquia"].includes(tipo)) {
    return { error: "Elige una categoría." };
  }

  return {
    valores: {
      nombre,
      tipo: tipo as DestinationCategory,
      resumen: vacioANulo(datos.get("resumen")),
      destacadoEnHome: datos.get("destacado_en_home") === "on",
      estado: datos.get("estado") === "activo" ? "activo" : "inactivo",
    },
  };
}

export function vacioANulo(valor: FormDataEntryValue | null): string | null {
  const texto = String(valor ?? "").trim();
  return texto === "" ? null : texto;
}

/** Una línea por elemento: es como viene escrito en un flyer. */
export function aLista(valor: FormDataEntryValue | null): string[] {
  return String(valor ?? "")
    .split("\n")
    .map((linea) => linea.trim())
    .filter(Boolean);
}

/** Inverso de `aLista`: precarga un `<textarea>` con lo que ya está guardado. */
export function aTexto(lista: string[]): string {
  return lista.join("\n");
}

/**
 * Slug a partir del título.
 *
 * Quita tildes y eñes con `normalize`, porque un slug con `ñ` o `é` se codifica en la
 * URL y deja de ser legible en un anuncio. Es editable después: el `offer_id` es lo
 * que no cambia nunca.
 */
export function aSlug(titulo: string): string {
  return titulo
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
