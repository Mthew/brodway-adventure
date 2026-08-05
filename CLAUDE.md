# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> The line above imports `AGENTS.md`, which Next.js writes and **re-adds on every `next dev`**
> (see `node_modules/next/dist/server/lib/generate-agent-files.js`). Do not inline its contents
> here and do not delete it from a diff — it just comes back. Commit it alongside your work to
> keep the tree clean. Its point is worth internalizing: this Next.js has breaking changes
> against most training data, so read `node_modules/next/dist/docs/` before writing code rather
> than trusting recall. §2.1.1 of the spec lists the changes that bite first.

## Flujo de trabajo — leer esto ANTES que nada

**Empieza toda sesión leyendo [`CURRENT.md`](CURRENT.md).** Es el estado del proyecto: en qué
paso va, qué rompe si lo tocas, qué está bloqueado y qué decisiones siguen abiertas. Este
archivo (`CLAUDE.md`) describe reglas permanentes; `CURRENT.md` describe el momento. Cuando se
contradigan sobre el **estado**, gana `CURRENT.md`; sobre las **reglas**, gana este.

**Una rama y un PR por paso del plan.**

- Cada paso de [`docs/product/plan-fase-1.md`](docs/product/plan-fase-1.md) §4 sale de `main`,
  no de la rama del paso anterior: `git checkout main && git pull && git checkout -b <rama>`.
- Nombre de rama: `fase-1/paso-N-<slug>` (ej. `fase-1/paso-2-leadform`).
- Al terminar el paso se abre PR a `main` con `gh pr create --base main`. No se acumulan dos
  pasos en la misma rama.
- Si un paso depende de otro que aún no está mergeado, dilo en el PR y ramifica desde `main`
  igualmente: es preferible un conflicto visible a una rama larga que nadie puede revisar.

**`CURRENT.md` se actualiza en el mismo PR del paso**, nunca después. Un PR que cambia el estado
del proyecto y no toca `CURRENT.md` está incompleto.

**Techo de 50 líneas en `CURRENT.md`**, verificado por `pnpm check:current` dentro del `build`.
El techo no se sube. Al rebasarlo, lo que ya no describe el presente se archiva en
`history/NNN-<tema>.md` (numeración correlativa: `001-`, `002-`…) y en `CURRENT.md` queda solo
el estado actual. Lo que casi siempre sobra: pasos ya cerrados con su detalle, bloqueos
resueltos y decisiones que dejaron de estar abiertas.

## Repository state

Estado puntual (qué está construido hoy, qué sigue): **[`CURRENT.md`](CURRENT.md)**. Lo de abajo
son las invariantes del repo, que no cambian de un paso a otro.

Next.js 16.3.0 + React 19.2.8 + Tailwind v4 + TypeScript, App Router, no `src/` directory.
Phase 0 foundations are built: `next-intl` wired (`lib/i18n/`, `proxy.ts`, `messages/`), design
tokens in `app/globals.css`, base components in `components/ui/` and `components/layout/`, and
the living guide at `/design-system`. The `docs/` folder (entry point `docs/README.md`) remains
the source of truth for what to build and why; read it before writing anything, and do not
invent architecture that contradicts it.

De la Fase 0 queda abierto lo que no es código y depende de terceros: titularidad de cuentas
(paso 0 del checklist `spec-tecnica.md` §7), la frontera CMS / base de ofertas (4) y el contrato
de `/api/lead` (5). Ese último tiene que acordarse **antes** de conectar el formulario al CRM,
porque los tipos de campo de GoHighLevel no se pueden convertir después de creados. La lista
completa con su impacto está en `plan-fase-1.md` §5, y el estado del día en `CURRENT.md`.

**No corras `shadcn init` en este repo.** Se probó el 2026-08-04: sobrescribe `lib/utils.ts`
(borrando `FONT_SIZE_TOKENS`), sobrescribe `button.tsx` con sus reglas de contraste, duplica los
tokens en `globals.css` e instala `lucide-react` y `tw-animate-css`. Sus presets empaquetan
familia de íconos y tipografía, así que ninguna combinación de flags lo evita. Los componentes
se escriben a mano con `cva` + `cn()`; para una primitiva accesible se instala `radix-ui` directo
y se escribe el wrapper.

**Two design-system rules that are load-bearing, not style preferences.** Both caused silent,
invisible failures once already:

- **`cn()` is configured, and that configuration has to be maintained.** Every `--text-*` token
  in the `@theme` block must also be listed in `FONT_SIZE_TOKENS` in `lib/utils.ts`. Otherwise
  tailwind-merge reads `text-body-sm` as a *color*, decides it conflicts with `text-white`, and
  drops one of them with no error. That is how the navy button shipped at 1.19:1 contrast while
  its source said `text-white`. **Verify button and label colors in the browser, not by reading
  the JSX.**
- **Contrast is verified against the surface the component actually paints on**, not against
  white. Badges paint text over a 10% tint of their own color, which is *lighter* than white;
  two tokens that passed on white failed inside their badge. `app/globals.css` records three
  measured ratios per token: white / `surface-alt` / own 10% tint.

**The visual direction is declared, not improvised per page.** `docs/design/brief-v0.md` §2.bis
holds the design read, the three dials (`DESIGN_VARIANCE 6` / `MOTION_INTENSITY 3` /
`VISUAL_DENSITY 4`) and the pasteable anti-slop block; §11 is the Pre-Flight that gates any page
entering the repo. Three decisions there constrain code directly: **no animation library**
(CSS only, LCP < 1s on mobile), **light mode only** (the measured contrast matrix in
`app/globals.css` covers light surfaces only), and **one icon family**, `@phosphor-icons/react`
at `weight="regular"` — decided before installing shadcn/ui precisely because shadcn pulls in
`lucide-react` and settles the question by default. Both files derive from the
`design-taste-frontend` skill in `.claude/skills/`; where the skill's defaults collide with
these, §2.bis records which one wins and why. Do not re-litigate those overrides per page.

Naming note: the official brand name is **BroWay Adventures** (confirmed by `docs/brand/manual-de-marca.pdf` §2 "Reglas del nombre" — B and W capitalized, "BroWay" always as one verbal unit, never "Bro Way"/"Broway"/"Bro-Way"/"BRO WAY"). Docs have been normalized to this spelling. Two things remain out of sync and are **not** renamed by this fix: the local folder (`brosway-adventure`) and the GitHub repo (`Mthew/brodway-adventure`) — renaming either is a repo-infra action, not a docs edit, so it wasn't done here. Use "BroWay Adventures" in all new code, copy, and legal pages regardless of what the folder/repo URL say.

## Document map

Full index and reading order: **[`docs/README.md`](docs/README.md)**.

- **[`docs/research/sistema-comercial.md`](docs/research/sistema-comercial.md)** ★ — The **client's own roadmap** for the commercial system this website plugs into: GoHighLevel as the CRM/source of commercial truth, WhatsApp Business Platform multi-agent, an externally-owned AI agent, n8n for orchestration, and a structured wholesaler-offer database. Read this to understand **what the website is a part of**. It reframes the site from "the system" to one of six lead sources, and it is the reason the CRM, the `offer_id` contract, the consent-record fields and the "don't turn on ad spend before the CRM works" gate are what they are. Where it collides with the older docs, this one wins on commercial architecture (CRM choice, event ownership, offer lifecycle); the Next.js docs still win on how the site itself is built.
- **[`docs/research/investigation.md`](docs/research/investigation.md)** — Market research (Colombian travel-agency market, Medellín). Benchmarks competitors (Aviatur, On Vacation, Colombia de Lujo, PlanesTurísticos, GetYourGuide, Exoticca, TrovaTrip), conversion data, WhatsApp-as-primary-channel rationale, legal requirements (RNT, Ley 1581 de 2012, ESCNNA), and a technology recommendation (originally WordPress). Read this for **why** decisions were made, not **how** to implement them — `mvp-features.md` and `spec-tecnica.md` override its stack recommendation.
- **[`docs/product/mvp-features.md`](docs/product/mvp-features.md)** — Translates the investigation's priorities into a Next.js/Vercel MVP feature list (the stack is Next.js, not WordPress — this doc explicitly overrides the investigation's recommendation). Defines the MVP scope, sitemap, and what's explicitly out of scope for Phase 2/roadmap.
- **[`docs/architecture/spec-tecnica.md`](docs/architecture/spec-tecnica.md)** — The technical specification: **this is the primary implementation reference**. Defines the stack, i18n architecture, design-system phasing, folder structure, non-functional requirements, and the Phase 0 startup checklist. `mvp-features.md` and `spec-tecnica.md` are meant to be read together — i18n and design-system foundations are pulled into Phase 0 here even though `mvp-features.md` doesn't emphasize them.
- **[`docs/product/fases-entrega.md`](docs/product/fases-entrega.md)** — Delivery phases (1: MVP/credibility, 2: conversion scaling, 3: long-term roadmap) with explicit thresholds for when to move from one phase to the next (e.g., "move to Phase 2 when landing conversion needs channel-level attribution" or "if landing conversion drops below 2%, fix speed/messaging before adding more phases or ad spend").
- **[`docs/brand/manual-de-marca.pdf`](docs/brand/manual-de-marca.pdf)** — Official brand manual: name rules, brand DNA (archetypes, values, positioning), voice/tone, the "Next Stop" verbal platform (a narrative/audiovisual signature — never merged into the logo, never used more than once per piece), and the logo system (horizontal/vertical/seal/favicon, safe zone, minimum sizes). Logo source file: [`docs/brand/logo-broway-adventures.png`](docs/brand/logo-broway-adventures.png). Does **not** define color hex values, typefaces, or photography guidelines — check with whoever owns the brand before picking those for the design system in `spec-tecnica.md` §4.

When a request only makes sense in light of one of these documents (e.g., "add the package page" or "set up i18n"), check the relevant doc's section before implementing — each has specifics (field lists, route names, exact copy) that shouldn't be improvised.

## Project shape (once code exists)

Per `spec-tecnica.md`, the site is **Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + shadcn/ui on Vercel**, not the WordPress stack `investigation.md` originally recommended. Pinned toolchain: **Node.js 24.14.1** (`.nvmrc` + `engines.node`) and **pnpm 10.34.3** (`packageManager` field, via Corepack) — see `spec-tecnica.md` §2.0.

Three version-driven rules that change how code is written, not just which version is installed (`spec-tecnica.md` §2.1.1) — get these right from the first file rather than migrating later:

- **Tailwind v4 has no `tailwind.config.ts`.** Tokens live in an `@theme` block in `app/globals.css`, after `@import "tailwindcss"`. A token declared there is automatically both a utility class and a CSS variable — don't duplicate it anywhere. The `@config` directive exists only for legacy projects and does not apply here.
- **`params` and `searchParams` are Promises in Next.js 16.** Synchronous access was removed entirely, so every page/layout under `app/[locale]/...` is `async` and must `await params`. Same for `cookies()` and `headers()`.
- **`middleware.ts` is now `proxy.ts`** — which is where `next-intl`'s locale detection lives. React 19 also makes `forwardRef` unnecessary; `ref` is a normal prop.

Key architectural commitments made **from Phase 0**, not deferred:

- **i18n from day 1**: `next-intl`, locale-prefixed routes (`es` unprefixed/default, `en` prefixed as `/en/...`), same slugs in both locales for MVP. Editorial content (destinos/paquetes/blog) is translated in the CMS, not in the `messages/*.json` UI-string files.
- **Design system from day 1** (not enterprise-grade — just tokens + base components before any page is built): tokens declared in the `@theme` block (see above), base components on top of shadcn/ui (Button incl. WhatsApp variant, Input/Textarea/Checkbox, Card, Badge, Navbar, Footer, Hero), documented on an unindexed internal `/design-system` page. Storybook/token-sync/visual regression are explicitly deferred to Phase 2/3 — don't add that tooling early (see spec-tecnica.md §4.4).
- **This is a lead-gen site, not e-commerce**: the MVP has no real-time inventory/booking. WhatsApp (`wa.me` links with per-page/campaign pre-filled messages) is the dominant CTA; a short form (2-4 fields max) is the fallback. Payment (Wompi/PayU, 30%-deposit link) is Phase 2, and even then it's advisor-confirmed by WhatsApp, not real-time inventory.
- **The site is a satellite of GoHighLevel, not a standalone system.** The CRM is **GoHighLevel (Starter + WhatsApp add-on)** — decided, not open (`sistema-comercial.md`). It holds the Contact↔Opportunity model and is the source of commercial truth. The site's job is to capture, qualify lightly, record consent, and hand off with context. Do **not** reintroduce Kommo/Leadsales/HubSpot: older docs named them before this decision.
- **Every published rate carries an `offer_id` and a validity window.** A price on the site is not a number typed into a CMS field — it is a row in the offer database with `offerId`, source wholesaler, base occupancy, departure city, `vigenciaHasta` and `validadaEl`. The `offer_id` must travel from the page into the lead payload so the advisor/agent never re-asks which offer the visitor saw. An expired rate must never render as bookable; render the expired state (see spec §8.4), never a 404.
- **Tracking ownership is split**: the site emits page-level events (`ViewContent`, initial `Lead`) with a server-generated `event_id`; GoHighLevel emits the downstream funnel (`QualifiedLead`, `QuoteRequested`, `QuoteSent`, `BookingStarted`, `DepositPaid`, `Sale`) because those happen in the CRM, not on the site. Both sides must share the same `event_id`/`external_id` or conversions get double-counted. Phase 1 still ships client-side GA4 + Meta Pixel + TikTok Pixel with WhatsApp-click and `generate_lead`.
- **Ad spend does not start before the CRM works.** Capture, first response, pipeline, attribution, scoring and human handoff must all be live first (`sistema-comercial.md` §"Plan de ejecución"). The Phase 1 site can ship before that; the campaigns pointing at it cannot.
- **CMS**: headless (Sanity, Contentful, or Strapi — undecided, see spec-tecnica.md §7 risks), chosen for native multilingual content support. Not yet selected as of this writing — check with the user before assuming one. Note the boundary: the CMS owns **editorial** content (destinos, blog, landing copy); the **offer database** owns rates and their lifecycle. Don't model rates twice.

Proposed folder structure and full sitemap are in `spec-tecnica.md` §5 and §3.1 — follow those route names (`app/[locale]/...`, `/destinos/[slug]`, `/paquetes/[slug]`, `/lp/[campana]`, `/api/lead`, etc.) rather than inventing new ones.

## Legal/compliance constraints that affect implementation

These aren't optional polish — they gate what can ship:

- Ley 1581 de 2012 (Colombian data protection): any lead form needs a **non-pre-checked** consent checkbox with clear stated purpose, before it can go live. The checkbox alone is not enough — the lead payload must **record the evidence**: accepted text, policy version, timestamp, originating page/form, technical identifier, authorized channels, lead source, revocation state (spec-tecnica.md §8.3).
- **The stated purpose must cover what is actually done with the data.** If leads feed Meta custom audiences, "contacto comercial para asesoría de viaje" does not cover it — the authorization has to name personalized advertising explicitly. Use the wording in `sistema-comercial.md` §"Corrección necesaria sobre la autorización"; final text still needs a Colombian lawyer.
- **Registro de Números Excluidos (RNE)**, in force since April 2024: people can opt out of commercial messaging by messaging apps, email and calls. The suppression list lives in the CRM, but `/legal` must state it and the site must never treat form submission as blanket consent to future campaigns.
- RNT (Registro Nacional de Turismo) number and other legal/brand details must be **verified as real** before appearing in the footer or `/legal` page — do not fabricate or carry over placeholder values from the competitor research in `investigation.md`. RNT is also required in the prestador's advertising, which is why it belongs in the price-disclosure block, not only the footer.
- Spanish is the legally authoritative language for data-policy/legal text; an English version is informative only (spec-tecnica.md §3.7) — don't treat the English legal page as a straight translation with equal legal weight.
