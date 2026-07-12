# Weekend Columns Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Compact muted Sat/Sun columns that auto-expand when they have tasks; overdue incompletes roll to next Monday
from today.

**Architecture:** Extend `boardView`/`dates` to emit weekend day keys; `PlanColumn` gains a dormant mode; awake = any
tasks on that day OR transient (+ draft / drag preview). Rollover simplified to past → next Monday from today.

**Tech stack:** Next.js 14 App Router, React 18, Tailwind + `plan.css`, `@dnd-kit`, localStorage.

---

### Task 1: Date + board segments

**Files:** `app/plan/_lib/dates.ts`, `app/plan/_lib/boardView.ts`

- Add `isWeekendKey`, `getCalendarWeekDayKeys` (Mon–Sun), `getNextMondayFrom(todayKey)`, update
  `rollOverIncompleteTasks`
- Rolling: workdays through Fri + Sat + Sun + separator + next Mon–Fri
- Fixed week: Mon–Sun

### Task 2: Dormant column UI

**Files:** `app/plan/_components/PlanColumn.tsx`, `app/plan/_styles/plan.css`, `PlanBoard.tsx`

- `dormant` prop / weekend compact layout with `+`
- Transient awake via local adding state + drag preview column
- Wire from board using task counts + dropTarget

### Task 3: Verify

- `yarn verify` + DevTools spot-check `/plan`
