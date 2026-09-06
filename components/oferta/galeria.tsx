import Image from "next/image";

/**
 * Galería de la ficha de oferta.
 *
 * Sin librería de carrusel y sin lightbox: en móvil es scroll horizontal con
 * `scroll-snap` puro de CSS, que es lo que pide el dial de motion 3 y lo que no
 * cuesta un solo kilobyte de JavaScript en la página que más tiene que convertir.
 *
 * La primera imagen lleva `priority` porque es el LCP de esta página.
 */
export function Galeria({
  imagenes,
  titulo,
}: {
  imagenes: string[];
  titulo: string;
}) {
  if (imagenes.length === 0) return null;

  const [principal, ...resto] = imagenes;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-100 md:aspect-[16/10]">
        <Image
          src={principal}
          alt={titulo}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 55vw"
          className="object-cover"
        />
      </div>

      {resto.length > 0 ? (
        <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {resto.map((imagen) => (
            <li
              key={imagen}
              className="relative aspect-square w-24 shrink-0 snap-start overflow-hidden rounded-md bg-neutral-100"
            >
              <Image
                src={imagen}
                /* Decorativas: la imagen principal ya describe el plan. Repetir el
                   texto en cada miniatura, o numerarlas, sólo añade ruido al
                   lector de pantalla sin decirle nada útil. */
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
