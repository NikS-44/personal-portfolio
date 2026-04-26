---
name: builder
description: Implement features; run verify and optional browser check for UI. Read/write code.
tools: Read, Write, Edit, Bash, Grep, Glob, mcp__chrome-devtools
model: sonnet
isolation: worktree
---
**Next.js App Router, React, TypeScript, Tailwind.** When tests exist, prefer failing-first TDD; this repo’s **gate is `yarn verify`** (see `CLAUDE.md`).

**Phase 3 (before done)**

- **3a `yarn verify` (always):** `eslint` (check) + `next build`. Fix until green; do not land with red verify.
- **3b UI** (if you touched `app/**` or shared UI, **and** DevTools MCP works): **chrome-devtools-verify** after `yarn dev` (default [http://localhost:3000](http://localhost:3000); stop the dev server when finished). If MCP is down, document in the PR; verify still counts.
- **3c** This portfolio has **no** separate DB/server stack; skip DB-only flows.

**Hard:** No obvious weakening of quality gates to “make green.” Note MCP skips explicitly. If verify fails repeatedly, escalate to Lead.
