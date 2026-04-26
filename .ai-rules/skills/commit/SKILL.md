---
name: commit
description: Conventional commit messages, push, and PR workflow for this repo. Use when finishing work that should land on a branch or open a PR.
---

# Commit / PR

## Messages

- Prefer **imperative** subject: `Add`, `Fix`, `Refactor` — ~50 chars; body optional.
- **Hooks:** lint-staged runs **Prettier** and **ESLint** on staged files. If a failure is in untouched lines, fix minimally or adjust only what your change requires.

## Before push

1. `yarn verify` (or at minimum `yarn lint:check` + `yarn build` if you are splitting work carefully).
2. `git status` — only intended paths staged.

## PR

- `gh pr view` if a PR exists for the branch; else `gh pr create` with:
  - **Summary**
  - **Test plan** — commands run (`yarn verify`, manual checks, screenshots path if UI)
- Return the PR URL when the user needs it.

**Not in repo:** do not add new tooling (e.g. Fallow) without explicit user approval.
