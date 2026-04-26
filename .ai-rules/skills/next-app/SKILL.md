---
name: next-app
description: Add or change App Router pages, layouts, and navigation in this Next.js portfolio. Use for new routes, `app/` structure, `Link`, metadata, or client vs server component boundaries.
---

# Next.js App Router (this repo)

| Task | Where |
|------|--------|
| Page / layout | `app/**/page.tsx`, `app/**/layout.tsx` |
| Global styles / fonts | `app/`, existing Tailwind entrypoints |
| Shared UI | Colocate under `app/` or shared components the project already uses |
| **Verify** | `yarn verify`; optional **chrome-devtools-verify** for visible UI |

## Conventions

1. **Server by default** — add `'use client'` only when you need browser-only APIs, hooks, or event handlers in that module.
2. **Navigation** — use Next `Link` for in-app navigation; match existing patterns in the repo.
3. **Styling** — Tailwind + existing component patterns; keep responsive behavior consistent.
4. **Data** — no separate DB in this app; for static or build-time data, follow how similar content is loaded today (`app/`, `public/`, etc.).
5. **Finish** — `yarn verify` before done; for UI, document DevTools or manual checks per `CLAUDE.md`.
