# Weekend columns (compact until used)

**Date:** 2026-07-11  
**Status:** Approved for planning  
**Surface:** `/plan` weekly board

## Goal

Show Saturday and Sunday on the board without dominating the workweek. Weekend days stay **compact and muted** until the
user adds or drops a task onto that day; then they expand to a normal column. Empty again → compact again (auto).

## Decisions

| Topic            | Choice                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------- |
| Activation       | **Auto** — awake when the day has any task; dormant when empty                           |
| Sat vs Sun       | **Independent**                                                                          |
| Placement        | **C** — rolling: upcoming weekend after this week’s Fri only; fixed week browse: Mon–Sun |
| Visual approach  | **Compact column** (always present, narrow when dormant)                                 |
| Weekday rollover | Past incomplete weekday → **next Monday from today**                                     |
| Weekend rollover | Past incomplete weekend day → **next Monday from today** (lands on weekdays)             |

## Board layout

### Rolling view (`fixedWeekStart === null`)

1. Remaining workdays from rolling start through this Friday
2. **This Saturday + this Sunday** (compact if empty)
3. Week separator + next Mon–Fri
4. **No** next-week weekend columns

### Fixed week browse

Full **Mon–Sun** for that week’s Monday start.

## Dormant column UX

- Width ~5–6rem (vs ~17.5rem awake)
- Muted/gray surface; short label (`Sat`/`Sun` + date)
- No open task list, no Done section, no full add form
- **`+` control** opens/focuses add for that day; first created task wakes the column
- Column remains a **droppable**; drag-over may temporarily show an awake-sized slot preview; committed drop with a task
  keeps it awake
- Drag cancel with no tasks left → back to dormant

## Awake column UX

Same structure and width as weekday columns (header, list, add, Done).

**Awake condition:** `tasks.filter(t => t.dayKey === weekendKey).length > 0`  
Optional transient awake: focused `+` add draft, or live drag preview into that column (clears if cancel/empty).

## Rollover (hydrate / load)

Replace current “force all weekend tasks onto Monday immediately” and “past weekdays → rolling anchor (today)” with:

1. Skip backlog and completed tasks.
2. If incomplete and `dayKey < todayKey`:
   - **Any** past day (weekday or weekend) → set `dayKey` to **next Monday from today**.
3. If `dayKey === todayKey` or future → leave in place.
4. Incomplete tasks still on a **future** weekend stay on that weekend (so the column can wake).

Clarification locked with product: “next Monday from today” is the single overdue target (option A), including weekend →
weekdays.

## Non-goals

- Paired “weekend rail” that expands Sat+Sun together
- Persisted “force expand weekend” preference
- Showing next week’s Sat/Sun in rolling view
- Changing backlog or Done semantics beyond column presence

## Implementation sketch (for planning)

- `dates.ts` / `boardView.ts`: emit Sat/Sun in segments; helpers for weekend keys and next Monday from today
- `rollOverIncompleteTasks`: new rules above
- `PlanColumn`: `dormant` / `isWeekend` visual mode + `+` affordance
- `plan.css`: compact weekend styles
- DnD: weekend keys already valid column ids once present on the board; preview/awake interaction as above
- Verify: `yarn verify`; chrome DevTools spot-check dormant → drop → awake → empty → dormant

## Open points for implementer

- Exact compact width and motion (CSS transition width vs instant) — prefer short width transition if cheap
- Whether Done-only weekend (all completed) stays awake: **yes** (any task including completed counts), until tasks are
  deleted/moved away
