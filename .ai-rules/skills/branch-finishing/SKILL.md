---
name: branch-finishing
description: Tidy a branch before merge — verify green, clean commits, solid PR. Use when asked to "finish the branch", prep for review, or merge.
---

# Branch finishing

1. **Sync** — `git fetch`; rebase or merge from default branch as your team prefers; resolve conflicts.
2. **Verify**  
   - App/code: **`yarn verify`** (eslint check + `next build`)  
   - Docs-only: still run **`yarn verify`** if `package.json` / lockfile / config changed; otherwise at least `yarn lint:check` on touched files if they are code-adjacent.
3. **Commits** — logical messages; no stray debug, no WIP. Follow **commit** skill for push/PR.
4. **PR** — `gh pr view` or `gh pr create` with **What / Why / Tested** per `reviewer` agent; mention MCP vs manual checks for UI.

**PR checklist (paste if useful)**

- [ ] `yarn verify` green locally
- [ ] No unintended files (`git status` clean for scope)
- [ ] **Tested** section lists commands + any screenshots under `verification/…` if UI
