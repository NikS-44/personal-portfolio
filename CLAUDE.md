# Definition of done

- **`yarn verify`** is green: `eslint` (check, no auto-fix) + `build:verify` (production build to `.next-build`, safe
  alongside `yarn dev`). Do not add tools beyond what root `package.json` already provides unless the user asks.
- If **`yarn dev`** serves stale chunks or 500s after a bad session, run **`yarn dev:clean`** (wipes `.next`, restarts
  dev).
- **No** `any`, no `@ts-ignore`, no stray `console.log` in shipping code.
- **UI / routes** (`app/**`, shared components): when Chrome DevTools MCP is available, use **chrome-devtools-verify**
  (console/network, screenshots under `verification/<branch-or-topic>/` if you save them). If MCP is unavailable, say so
  in PR **Verification**; `yarn verify` still counts.

# Stack

- **Next.js 14** (App Router), **React 18**, **TypeScript**
- **Tailwind CSS**, **ESLint** + **Prettier** (see repo config)
- **Font Awesome** (`@fortawesome/*`) where the UI already uses icons

# Agents

- **Architect / critic / reviewer:** read-only.
- **Builder:** implements `app/` and shared code; `yarn verify` before calling work done.
- Blocked → escalate to Lead; max two silent retries on the same issue.

# Config layout

- **Source of truth:** `.ai-rules/` (skills, rules, commands, agents, `mcp.json`); **no Fallow** in this repo.
- `.cursor` / `.claude` symlink into `.ai-rules/` (see `scripts/ensure-ai-rules-symlinks.mjs`). Claude Code also gets
  `.mcp.json` → `.ai-rules/mcp.json`. If symlinks are missing after clone, run `yarn run ai-rules:link` (also runs on
  `postinstall` after `yarn install`).
