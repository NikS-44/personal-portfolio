---
name: safe-dependency-updates
description: >-
  Outdated dependencies, install warnings, and semver/changelog-driven batched
  upgrades with `yarn verify`. Use for dependency hygiene, major bumps, audit
  remediation, or when install output lists deprecated or mismatched peers.
---

# Safe dependency updates (Yarn)

Treat upgrades as a **small, reversible** program: **read changelogs before bumping**, classify risk, land **one batch per PR** when possible, end with green **`yarn verify`**.

## Discovery

1. **Declared drift:** `yarn outdated` (if available) or the tooling your Yarn version provides.
2. **Install:** `yarn install` — capture deprecation and peer warnings.
3. **Security:** `yarn audit` — triage; patch CVEs with notes.

Use **`yarn.lock`** (not pnpm) as the source of lockfile truth.

## Changelog review

Before changing a version: release notes, migration guides, compare tags on GitHub. **Major = assume breaking** until the notes say otherwise.

## Risk matrix (lightweight)

One row per upgrade unit: package, current → target, semver jump, source (outdated/audit), changelog signals, note if Next/React/ESLint are coupled.

## Agents

- **Lead** for branch scope: one batch = one PR when practical.
- **Builder** applies lock + version changes; run **`yarn verify`** after; follow **strict-tdd** if behavior or types change.

**UI-related bumps (Next, React, styling):** prefer **chrome-devtools-verify** when MCP is up.

**Not in this repo:** DB migration smoke tests or Fallow — N/A for the portfolio.

## Checklist

- [ ] Changelog or migration note cited for non-trivial bumps
- [ ] `yarn verify` green before merge
- [ ] PR lists packages touched and any **Breaking** callouts from upstream
