---
name: design-doc
description: Write concise engineering design documents for features, refactors, APIs, migrations, or system changes. Use when the user asks for a design doc, technical proposal, RFC, implementation design, or written plan for review.
---

# Design Doc

Use for work that needs shared understanding before implementation. For short decision records, use `architecture-adr`; for implementation after approval, use the relevant build skill.

## Process

1. Clarify the goal, non-goals, constraints, and success criteria.
2. Read the current code paths before proposing changes.
3. Identify affected modules, contracts, data flow, and verification gates.
4. Compare meaningful options when trade-offs exist.
5. Recommend one approach and explain why it fits this repo.
6. Include rollout, risks, test plan, and open questions.

## Template

```markdown
# Design: <title>

## Summary

## Goals

## Non-Goals

## Current State

## Proposed Design

## Alternatives Considered

## Data / API Contracts

## Testing and Verification

## Rollout and Risks

## Open Questions
```

## Repo Guidance

- Cite specific files and existing patterns.
- Prefer existing stack choices from `CLAUDE.md` unless the design justifies a new tool.
- For **Next.js App Router** work: be explicit about **server vs client** components, data fetching, and route segments affected.
- Include validation and error-handling for any API routes or server actions you introduce.
- Include **chrome-devtools-verify** (or manual checks) for UI/routes when MCP is available.

## Keep It Reviewable

- Keep the main document concise; link references instead of dumping large code.
- Mark assumptions clearly.
- Separate “decision needed” from “implementation detail”.
- Do not hide unresolved trade-offs.
