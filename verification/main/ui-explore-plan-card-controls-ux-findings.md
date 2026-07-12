# UX Critique — Plan card controls (UI Explore)

**Mode:** Heuristic sweep  
**Scope:** `/ui-explore/plan-card-controls` + shipping `/plan` interactables  
**Branch:** main  
**Date:** 2026-07-11

## Findings

| #   | Severity | Heuristic | Finding                                                                                                                                            | Affected variant(s)        | Evidence                                                              |
| --- | -------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | --------------------------------------------------------------------- |
| 1   | high     | H1 / H6   | Expand/collapse + complete/delete were hover-gated (`opacity: 0`), so the accordion caret disappeared until hover — primary control felt "missing" | Current / shipping `/plan` | `ux-plan-controls-02-after-fixes.png`; DOM `opacity: "0"` on Collapse |
| 2   | high     | H4        | Priority `::picker-icon` rotate orbited off-center; animation made the control feel broken                                                         | Current / shipping         | Prior session + `ux-plan-controls-01-load.png`                        |
| 3   | medium   | H4        | Accordion caret previously pointed sideways (`-rotate-90`); wrong mental model vs expand/collapse                                                  | Current / shipping         | Fixed: up when collapsed, down when open (DOM-verified paths)         |
| 4   | medium   | H1        | Dense row priority used `appearance: none` with no caret → looked like a static badge                                                              | Dense                      | `ui-explore-plan-card-dense.png`                                      |
| 5   | medium   | H5        | Popover priority open could confuse with expand/collapse (shared card click surface)                                                               | Popover                    | `ui-explore-plan-card-popover-after-menu.png`                         |
| 6   | medium   | H8        | Segmented P0–P3 is highly discoverable but noisy on every card; spends width                                                                       | Segmented                  | `ui-explore-plan-card-segmented.png`                                  |
| 7   | low      | H7        | Always-visible adds a permanent checkbox column — clearer, slightly denser                                                                         | Always visible             | `ui-explore-plan-card-always-visible.png`                             |
| 8   | low      | H2        | Labeled "Details / Hide" is clearest for first-time users but less compact                                                                         | Popover                    | `ui-explore-plan-card-popover.png`                                    |

## Iteration applied (one round)

- Shipping `/plan`: expand chevron always visible (`.plan-card__action--expand`); priority uses owned SVG caret, native
  `::picker-icon` hidden (no rotate).
- Explore Current: expand always visible; complete/delete stay hover.
- Explore Dense: added static SVG caret on priority.
- Explore Popover: `stopPropagation` on priority menu button.

## Accessibility (spot)

- Expand buttons expose `aria-expanded` / clear labels in Always visible, Segmented, Popover, Dense.
- Priority selects have `aria-label="Priority"` (or group label on segmented).
- Remaining: muted text contrast on shipping board (from prior audit) not re-litigated here.

## Persona (light)

- **Goal:** Change priority and expand a task without hunting for controls
- **Completed:** Yes on Always visible / Segmented / Dense; Partial on Current before iteration
- **Dead ends:** none after expand always-on
