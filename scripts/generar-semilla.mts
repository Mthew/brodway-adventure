/**
 * Genera el SQL para sembrar una base de datos VACÍA a partir de `lib/mock/`.
 *
 *   node --experimental-strip-types scripts/generar-semilla.mts > semilla.sql
 *
 * Se usa al levantar un entorno nuevo o una base de pruebas, NO en cada despliegue:
 * la fuente del sitio es Supabase, y volver a correr esto sobre una base con datos
 * duplicaría filas (los `insert` no son idempotentes a propósito — sembrar dos veces
 * debe fallar de forma ruidosa por los `unique`, no pisar datos en silencio).
 *
 * Los mocks importan sus tipos con `import type`, que el type-stripping de Node
 * borra, así que no hace falta resolver el alias "@/" ni instalar nada.
 */
import { MOCK_DESTINATIONS } from "../lib/mock/destinations.ts";
import { MOCK_OFFERS } from "../lib/mock/offers.ts";

const q = (v: unknown): string => {
  if (v === null || v === undefined) return "null";
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return String(v);
  return "'" + String(v).replace(/'/g, "''") + "'";
};

const arr = (v: string[] | undefined): string =>
  v && v.length ? "array[" + v.map(q).join(",") + "]::text[]" : "'{}'::text[]";

const json = (v: unknown): string =>
  "'" + JSON.stringify(v ?? []).replace(/'/g, "''") + "'::jsonb";

const lineas: string[] = [];

lineas.push("-- DESTINOS");
for (const d of MOCK_DESTINATIONS) {
  lineas.push(
    `insert into destinos (slug, nombre, tipo, imagen, imagen_hero, resumen, introduccion, mejor_epoca, que_hacer, faq, destacado_en_home, orden, estado) values (` +
      [
        q(d.slug),
        q(d.nombre),
        `${q(d.tipo)}::destino_categoria`,
        q(d.imagen),
        q(d.imagenHero),
        q(d.resumen),
        arr(d.introduccion),
        q(d.mejorEpoca),
        json(d.queHacer),
        json(d.faq),
        q(d.destacadoEnHome),
        q(d.orden),
        `${q(d.estado)}::estado_publicacion`,
      ].join(", ") +
      ");",
  );
}

lineas.push("");
lineas.push("-- OFERTAS");
for (const o of MOCK_OFFERS) {
  lineas.push(
    `insert into ofertas (offer_id, slug, destino_id, ciudad_origen, noches, ocupacion_base, hotel, alimentacion, fecha_periodo, precio_desde, moneda, titulo, beneficio_corto, highlights, incluye, no_incluye, informacion_importante, requisitos, documentacion, itinerario, fechas_salida, faq, politica_cancelacion, vigencia_desde, vigencia_hasta, validada_el, estado, mayorista, mostrar_en_mejores_ofertas, mostrar_en_playas_y_hoteles, mostrar_en_home, orden, actualizado_el) ` +
      `select ` +
      [
        q(o.offerId),
        q(o.slug),
        "d.id",
        q(o.ciudadOrigen),
        q(o.noches),
        q(o.ocupacionBase),
        q(o.hotel),
        q(o.alimentacion),
        q(o.fechaPeriodo),
        q(o.precioDesde),
        `${q(o.moneda)}::moneda`,
        q(o.titulo),
        q(o.beneficioCorto),
        arr(o.highlights),
        arr(o.incluye),
        arr(o.noIncluye),
        arr(o.informacionImportante),
        arr(o.requisitos),
        arr(o.documentacion),
        json(o.itinerario),
        json(o.fechasSalida),
        json(o.faq),
        q(o.politicaCancelacion),
        `${q(o.vigenciaDesde)}::date`,
        `${q(o.vigenciaHasta)}::date`,
        `${q(o.validadaEl)}::date`,
        `${q(o.estado)}::estado_oferta`,
        q(o.mayorista),
        q(o.mostrarEnMejoresOfertas),
        q(o.mostrarEnPlayasYHoteles),
        q(o.mostrarEnHome),
        q(o.orden),
        `${q(o.actualizadoEl)}::timestamptz`,
      ].join(", ") +
      ` from destinos d where d.slug = ${q(o.destinoSlug)};`,
  );
}

lineas.push("");
lineas.push("-- IMÁGENES (galería de cada oferta, en orden)");
for (const o of MOCK_OFFERS) {
  o.imagenes.forEach((url: string, i: number) => {
    lineas.push(
      `insert into imagenes (oferta_id, url, orden) select o.id, ${q(url)}, ${i} from ofertas o where o.offer_id = ${q(o.offerId)};`,
    );
  });
}

console.log(lineas.join("\n"));
