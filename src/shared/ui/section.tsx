import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Contenedor de sección.
 *
 * "El diseño debe respirar": mucho aire, jerarquía clara, pocos elementos
 * compitiendo. El padding generoso es intencional, no un descuido.
 */
const sectionVariants = cva("w-full", {
  variants: {
    background: {
      base: "bg-surface-base text-neutral-900",
      alt: "bg-surface-alt text-neutral-900",
      navy: "bg-brand-navy text-white",
      turquoise: "bg-brand-turquoise text-brand-navy",
    },
    spacing: {
      normal: "py-16 md:py-24",
      compact: "py-10 md:py-14",
    },
  },
  defaultVariants: { background: "base", spacing: "normal" },
});

type SectionProps = React.ComponentProps<"section"> &
  VariantProps<typeof sectionVariants>;

export function Section({
  className,
  background,
  spacing,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(sectionVariants({ background, spacing }), className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-6xl px-6 md:px-8">{children}</div>
    </section>
  );
}
