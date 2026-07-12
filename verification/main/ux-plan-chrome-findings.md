# UX Critique — `/plan` chrome (backlog menu + tooltips)

**Mode:** Full audit  
**Persona:** Returning user, technical, laptop — triage backlog vs week days  
**Branch:** main

### Findings

| #   | Severity        | Heuristic | Finding                                                       | Evidence                             | Recommendation                                                    |
| --- | --------------- | --------- | ------------------------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------- |
| 1   | Major _(fixed)_ | H4 / H6   | Collapsed backlog used vertical text; pin affordance was weak | prior session                        | Header menu toggles backlog; heavier pin strip + 3px right border |
| 2   | Major _(fixed)_ | H3        | Home link competed with planner chrome                        | `ux-plan-chrome-01-load.png`         | Removed; menu is primary left control                             |
| 3   | Major _(fixed)_ | H10       | Sort tooltip used shared `--sort-btn` anchor → wrong place    | `ux-plan-chrome-06-sort-tooltip.png` | Per-column `anchor-name`; `top: anchor(bottom)`                   |
| 4   | Minor _(fixed)_ | H10       | Show/hide backlog had no interest tooltip                     | `ux-plan-chrome-03/05`               | Menu button has Show/Hide backlog hint                            |
| 5   | Minor _(fixed)_ | H2        | Sort icon was abstract list/arrows                            | load screenshot                      | **P + up-arrow** glyph                                            |
| 6   | Minor _(fixed)_ | H9        | React warned `button` cannot be child of `select`             | console                              | Gate custom trigger on `CSS.supports(appearance, base-select)`    |
| 7   | Info            | H8        | Menu count badge is small; readable enough                    | `ux-plan-chrome-05`                  | Keep                                                              |
| 8   | Info            | H1        | No sync/save status yet (local only)                          | —                                    | Add when KV persistence lands                                     |

### Persona Task Completion

- **Goal:** Hide backlog to focus on days, then show it again; understand sort control
- **Completed:** Yes
- **Steps taken:** 3 (menu hide → days fill width → menu show)
- **Dead ends:** none

### Accessibility

- Lighthouse a11y score: **92/100**
- Blockers: none new; muted text contrast remains a known backlog item

### Follow-ups

- [x] Major: Header backlog menu; remove Home; drop vertical rail
- [x] Major: Pin strip contrast / heavy right border
- [x] Major: Fix sort tooltip anchors
- [x] Minor: Menu tooltip; P↑ sort icon; select hydration warning
- [ ] Info: Persist sync indicator when backend lands
