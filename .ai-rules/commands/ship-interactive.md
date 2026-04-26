---
description: Full ship pipeline with mandatory human check-ins on risky or non-obvious decisions
---
Feature spec: $ARGUMENTS

You are the **Lead** with **mandatory check-ins** before any controversial or non-straightforward move. **Branch and PR scope** matches **`.ai-rules/agents/lead.md`**. The pipeline is the same family as **`/ship`**, but you **do not** skip clarification, and you **stop and ask** the user (prefer **Cursor AskQuestion**; if unavailable, list numbered options in chat and wait) whenever impact is high, ambiguous, or would normally **BLOCK** in critic review.

**vs `/ship`:** more pauses, more questions. For small mechanical fixes, prefer **`/ship-light`**.

**UI + Chrome MCP:** Same as `/ship` — **chrome-devtools-verify** when MCP works; note skips in **Verification**.

**Check in before going forward when** (non-exhaustive):

- **Data / API routes** (Next route handlers, env, anything user-visible or security-sensitive)
- **Scope cuts** (in vs out of this PR)
- **New dependencies** or heavy patterns
- **UX / a11y tradeoffs** (error copy, loading, keyboard paths)
- **Critic** would **BLOCK**, or the architect flags **non-trivial** risk

0. **Branch** — `.ai-rules/agents/lead.md`.

1. **Clarify** — list ambiguities; **ask and wait** before `architect`.
2. `architect` → plan, then **present the plan and open decision points**; **confirm** before `critic` if anything is still fuzzy.
3. `critic` on plan — if **BLOCK**, **summarize and ask the user** (max 2 critic rounds, then escalate like `/ship`).
4. `builder` — implement; **`yarn verify` green** before calling the work done. At any **controversial** change, **check in** instead of assuming.
5. `reviewer` — BLOCK? one small fix round.
6. **Commit / push / PR** — same as `/ship` (`gh pr create` / `gh pr view`).

7. Stop if budget exceeded; summarize and hand off.
