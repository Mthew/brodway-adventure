import { CONSENT_DENEGADO, type ConsentState } from "@/lib/tracking/consent";

/**
 * Carga de GA4, Meta Pixel y TikTok Pixel, gobernada por el consentimiento.
 *
 * TODO ESTO ES INERTE HASTA QUE EXISTAN LOS IDENTIFICADORES.
 * Las cuentas (GA4, Meta, TikTok) deben crearse a nombre del cliente y no de quien
 * implementa (`spec-tecnica.md` §7.0), y ese punto sigue abierto. Sin variables de
 * entorno no se carga nada y no se emite ningún evento: se prefiere no medir a
 * medir contra una cuenta equivocada, porque los datos de una cuenta ajena no se
 * migran después.
 *
 * Las variables van en Vercel, NUNCA en el repositorio.
 */

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

export const HAY_MEDICION_CONFIGURADA = Boolean(
  GA4_ID || META_PIXEL_ID || TIKTOK_PIXEL_ID,
);

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[] };
    ttq?: { track: (evento: string, datos?: unknown) => void; load?: (id: string) => void; page?: () => void };
  }
}

function gtag(...args: unknown[]): void {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(args);
}

/**
 * Declara el consentimiento por defecto ANTES de cargar ninguna etiqueta.
 *
 * El orden importa y no es negociable: si `gtag('consent','default')` corre
 * después del script de GA4, la primera medición ya ocurrió sin permiso. Por eso
 * esto se ejecuta en el arranque, no cuando la persona decide.
 */
let defaultDeclarado = false;

export function declararConsentimientoPorDefecto(): void {
  // El Strict Mode de React corre los efectos dos veces en desarrollo, y esto
  // acababa declarado por duplicado en el dataLayer. Es inofensivo pero ensucia
  // la depuración del consentimiento, que es justo lo que hay que poder auditar.
  if (defaultDeclarado || !HAY_MEDICION_CONFIGURADA) return;
  defaultDeclarado = true;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = window.gtag ?? gtag;

  gtag("consent", "default", {
    ...CONSENT_DENEGADO,
    // Funcional y no negociable: no se declara como opción.
    security_storage: "granted",
    wait_for_update: 500,
  });
}

/** Comunica la decisión de la persona a las etiquetas ya cargadas. */
export function actualizarConsentimiento(estado: ConsentState): void {
  if (!HAY_MEDICION_CONFIGURADA) return;
  gtag("consent", "update", estado);
}

let cargado = false;

/**
 * Carga las etiquetas. Sólo se llama con consentimiento concedido.
 *
 * Idempotente: navegar entre páginas no debe volver a inyectar los scripts.
 */
export function cargarEtiquetas(): void {
  if (cargado || !HAY_MEDICION_CONFIGURADA) return;
  cargado = true;

  if (GA4_ID) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.appendChild(script);

    gtag("js", new Date());
    gtag("config", GA4_ID);
  }

  if (META_PIXEL_ID) {
    cargarMetaPixel(META_PIXEL_ID);
  }

  if (TIKTOK_PIXEL_ID) {
    cargarTikTokPixel(TIKTOK_PIXEL_ID);
  }
}

function cargarMetaPixel(id: string): void {
  if (window.fbq) return;

  const cola: unknown[] = [];
  const fbq = ((...args: unknown[]) => {
    cola.push(args);
  }) as NonNullable<Window["fbq"]>;
  fbq.queue = cola;
  window.fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  window.fbq("init", id);
  window.fbq("track", "PageView");
}

function cargarTikTokPixel(id: string): void {
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${id}`;
  document.head.appendChild(script);
}

/**
 * Emite un evento a las tres plataformas.
 *
 * `eventId` viaja en las tres para deduplicar contra los eventos que emite el CRM
 * (spec-tecnica.md §8.5): sin él, la misma conversión se cuenta dos veces y la
 * optimización de campaña se degrada con datos inflados.
 */
export function emitirEvento(
  nombre: string,
  datos: Record<string, unknown> & { eventId?: string },
): void {
  if (!HAY_MEDICION_CONFIGURADA) return;

  const { eventId, ...resto } = datos;

  if (GA4_ID) {
    gtag("event", nombre, { ...resto, event_id: eventId });
  }

  if (META_PIXEL_ID && window.fbq) {
    window.fbq("trackCustom", nombre, resto, { eventID: eventId });
  }

  if (TIKTOK_PIXEL_ID && window.ttq) {
    window.ttq.track(nombre, { ...resto, event_id: eventId });
  }
}
