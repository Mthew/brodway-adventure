import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-caption font-semibold",
  {
    variants: {
      variant: {
        /** Sellos de confianza: RNT, ANATO, IATA. */
        trust: "bg-brand-navy/5 text-brand-navy border border-brand-navy/15",
        /** Etiquetas de destino: Nacional, Internacional, Grupo pequeño. */
        destino: "bg-brand-turquoise/10 text-brand-turquoise-text",
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
