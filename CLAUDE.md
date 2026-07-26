# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository state

This repository currently contains **only planning/spec documents** — there is no application code or `package.json` yet. Before writing any code, read the docs below (in `docs/`, entry point `docs/README.md`) in order; they are the source of truth for what to build and why. Do not invent architecture that contradicts them, and do not scaffold the project without first checking whether the user wants to start from `spec-tecnica.md`'s checklist (§7).

Naming note: the project is referred to inconsistently across docs as "Broadway Adventure" (investigation.md), "Brosway Adventure" (folder name), and "Brodway Adventure" (spec-tecnica.md, fases-entrega.md, the actual GitHub repo `Mthew/brodway-adventure`). Confirm the correct legal/brand name with the user before it ends up in code, copy, or the legal pages — don't silently pick one.

## Document map

Full index and reading order: **[`docs/README.md`](docs/README.md)**.

- **[`docs/research/investigation.md`](docs/research/investigation.md)** — Market research (Colombian travel-agency market, Medellín). Benchmarks competitors (Aviatur, On Vacation, Colombia de Lujo, PlanesTurísticos, GetYourGuide, Exoticca, TrovaTrip), conversion data, WhatsApp-as-primary-channel rationale, legal requirements (RNT, Ley 1581 de 2012, ESCNNA), and a technology recommendation (originally WordPress). Read this for **why** decisions were made, not **how** to implement them — `mvp-features.md` and `spec-tecnica.md` override its stack recommendation.
- **[`docs/product/mvp-features.md`](docs/product/mvp-features.md)** — Translates the investigation's priorities into a Next.js/Vercel MVP feature list (the stack is Next.js, not WordPress — this doc explicitly overrides the investigation's recommendation). Defines the MVP scope, sitemap, and what's explicitly out of scope for Phase 2/roadmap.
- **[`docs/architecture/spec-tecnica.md`](docs/architecture/spec-tecnica.md)** — The technical specification: **this is the primary implementation reference**. Defines the stack, i18n architecture, design-system phasing, folder structure, non-functional requirements, and the Phase 0 startup checklist. `mvp-features.md` and `spec-tecnica.md` are meant to be read together — i18n and design-system foundations are pulled into Phase 0 here even though `mvp-features.md` doesn't emphasize them.
- **[`docs/product/fases-entrega.md`](docs/product/fases-entrega.md)** — Delivery phases (1: MVP/credibility, 2: conversion scaling, 3: long-term roadmap) with explicit thresholds for when to move from one phase to the next (e.g., "move to Phase 2 when landing conversion needs channel-level attribution" or "if landing conversion drops below 2%, fix speed/messaging before adding more phases or ad spend").

When a request only makes sense in light of one of these documents (e.g., "add the package page" or "set up i18n"), check the relevant doc's section before implementing — each has specifics (field lists, route names, exact copy) that shouldn't be improvised.

## Project shape (once code exists)

Per `spec-tecnica.md`, the site is **Next.js (App Router) + Vercel**, not the WordPress stack `investigation.md` originally recommended. Key architectural commitments made **from Phase 0**, not deferred:

- **i18n from day 1**: `next-intl`, locale-prefixed routes (`es` unprefixed/default, `en` prefixed as `/en/...`), same slugs in both locales for MVP. Editorial content (destinos/paquetes/blog) is translated in the CMS, not in the `messages/*.json` UI-string files.
- **Design system from day 1** (not enterprise-grade — just tokens + base components before any page is built): CSS-variable tokens mapped into Tailwind config, base components (Button incl. WhatsApp variant, Input/Textarea/Checkbox, Card, Badge, Navbar, Footer, Hero), documented on an unindexed internal `/design-system` page. Storybook/token-sync/visual regression are explicitly deferred to Phase 2/3 — don't add that tooling early (see spec-tecnica.md §4.4).
- **This is a lead-gen site, not e-commerce**: the MVP has no real-time inventory/booking. WhatsApp (`wa.me` links with per-page/campaign pre-filled messages) is the dominant CTA; a short form (2-4 fields max) is the fallback. Payment (Wompi/PayU, 30%-deposit link) is Phase 2, and even then it's advisor-confirmed by WhatsApp, not real-time inventory.
- **Server-side tracking is Phase 2**, not MVP: Phase 1 ships client-side GA4 + Meta Pixel + TikTok Pixel with WhatsApp-click and `generate_lead` events. Meta CAPI / TikTok Events API (as Next.js API routes) come in Phase 2.
- **CMS**: headless (Sanity, Contentful, or Strapi — undecided, see spec-tecnica.md §7 risks), chosen for native multilingual content support. Not yet selected as of this writing — check with the user before assuming one.

Proposed folder structure and full sitemap are in `spec-tecnica.md` §5 and §3.1 — follow those route names (`app/[locale]/...`, `/destinos/[slug]`, `/paquetes/[slug]`, `/lp/[campana]`, `/api/lead`, etc.) rather than inventing new ones.

## Legal/compliance constraints that affect implementation

These aren't optional polish — they gate what can ship:

- Ley 1581 de 2012 (Colombian data protection): any lead form needs a **non-pre-checked** consent checkbox with clear stated purpose, before it can go live.
- RNT (Registro Nacional de Turismo) number and other legal/brand details must be **verified as real** before appearing in the footer or `/legal` page — do not fabricate or carry over placeholder values from the competitor research in `investigation.md`.
- Spanish is the legally authoritative language for data-policy/legal text; an English version is informative only (spec-tecnica.md §3.7) — don't treat the English legal page as a straight translation with equal legal weight.
