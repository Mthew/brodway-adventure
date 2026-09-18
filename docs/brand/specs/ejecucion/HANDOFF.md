# Diario de ejecución del grafo de marca

Append-only. La verdad vive en `nodos/*.json`; esto es el porqué, para que lo lea una persona.

---

## 2026-09-18 — arranque

Grafo listo (`grafo.md`), sin decisiones abiertas (§7 cerrado el mismo día). Arranca con
**N-01.0a** (migración limpia: componentes compartidos), el nodo más simple del frente de
migración mecánica día-1, para validar el patrón de dos PRs antes de paralelizar el resto del
frente día-1 (N-01.0b, N-03.0, N-04.0, N-02.1, N-03.1, N-03.4, N-06.1, N-04.3, N-05.1, N-07.2,
N-01.2).

### N-01.0a — cerrado

- `git mv` de los 6 orígenes a los 4 destinos declarados en `grafo.md` (`src/shared/ui/{button,
  badge,section}.tsx`, `src/shared/layout/navbar.tsx`,
  `src/modules/tracking/presentation/components/cookie-banner.tsx`,
  `src/modules/offers/presentation/components/sticky-cta.tsx`).
- 21 archivos consumidores actualizados a la ruta `@/src/...` (button: 19, badge: 5, section: 16,
  navbar: 1, cookie-banner: 1, sticky-cta: 1 — hay solape, un mismo archivo importa varios).
- **Hallazgo no anticipado por el spec**: `components/ui/card.tsx` importaba `Badge` por ruta
  relativa (`./badge`), no absoluta — el grep original del nodo (`@/components/ui/badge"`) no lo
  detecta porque no es esa forma. Corregido a `@/src/shared/ui/badge`. Ningún otro archivo de
  `components/` tenía imports relativos hacia los 6 movidos (verificado con
  `grep -rn "from \"\./"`).
- `navbar.tsx` importaba `./language-switcher` y `./whatsapp-floating` (relativos, mismo
  directorio). Esos dos NO migran en este nodo — se quedan en `components/layout/`. Se
  actualizaron a `@/components/layout/language-switcher` y `@/components/layout/whatsapp-floating`
  (ruta absoluta a su ubicación sin cambios), no a rutas relativas rotas.
- Falso verde descartado: grep de rutas viejas dio cero **y además** se verificó que no queda
  ningún import relativo colgante (`grep -rn "from \"\./" components/` → vacío) — el caso real que
  se coló (card.tsx) no lo cubría el primer grep.
- Prueba por mutación: se borró `src/shared/ui/button.tsx` con clean `.next` y `next build` falló
  con "Module not found" en los 15 archivos que lo importan (salida completa en
  `nodos/N-01.0a.json`). Restaurado, build limpio de nuevo.
- `pnpm build`: `EXIT=0`, 90 páginas generadas, `check:deps` sin violaciones (191 módulos, 359
  dependencias). Recorrido en navegador (`pnpm dev`) sobre `/es` (navbar, menú destinos) y
  `/es/ofertas/eje-cafetero-4-dias` (sticky CTA) — sin diferencia visible.
- Commit: ver `nodos/N-01.0a.json`. PR de migración abierto contra `main`.

**Siguiente:** el resto del frente día-1 puede arrancar ya (no comparten superficie con N-01.0a
según el validador, `grafo.md` §4-5) — pendiente de que el usuario indique si se ejecuta en
paralelo o nodo por nodo.
