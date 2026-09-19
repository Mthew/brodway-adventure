// `app/admin/layout.tsx` es convención de Next.js: no se mueve hasta el paso atómico
// final (`arquitectura-modular.md` §6). Su contenido no-ruta vive ahora en
// `src/platform/admin/admin-shell.tsx` (N-01.0b) — este archivo sólo lo importa.
export { metadata, default } from "@/src/platform/admin/admin-shell";
