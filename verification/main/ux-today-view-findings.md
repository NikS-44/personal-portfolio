## UX Critique — Today view (spacious desktop)

**Mode:** Heuristic sweep  
**Persona:** Daily planner on laptop (1280px), scans Today list without expanding every card  
**Branch:** main

### Scope

- `/plan` Today view with `plan-board--today-view` (desktop ≥641px)
- Comparison: Week view, mobile (390px) compact layout
- 3-line notes preview in collapsed cards (desktop Today only)

### Findings

| #   | Severity | Heuristic | Finding                                                                               | Evidence                                                             | Recommendation                 |
| --- | -------- | --------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------ |
| 1   | Minor    | H6        | Collapsed cards now show up to 3 lines of notes on Today (desktop); Week stays 1 line | `ux-today-view-03-notes-preview.png`; `lineClamp: 3` at 1280px       | Ship as-is — matches request   |
| 2   | Minor    | H7        | Desktop Today uses 2rem action/done targets and wider column (`min(36rem)`)           | `ux-today-view-04-spacious-no-backlog.png`; padding `12px 14px`      | Ship as-is                     |
| 3   | Minor    | H4        | Mobile (≤640px) keeps compact padding and 1-line preview even in Today view           | `ux-today-view-05-mobile-compact.png`; `lineClamp: 1`, padding `6px` | Ship as-is — intentional split |
| 4   | Minor    | H8        | Week view unchanged (dense cards, 1-line preview)                                     | `ux-week-view-02-comparison.png`                                     | Expected; no action            |
| 5   | Info     | H4        | `PrioritySelect` renders `<button>` inside `<select>` — hydration warning in console  | Console msgid=29                                                     | Fix separately (pre-existing)  |
| 6   | Info     | H1        | Sync API returns 401 in dev (expected without auth)                                   | Console msgid=27                                                     | No action for UI change        |

### Persona Task Completion

- **Goal:** Scan Today tasks and read note previews without expanding each card
- **Completed:** Yes
- **Steps taken:** 1 (open Today, read collapsed cards)
- **Dead ends:** none

### Accessibility

- Lighthouse a11y score: **93/100** (desktop snapshot)
- Blockers: none for this change set

### Chrome DevTools verify

| Check                                       | Result |
| ------------------------------------------- | ------ |
| `plan-board--today-view` on Today           | ✓      |
| 3-line `-webkit-line-clamp` (desktop Today) | ✓      |
| 1-line clamp (mobile Today, Week)           | ✓      |
| Column width 576px / 36rem (desktop)        | ✓      |
| 2rem touch targets (actions, done)          | ✓      |

### Follow-ups

- [ ] Optional: fix `PrioritySelect` invalid HTML (hydration warning)
- [ ] Optional: re-run `ux-critique` on shipped Week view if week cards should also get moderate desktop padding
