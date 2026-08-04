import { cn } from "@/lib/utils";

/**
 * Acordeón sobre `<details>`/`<summary>` nativos.
 *
 * Sin librería y sin JavaScript: el navegador ya da el comportamiento accesible
 * (teclado, lectores de pantalla, y además el contenido es buscable con Ctrl+F,
 * cosa que un acordeón hecho a mano suele romper).
 */
export function Accordion({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("divide-y divide-neutral-200 border-y border-neutral-200", className)}
      {...props}
    />
  );
}

type AccordionItemProps = Omit<React.ComponentProps<"details">, "title"> & {
  title: React.ReactNode;
};

export function AccordionItem({
  title,
  children,
  className,
  ...props
}: AccordionItemProps) {
  return (
    <details className={cn("group", className)} {...props}>
      <summary
        className={cn(
          "text-body-lg text-brand-navy flex cursor-pointer items-center justify-between gap-4",
          "min-h-11 py-4 font-semibold marker:content-none [&::-webkit-details-marker]:hidden",
        )}
      >
        {title}
        <span
          aria-hidden="true"
          className="text-brand-turquoise-text shrink-0 text-2xl leading-none transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="text-body pb-5 text-neutral-700">{children}</div>
    </details>
  );
}
