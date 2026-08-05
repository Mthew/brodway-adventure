# history/

Lo que `CURRENT.md` ya no puede sostener.

`CURRENT.md` tiene un techo de 50 líneas para que una sesión nueva sepa en qué punto va el
proyecto leyendo un solo archivo corto. Cuando lo rebasa, lo que ya **no describe el presente**
se mueve aquí en vez de borrarse.

## Convención

Un archivo por tanda de archivado, numerado correlativamente:

```
history/001-<tema>.md
history/002-<tema>.md
```

El número lo sugiere `pnpm check:current` cuando falla. El `<tema>` describe qué se archivó
(`001-fase-0-y-shadcn`, no `001-notas`).

Cada archivo abre con la fecha de archivado y una línea de contexto, para que se entienda sin
leer `CURRENT.md`.

## Qué se archiva y qué no

**Sí:** pasos cerrados con su detalle, bloqueos ya resueltos, decisiones que dejaron de estar
abiertas, incidentes con su resolución.

**No:** nada que siga siendo cierto hoy. Si un archivo de `history/` hace falta para entender el
presente, se enlaza desde `CURRENT.md` en lugar de archivarlo entero.

Esto **no** sustituye a `docs/`. `docs/` es la fuente de verdad sobre qué construir y por qué;
`history/` es el registro de por dónde pasó el proyecto.
