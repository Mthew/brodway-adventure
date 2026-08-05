# 001 · El CLI de shadcn/ui, probado y descartado

**Archivado el 2026-08-05.** Ocurrió durante el Paso 0 de la Fase 1. Se archiva porque el
incidente ya está cerrado y su conclusión vive como regla permanente en `CLAUDE.md` y
`spec-tecnica.md` §4.1; aquí queda el detalle de por qué, para que nadie lo reabra por
intuición.

## Por qué se intentó

`spec-tecnica.md` declaraba el stack como "Next.js 16 + React 19 + Tailwind v4 + **shadcn/ui**",
y `brief-v0.md` §12.4 hablaba de haber decidido los íconos *"antes de instalar shadcn/ui"*, o sea
que daba por hecho que se instalaría. La ausencia de `components.json` en el repo no era una
decisión: los nueve componentes de la Fase 0 son simples y se escribieron a mano.

## Qué hizo el CLI

`shadcn@4.16.1`, preset Nova, base Radix, sobre este repositorio:

| Efecto | Consecuencia |
|---|---|
| Sobrescribió `lib/utils.ts` entero (47 → 6 líneas) | Borró `FONT_SIZE_TOKENS` y `extendTailwindMerge`. Es **exactamente** el fallo mudo que ya mandó el botón navy a producción con 1.19:1 de contraste |
| Sobrescribió `components/ui/button.tsx` | Se llevó las cinco reglas de contraste verificadas y las variantes de marca (`primary` naranja/navy, `whatsapp`) |
| Añadió 127 líneas a `app/globals.css` | Un segundo sistema de tokens (`--background`, `--foreground`) en paralelo al `@theme` medido sobre tres superficies |
| Instaló `lucide-react` | La familia de íconos que `brief-v0.md` §2.bis prohíbe explícitamente |
| Instaló `tw-animate-css` | Una librería de animación, contra `MOTION_INTENSITY 3` y el objetivo de LCP < 1s |

## Por qué no hay configuración que lo arregle

Los presets del CLI **empaquetan familia de íconos y tipografía** (Nova = Lucide + Geist). No es
un default que se pueda desactivar con un flag: es lo que el preset *es*. Y son justo las dos
decisiones que `brief-v0.md` §12 marca como las más caras de revertir.

## Qué se hizo en su lugar

Todo revertido. Se corrigieron `spec-tecnica.md`, `brief-v0.md` y `CLAUDE.md`, que eran los
documentos que llevarían a repetirlo.

Las **convenciones** de shadcn se mantienen y el repo ya las seguía: `cva` para variantes,
`cn()` con `tailwind-merge`, `buttonVariants` exportado. Lo que se descarta es su generador.
Cuando haga falta una primitiva con accesibilidad cara de escribir a mano (Dialog, Select), se
instala `radix-ui` directo y se escribe el wrapper contra los tokens del proyecto.

## Lo que dejó como aprendizaje

`scripts/check-font-size-tokens.mjs` nació de aquí. El borrado de `lib/utils.ts` lo detectó un
`git diff` por suerte, no un control. Ahora falla el `build` si `FONT_SIZE_TOKENS` se desincroniza
del `@theme` o si `cn()` pierde su `extendTailwindMerge`.
