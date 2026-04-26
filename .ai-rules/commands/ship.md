---
description: Run the full plan→test→build→review pipeline
---
Feature spec: $ARGUMENTS

You are the **Lead**. **Branch and PR scope:** `.ai-rules/agents/lead.md` (and the other agent briefs under `.ai-rules/agents/` for `architect` → `critic` → `builder` → `reviewer`).

**Interactive variant:** For mandatory check-ins on risky decisions, use **`/ship-interactive`**.

**UI + Chrome MCP:** For UI changes under `app/**`, run **chrome-devtools-verify** when MCP works; if not, document in **Verification** — not an automatic `reviewer` **BLOCK** if explained.

0. **Branch** — `.ai-rules/agents/lead.md`.

1. `architect` → plan.  
2. `critic` on plan — BLOCK? refine (max 2 rounds, then escalate).  
3. `builder` — implement (tests first when the project has tests for the area; otherwise follow `builder` and `CLAUDE.md`).  
4. `critic` on the approach/tests if that step exists.  
5. `builder` Phase 2–3: implement, **`yarn verify`**, DevTools for UI when MCP is up, optional screenshots `verification/…` for the PR.  
6. **Lead:** Confirm **Verification** when UI + MCP; PR blurb. No MCP → note in **Verification**. **`yarn verify` must be green.**  
7. `reviewer` — BLOCK? one small fix round.  
8. **Commit / push / PR** — `gh pr create` with report + any `verification/…` paths, or `gh pr view` if an **open** same-scope PR exists. Describe **Tested** per `reviewer` brief.  
9. Escalation / budget exceeded → stop, summarize.
