import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-caption font-display font-semibold",
  {
    variants: {
      variant: {
        /** Sellos de confianza: RNT, ANATO, IATA. */
        trust: "bg-brand-navy/5 text-brand-navy border border-brand-navy/15",
        /**
         * Etiquetas de destino sobre superficie CLARA: Nacional, Internacional,
         * Grupo pequeño. Su texto está medido sobre blanco, sobre `surface-alt` y
         * sobre su propio tinte al 10%.
         */
        destino: "bg-brand-turquoise/10 text-brand-turquoise-text",
        /**
         * La misma etiqueta sobre fondo OSCURO (hero con overlay navy).
         *
         * No es una variación estética: `destino` pinta #006B7D sobre su tinte al
         * 10%, y compuesto sobre el navy del hero rinde **1.82:1**, ilegible. Es el
         * mismo fallo mudo que mandó el botón navy a producción con 1.19:1.
         * Blanco sobre blanco al 15% compuesto sobre navy rinde **8.46:1**.
         * Medido en el navegador, no leído del código.
         */
        destinoOscuro: "border border-white/25 bg-white/15 text-white",
        neutral: "bg-neutral-100 text-neutral-700",
        /**
         * Dato real de escasez ("Quedan 4 cupos"), nunca urgencia inventada.
         * Prohibido usarlo con un contador (brief-v0-producto.md §7.1).
         */
        dato: "bg-warning/10 text-warning",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
