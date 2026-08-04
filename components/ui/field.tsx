"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

/**
 * Campos de formulario.
 *
 * Reglas de accesibilidad que no se negocian (spec-tecnica.md §6):
 * - El label SIEMPRE va asociado por `htmlFor`. El placeholder NO es un label:
 *   desaparece al escribir y los lectores de pantalla no lo anuncian igual.
 * - El mensaje de error se enlaza con `aria-describedby` y se marca `aria-invalid`.
 */

type FieldShellProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
};

function FieldShell({
  id,
  label,
  hint,
  error,
  required,
  children,
}: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-body-sm font-medium text-neutral-800">
        {label}
        {required ? (
          <span className="text-error ml-0.5" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-caption text-neutral-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-caption text-error font-medium">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const controlClasses = cn(
  "w-full rounded-md border bg-white px-4 py-3 text-body text-neutral-900",
  "border-neutral-300 placeholder:text-neutral-400",
  "min-h-11",
  "aria-[invalid=true]:border-error",
  "disabled:bg-neutral-50 disabled:text-neutral-500",
);

type InputProps = Omit<React.ComponentProps<"input">, "id"> & {
  label: string;
  hint?: string;
  error?: string;
};

export function Input({ label, hint, error, className, ...props }: InputProps) {
  const id = useId();
  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={props.required}
    >
      <input
        id={id}
        className={cn(controlClasses, className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        {...props}
      />
    </FieldShell>
  );
}

type TextareaProps = Omit<React.ComponentProps<"textarea">, "id"> & {
  label: string;
  hint?: string;
  error?: string;
};

export function Textarea({
  label,
  hint,
  error,
  className,
  ...props
}: TextareaProps) {
  const id = useId();
  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={props.required}
    >
      <textarea
        id={id}
        rows={4}
        className={cn(controlClasses, "resize-y", className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        {...props}
      />
    </FieldShell>
  );
}

type SelectProps = Omit<React.ComponentProps<"select">, "id"> & {
  label: string;
  hint?: string;
  error?: string;
};

export function Select({
  label,
  hint,
  error,
  className,
  children,
  ...props
}: SelectProps) {
  const id = useId();
  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={props.required}
    >
      <select
        id={id}
        className={cn(controlClasses, className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  );
}

type CheckboxProps = Omit<
  React.ComponentProps<"input">,
  "id" | "type" | "defaultChecked"
> & {
  /** El label puede ser largo y de varias líneas: el consentimiento de la Ley 1581 lo es. */
  label: React.ReactNode;
  error?: string;
};

/**
 * Checkbox.
 *
 * NO acepta `defaultChecked` a propósito: la autorización de tratamiento de datos
 * NO puede venir pre-marcada (Ley 1581 de 2012). Quitar esa prop del tipo hace que
 * el compilador impida el error, en vez de confiar en que nadie lo escriba.
 */
export function Checkbox({ label, error, className, ...props }: CheckboxProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          className={cn(
            "accent-brand-turquoise mt-0.5 size-5 shrink-0 rounded-sm border-neutral-300",
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        <label htmlFor={id} className="text-body-sm text-neutral-700">
          {label}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-caption text-error font-medium">
          {error}
        </p>
      ) : null}
    </div>
  );
}
