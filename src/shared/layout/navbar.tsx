"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Link } from "@/lib/i18n/navigation";
import { buildWhatsAppUrl } from "@/lib/config";
import { ButtonLink } from "@/src/shared/ui/button";
import { cn } from "@/lib/utils";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { WhatsAppIcon } from "@/components/layout/whatsapp-floating";

/**
 * Los tres destinos del menú del cliente, agrupados bajo "Destinos".
 *
 * `estructura-funcional-cliente.md` §2 pide siete entradas planas: Mejores Ofertas ·
 * Mejores Playas y Hoteles · Destinos Internacionales · Destinos Nacionales · Pueblos
 * de Antioquia · Nosotros · Contacto. Sus etiquetas suman unos 119 caracteres y no
 * caben en la barra de escritorio junto al logo, el selector de idioma y el botón de
 * WhatsApp: a 1280px se desbordan.
 *
 * Se agrupan las tres de destino, que es lo que el propio menú del cliente ya trata
 * como familia. Cada una CONSERVA su URL propia y enlazable —requisito para poder
 * apuntar un anuncio a una categoría— y en móvil se listan planas, sin desplegable.
 */
const DESTINOS_LINKS = [
  { href: "/destinos/internacionales", key: "destinosInternacionales" },
  { href: "/destinos/nacionales", key: "destinosNacionales" },
  { href: "/destinos/pueblos-de-antioquia", key: "pueblosAntioquia" },
  { href: "/destinos", key: "verTodosDestinos" },
] as const;

/** Entradas planas de la barra, a la derecha del desplegable de destinos. */
const NAV_LINKS = [
  { href: "/ofertas", key: "mejoresOfertas" },
  { href: "/playas-y-hoteles", key: "playasYHoteles" },
  { href: "/nosotros", key: "nosotros" },
  { href: "/contacto", key: "contacto" },
] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const tCta = useTranslations("cta");
  const tWa = useTranslations("whatsapp");
  const [open, setOpen] = useState(false);
  const [destinosOpen, setDestinosOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const destinosRef = useRef<HTMLLIElement>(null);

  /*
   * Cierra el desplegable de destinos al hacer clic fuera o al pulsar Escape.
   *
   * Sin el clic fuera, el menú queda abierto mientras el visitante interactúa con
   * el resto de la página y tapa el contenido: es el fallo clásico de estos menús.
   */
  useEffect(() => {
    if (!destinosOpen) return;

    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (!destinosRef.current?.contains(event.target as Node)) {
        setDestinosOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setDestinosOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [destinosOpen]);

  // Cierra con Escape y atrapa el foco mientras el panel móvil está abierto.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const whatsappHref = buildWhatsAppUrl({ message: tWa("mensajeGenerico") });

  /*
   * El separador inferior va como sombra interior y NO como `border-b`.
   * El contenido de la barra mide exactamente 80px (`h-20` explícito, no
   * derivado de `py-*` + altura del contenido), que es el techo del
   * Pre-Flight §11.B; un borde de 1px lo dejaba en 81 e incumplía la casilla por
   * un píxel. Una sombra interior se dibuja dentro de la caja y no suma altura.
   *
   * N-02.2 fija la altura con `h-20` (antes: `py-3` + la altura del logo, que
   * variaba entre 68px en móvil y 80px en escritorio porque el logo se
   * dimensionaba por ALTURA). Con `h-20` fijo la barra mide 80px en TODOS los
   * breakpoints, sin importar el tamaño del logo — ver nota sobre el panel móvil
   * más abajo, que dependía de la altura variable anterior.
   */
  return (
    <header className="bg-surface-base sticky top-0 z-50 shadow-[inset_0_-1px_0_var(--color-neutral-200),0_1px_2px_rgba(0,48,98,0.06)]">
      <nav className="mx-auto flex h-20 max-w-6xl items-center gap-6 px-6 md:px-8">
        <Link href="/" aria-label={t("irAlInicio")} className="mr-2 shrink-0">
          {/*
            N-02.2 (fase-2-la-firma.md §3.1): SÍMBOLO, no la firma horizontal
            completa. La firma completa (`public/brand/logo-horizontal.png`) es
            matemáticamente incompatible con esta barra: su archivo trae un
            margen interno de exportación del kit (lienzo 1759×894, arte real
            1444×464) que hace que 180px de ancho midan ~91px de alto — ya por
            sí solo más que el techo de 80px de la barra, antes de sumar aire
            vertical. El manual ya contempla esta salida para navegaciones
            angostas: "usar el símbolo en la navegación (mínimo 40px)".

            `public/brand/simbolo.png` se recortó del símbolo aislado del kit
            (`03_Favicons/BroWay_Favicon_Fondo_Blanco_1024.png`, bbox de tinta
            701×611 dentro del lienzo de 1024×1024) con el blanco convertido a
            transparencia real (canal alfa por distancia al blanco, sin premultiplicar) —
            no es un recorte cuadrado con fondo blanco pegado encima del
            `bg-surface-base` de la barra. A 48px de alto (bien por encima del
            mínimo de 40px) da ~55px de ancho.

            Ver docs/brand/specs/ejecucion/nodos/N-02.2.json para el detalle de
            la medición que descartó la firma completa.
          */}
          <Image
            src="/brand/simbolo.png"
            alt="BroWay Adventures"
            width={724}
            height={634}
            priority
            className="h-12 w-auto"
          />
        </Link>

        <ul className="ml-auto hidden items-center gap-6 lg:flex">
          {/*
            Desplegable por CLIC, no por hover. §31 del documento del cliente lo
            exige: "la información importante nunca deberá depender exclusivamente de
            pasar el cursor sobre un elemento". Con hover, además, el menú es
            inalcanzable en pantallas táctiles de escritorio.
          */}
          <li ref={destinosRef} className="relative">
            <button
              type="button"
              onClick={() => setDestinosOpen((v) => !v)}
              aria-expanded={destinosOpen}
              aria-controls="menu-destinos"
              className="text-body-sm hover:text-brand-navy font-display inline-flex min-h-11 items-center gap-1.5 font-semibold text-neutral-700"
            >
              {t("destinos")}
              <span
                aria-hidden="true"
                className={cn(
                  "text-[0.7em] leading-none transition-transform",
                  destinosOpen && "rotate-180",
                )}
              >
                ▾
              </span>
            </button>

            {destinosOpen ? (
              <ul
                id="menu-destinos"
                className="bg-surface-base absolute top-full left-0 z-50 mt-1 min-w-[16rem] rounded-lg border border-neutral-200 py-2 shadow-lg"
              >
                {DESTINOS_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setDestinosOpen(false)}
                      className="text-body-sm hover:bg-surface-alt hover:text-brand-navy flex min-h-11 items-center px-4 font-semibold text-neutral-700"
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>

          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-body-sm hover:text-brand-navy font-display font-semibold text-neutral-700"
              >
                {t(link.key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <LanguageSwitcher className="hidden sm:flex" />
          <ButtonLink
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="sm"
            className="hidden sm:inline-flex"
          >
            <WhatsAppIcon className="size-4" />
            {tCta("cotizaWhatsapp")}
          </ButtonLink>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? t("cerrarMenu") : t("abrirMenu")}
            className="text-brand-navy inline-flex size-11 items-center justify-center rounded-sm lg:hidden"
          >
            <span aria-hidden="true" className="text-2xl leading-none">
              {open ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id="menu-movil"
          ref={panelRef}
          className={cn(
            /*
             * N-02.2: antes `top-[65px]`, un valor afinado a ojo para la altura
             * MÓVIL anterior (44px de logo + 24px de padding = 68px, tampoco 65
             * exactos). Con `h-20` la barra mide 80px fijos en TODOS los
             * breakpoints (ver comentario en el <nav> de arriba), así que el
             * panel debe empezar exactamente en `top-20` — con 65px quedaría
             * 15px por debajo del borde real de la barra, superponiéndose a su
             * franja inferior.
             */
            "bg-surface-base fixed inset-x-0 top-20 bottom-0 z-50 lg:hidden",
            "flex flex-col gap-2 overflow-y-auto px-6 py-6",
          )}
        >
          {/*
            En móvil las siete entradas van PLANAS, sin desplegable: el panel ya
            ocupa la pantalla completa y tiene scroll, así que esconder tres enlaces
            detrás de otro toque sólo añade fricción. Es la lista literal de §2.
          */}
          {[...DESTINOS_LINKS, ...NAV_LINKS].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-h3 text-brand-navy border-b border-neutral-100 py-4 font-display font-semibold"
            >
              {t(link.key)}
            </Link>
          ))}

          <LanguageSwitcher className="py-4" />

          <ButtonLink
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="lg"
            fullWidth
            className="mt-auto"
          >
            <WhatsAppIcon className="size-5" />
            {tCta("cotizaWhatsapp")}
          </ButtonLink>
        </div>
      ) : null}
    </header>
  );
}
