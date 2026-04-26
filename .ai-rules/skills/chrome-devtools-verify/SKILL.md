---
name: chrome-devtools-verify
description: >-
  Chrome DevTools MCP: navigate, snapshot, screenshot, console/network. Use for
  UI sign-off with `yarn dev` on this Next.js app. Read MCP tool descriptors before calling.
---

# Chrome DevTools MCP (UI verification)

**When:** You changed `app/**` or shared UI — run when MCP is connected; if not, say so in PR **Verification** and rely on **`yarn verify` + manual** checks (see `CLAUDE.md`).

**Setup:** `yarn dev` — default [http://localhost:3000](http://localhost:3000). Read your IDE’s MCP server descriptors (e.g. `chrome-devtools`).

| Step | What |
|------|------|
| Open | `navigate_page` / `list_pages` — full URL, path, hash if needed |
| Structure | `take_snapshot` — use fresh `uid`s after navigation |
| Evidence | `take_screenshot` with `filePath` e.g. `verification/<branch>/01-happy.png`; `fullPage: true` for tall pages; element shots can use `uid` |
| Before / after | If UI **changes** on interaction (modal, nav, form submit): **screenshot before** and **after** the action with paired names |
| Interact | `click`, `fill`, `type_text` — focus first as required by the tool |
| Console | `list_console_messages` — at least `error` and `warn` |
| Network | `list_network_requests` after exercising the feature (Next may prefetch; note expected requests) |

Cover **happy** path and **error/empty** when relevant. Optionally narrow mobile viewport.

## Compare `main` vs feature (paired evidence)

Use **`.ai-rules/commands/verify-compare-main.md`** — same URL and viewport on `main` and the feature branch, paired filenames under `verification/<topic>/`.

**Caveats:** If `package.json` / `yarn.lock` differ between branches, `yarn install` on each checkout when needed. Stop `yarn dev` when you are done (including on errors).

## Report (for PR or chat)

1. **Summary** — one or two sentences  
2. **Scope** — routes or components touched  
3. **Verification** — URLs and flows  
4. **Evidence** — screenshot paths in order; before/after pairs when the UI changes  
5. **Console / network** — clean or list issues  
6. **Follow-ups** — optional  

**This skill does not replace** **`yarn verify`** (eslint + `next build`).

**With stack:** New pages or routes — see **next-app** skill (`next-app/SKILL.md`).
