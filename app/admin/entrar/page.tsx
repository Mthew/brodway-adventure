import { FormularioEntrar } from "./formulario";

/**
 * Entrada al panel.
 *
 * Ahora tiene recuperación de contraseña (`/admin/olvide`), pero esta página sigue
 * siendo la parada obligatoria de cualquier enlace de recuperación vencido o ya usado:
 * el Route Handler de `/admin/auth/confirmar` redirige aquí con `?error=enlace_invalido`.
 */
export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorEnlace =
    error === "enlace_invalido"
      ? "Ese enlace ya no es válido. Pide uno nuevo."
      : undefined;

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-5 py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-h2 font-display">Panel de BroWay</h1>
          <p className="text-body text-neutral-600">
            Entra para cargar y publicar ofertas.
          </p>
        </div>

        <FormularioEntrar errorEnlace={errorEnlace} />
      </div>
    </main>
  );
}
