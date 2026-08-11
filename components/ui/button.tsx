import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Botón base.
 *
 * REGLAS DE CONTRASTE — verificadas, no negociables (brief-v0.md §2):
 *   ✅ naranja + texto navy     = 4.57:1
 *   ❌ naranja + texto blanco   = 2.87:1  → nunca
 *   ✅ WhatsApp + texto navy    = 6.62:1
 *   ❌ WhatsApp + texto blanco  = 1.98:1  → nunca
 *   ✅ navy + texto blanco      = 13.13:1
 *
 * React 19: `ref` es una prop normal, no hace falta `forwardRef`.
 */
const buttonVariants = cva(
  cn(
    /*
      `font-display` = Montserrat. El manual asigna Montserrat SemiBold a botones,
      navegación y etiquetas; el cuerpo en Lato es sólo para texto de lectura.
    */
    "inline-flex items-center justify-center gap-2 rounded-md font-display font-semibold",
    "transition-colors select-none",
    // Área táctil mínima de 44x44 en móvil — el 83% del tráfico es táctil.
    "min-h-11",
    /*
      Borde transparente en TODAS las variantes.
      `outline` lleva `border-2` y las demás no llevaban ninguno, así que un botón
      outline medía 4px más de alto que el que tuviera al lado. Se ve en cuanto
      dos variantes conviven en una fila, que es lo normal: hero y banner de
      cookies. Declarar el borde aquí iguala las alturas sin tocar el padding.
    */
    "border-2 border-transparent",
    "disabled:pointer-events-none disabled:opacity-50",
  ),
  {
    variants: {
      variant: {
        primary: "bg-brand-orange text-brand-navy hover:bg-brand-orange/90",
        secondary: "bg-brand-navy text-white hover:bg-brand-navy/90",
        outline:
          "border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white bg-transparent",
        ghost: "text-brand-navy hover:bg-neutral-100 bg-transparent",
        whatsapp: "bg-whatsapp text-brand-navy hover:bg-whatsapp/90",
      },
      size: {
        /*
           El manual fija UN tamaño de botón, 16/20. Los tamaños cambian el área
           táctil y el peso visual con el padding, no agrandando la letra.
        */
        sm: "px-4 py-2 text-body",
        md: "px-6 py-3 text-body",
        lg: "px-8 py-4 text-body",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  fullWidth,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}

type ButtonLinkProps = React.ComponentProps<"a"> &
  VariantProps<typeof buttonVariants>;

/** Misma apariencia que `Button`, para cuando el destino es un enlace real. */
export function ButtonLink({
  className,
  variant,
  size,
  fullWidth,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
