"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCorners,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useEffect, useId, useMemo, useRef, useState, type HTMLAttributes, type MouseEvent } from "react";
import type { Task } from "../_lib/types";
import { BACKLOG_KEY } from "../_lib/types";
import { usePlanBoard, type DropTarget } from "../_lib/usePlanBoard";
import { PlanIconButton } from "./PlanHint";
import PlanColumn, { dayColumnMeta } from "./PlanColumn";
import PlanMenu from "./PlanMenu";
import PlanThemeToggle from "./PlanThemeToggle";
import PlanToast from "./PlanToast";
import TaskCard from "./TaskCard";
import WeekSeparator from "./WeekSeparator";

const BACKLOG_OPEN_KEY = "plan-backlog-open";
const MOBILE_MQ = "(max-width: 640px)";

type BoardLayout = "unknown" | "mobile" | "desktop";

export default function PlanBoard() {
  const {
    hydrated,
    todayKey,
    boardSegments,
    headerLabel,
    isRolling,
    viewMode,
    state,
    act,
    setMode,
    goToPrevWeek,
    goToNextWeek,
    goToToday,
    commitDrop,
    resolveDropTarget,
    previewTasksByColumn,
    toast,
    dismissToast,
    undoToast,
    notify,
    syncStatus,
  } = usePlanBoard();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);
  const dropTargetRef = useRef<DropTarget | null>(null);
  const [backlogOpen, setBacklogOpen] = useState(false);
  const [boardLayout, setBoardLayout] = useState<BoardLayout>("unknown");
  const backlogPinRef = useRef<HTMLElement>(null);
  const backlogSheetRef = useRef<HTMLDialogElement>(null);
  const layoutRef = useRef<BoardLayout>("unknown");
  const suppressSheetCloseRef = useRef(false);
  const backlogTipId = useId();
  const backlogAnchor = "--plan-backlog-menu";

  layoutRef.current = boardLayout;

  const updateDropTarget = (target: DropTarget | null) => {
    dropTargetRef.current = target;
    setDropTarget(target);
  };

  const persistBacklogOpen = (next: boolean) => {
    try {
      window.localStorage.setItem(BACKLOG_OPEN_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  const setBacklogOpenPersisted = (next: boolean) => {
    setBacklogOpen(next);
    persistBacklogOpen(next);
  };

  const toggleBacklog = () => {
    setBacklogOpen((prev) => {
      const next = !prev;
      persistBacklogOpen(next);
      return next;
    });
  };

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const sync = () => {
      setBoardLayout(mq.matches ? "mobile" : "desktop");
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const pin = backlogPinRef.current;
    if (pin) pin.inert = !backlogOpen;
  }, [backlogOpen, boardLayout]);

  useEffect(() => {
    try {
      const mobile = window.matchMedia(MOBILE_MQ).matches;
      // Sheet should not auto-open on phones; desktop restores pin preference.
      if (mobile) {
        setBacklogOpen(false);
        return;
      }
      const raw = window.localStorage.getItem(BACKLOG_OPEN_KEY);
      if (raw === "0") setBacklogOpen(false);
      else if (raw === "1") setBacklogOpen(true);
      else if (window.localStorage.getItem("plan-backlog-collapsed") === "1") {
        setBacklogOpen(false);
      } else {
        setBacklogOpen(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const dialog = backlogSheetRef.current;
    if (!dialog) return;

    if (boardLayout !== "mobile") {
      if (dialog.open) {
        suppressSheetCloseRef.current = true;
        dialog.close();
        suppressSheetCloseRef.current = false;
      }
      return;
    }

    if (backlogOpen && !dialog.open) {
      dialog.showModal();
    } else if (!backlogOpen && dialog.open) {
      suppressSheetCloseRef.current = true;
      dialog.close();
      suppressSheetCloseRef.current = false;
    }
  }, [backlogOpen, boardLayout]);

  const desktopSensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 160, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const sensors = boardLayout === "mobile" ? [] : desktopSensors;

  /* ── Global keyboard shortcuts (card-level ones live in TaskCard) ── */

  const shortcutsRef = useRef({ viewMode, todayKey, goToPrevWeek, goToNextWeek, act, setMode, toggleBacklog });
  shortcutsRef.current = { viewMode, todayKey, goToPrevWeek, goToNextWeek, act, setMode, toggleBacklog };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      const target = event.target as HTMLElement | null;
      if (target && isEditableTarget(target)) return;

      const { viewMode: mode, todayKey: today, ...api } = shortcutsRef.current;
      const modifier = event.metaKey || event.ctrlKey;

      if (modifier && event.key.toLowerCase() === "z") {
        event.preventDefault();
        api.act({ type: event.shiftKey ? "REDO" : "UNDO" });
        return;
      }
      if (modifier || event.altKey) return;

      switch (event.key) {
        case "n": {
          event.preventDefault();
          const field = document.querySelector<HTMLInputElement>(
            `[data-column-key="${today}"] .plan-add-task-field input`,
          );
          field?.focus();
          break;
        }
        case "b":
          event.preventDefault();
          api.toggleBacklog();
          break;
        case "t":
          event.preventDefault();
          api.setMode("today");
          break;
        case "w":
          event.preventDefault();
          api.setMode("week");
          break;
        case "ArrowLeft":
          if (mode === "week") api.goToPrevWeek();
          break;
        case "ArrowRight":
          if (mode === "week") api.goToNextWeek();
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const displayByColumn = useMemo(
    () => previewTasksByColumn(draggingTaskId, dropTarget),
    [previewTasksByColumn, draggingTaskId, dropTarget],
  );

  const onDragStart = (event: DragStartEvent) => {
    const taskId = String(event.active.id);
    const task = state.tasks.find((t) => t.id === taskId);
    setDraggingTaskId(taskId);
    setActiveTask(task ?? null);
    updateDropTarget(null);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const target = resolveDropTarget(String(active.id), String(over.id));
    if (!target) return;
    const prev = dropTargetRef.current;
    if (prev && prev.columnKey === target.columnKey && prev.index === target.index) {
      return;
    }
    updateDropTarget(target);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const taskId = String(active.id);
    const target =
      dropTargetRef.current ?? (over && over.id !== active.id ? resolveDropTarget(taskId, String(over.id)) : null);
    setActiveTask(null);
    setDraggingTaskId(null);
    updateDropTarget(null);
    if (!target) return;
    commitDrop(taskId, target);
  };

  const onDragCancel = () => {
    setActiveTask(null);
    setDraggingTaskId(null);
    updateDropTarget(null);
  };

  const onBacklogSheetClose = () => {
    if (suppressSheetCloseRef.current) return;
    if (layoutRef.current !== "mobile") return;
    setBacklogOpenPersisted(false);
  };

  const onBacklogSheetClick = (event: MouseEvent<HTMLDialogElement>) => {
    if ("closedBy" in HTMLDialogElement.prototype) return;
    if (event.target !== event.currentTarget) return;
    event.currentTarget.close();
  };

  const backlogTasks = displayByColumn.get(BACKLOG_KEY) ?? [];
  const backlogOpenCount = backlogTasks.filter((t) => !t.completed).length;

  const backlogColumn = (
    <PlanColumn
      columnKey={BACKLOG_KEY}
      title="Backlog"
      subtitle="Unscheduled"
      isBacklog
      onToggleCollapsed={() => setBacklogOpenPersisted(false)}
      tasks={backlogTasks}
      act={act}
      draggingTaskId={draggingTaskId}
    />
  );

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-[var(--plan-muted)]">
        Loading planner…
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <main id="plan-board" tabIndex={-1} className="flex min-h-0 flex-col outline-none">
        <header className="bg-[var(--plan-surface)]/90 sticky top-0 z-20 flex shrink-0 items-center justify-between gap-4 border-b border-[var(--plan-border)] px-4 py-3 backdrop-blur-md">
          <div className="flex min-w-0 items-center gap-3">
            <PlanIconButton
              label={backlogOpen ? "Hide backlog" : "Show backlog"}
              hint={backlogOpen ? "Hide backlog" : "Show backlog"}
              hintId={backlogTipId}
              anchorName={backlogAnchor}
              pressed={backlogOpen}
              onClick={toggleBacklog}
              className={`plan-menu-btn ${backlogOpen ? "plan-menu-btn--active" : ""}`}
            >
              <BacklogIcon />
              {backlogOpenCount > 0 ? (
                <span className="plan-menu-btn__count" aria-hidden="true">
                  {backlogOpenCount}
                </span>
              ) : null}
            </PlanIconButton>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold tracking-tight text-[var(--plan-text)]">
                {viewMode === "today" ? "Today" : "Weekly plan"}
              </h1>
              <p className="truncate text-xs text-[var(--plan-muted)]">
                {viewMode === "today" ? headerLabel : isRolling ? "From today · next week ahead" : "Browsing past week"}
              </p>
            </div>
          </div>

          <div className="plan-header-controls flex shrink-0 items-center gap-2">
            <div className="plan-seg" role="group" aria-label="Board view">
              <button
                type="button"
                className={`plan-seg__btn ${viewMode === "today" ? "plan-seg__btn--active" : ""}`}
                aria-pressed={viewMode === "today"}
                onClick={() => setMode("today")}
              >
                Today
              </button>
              <button
                type="button"
                className={`plan-seg__btn ${viewMode === "week" ? "plan-seg__btn--active" : ""}`}
                aria-pressed={viewMode === "week"}
                onClick={() => setMode("week")}
              >
                Week
              </button>
            </div>

            {viewMode === "week" ? (
              <div className="plan-week-nav flex shrink-0 items-center gap-1.5 rounded-xl border border-[var(--plan-border)] bg-[var(--plan-elevated)] p-1 shadow-sm">
                <button
                  type="button"
                  onClick={goToPrevWeek}
                  className="rounded-lg px-2.5 py-1.5 text-sm text-[var(--plan-muted)] transition-colors hover:bg-[var(--plan-bg)] hover:text-[var(--plan-text)]"
                  aria-label="Previous week"
                >
                  ‹
                </button>
                {isRolling ? (
                  <span className="plan-week-nav__label px-2 text-center text-sm font-medium tabular-nums text-[var(--plan-text)]">
                    {headerLabel}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={goToToday}
                    className="rounded-lg bg-[var(--plan-accent)] px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  >
                    Today
                  </button>
                )}
                {!isRolling ? (
                  <span className="plan-week-nav__label px-2 text-center text-sm tabular-nums text-[var(--plan-muted)]">
                    {headerLabel}
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={goToNextWeek}
                  className="rounded-lg px-2.5 py-1.5 text-sm text-[var(--plan-muted)] transition-colors hover:bg-[var(--plan-bg)] hover:text-[var(--plan-text)]"
                  aria-label="Next week"
                >
                  ›
                </button>
              </div>
            ) : null}

            <PlanThemeToggle />
            <PlanMenu state={state} act={act} notify={notify} syncStatus={syncStatus} />
          </div>
        </header>

        <div className="plan-board-body flex min-h-0 flex-1">
          {boardLayout === "desktop" ? (
            <aside
              ref={backlogPinRef}
              className={`plan-backlog-pin shrink-0 ${backlogOpen ? "plan-backlog-pin--open" : "plan-backlog-pin--closed"}`}
              aria-hidden={!backlogOpen}
            >
              <div className="plan-backlog-pin__inner">{backlogColumn}</div>
            </aside>
          ) : null}

          <div className="plan-board-scroll relative flex min-h-0 min-w-0 flex-1">
            <div className="plan-scroll-edge plan-scroll-edge--start" aria-hidden="true" />
            <div
              className={`plan-board-scroll__body flex min-h-0 min-w-0 flex-1 gap-3 overflow-x-auto overflow-y-hidden px-4 py-4 ${
                viewMode === "today" ? "plan-board-scroll__body--today" : ""
              }`}
              aria-label="Day columns"
            >
              {boardSegments.map((segment) => {
                if (segment.kind === "separator") {
                  return <WeekSeparator key={`sep-${segment.weekStart}`} label={segment.label} />;
                }

                const meta = dayColumnMeta(segment.dayKey, todayKey);
                return (
                  <PlanColumn
                    key={segment.dayKey}
                    columnKey={segment.dayKey}
                    title={meta.title}
                    subtitle={meta.subtitle}
                    isToday={meta.isToday && viewMode !== "today"}
                    tasks={displayByColumn.get(segment.dayKey) ?? []}
                    act={act}
                    draggingTaskId={draggingTaskId}
                  />
                );
              })}
            </div>
            <div className="plan-scroll-edge plan-scroll-edge--end" aria-hidden="true" />
          </div>
        </div>

        <PlanToast toast={toast} onUndo={undoToast} onDismiss={dismissToast} />
      </main>

      {boardLayout === "mobile" ? (
        <dialog
          ref={backlogSheetRef}
          className="plan-backlog-sheet"
          aria-label="Backlog"
          onClose={onBacklogSheetClose}
          onClick={onBacklogSheetClick}
          {...({ closedby: "any" } as HTMLAttributes<HTMLDialogElement>)}
        >
          <div className="plan-backlog-sheet__handle" aria-hidden="true" />
          <div className="plan-backlog-sheet__body">{backlogColumn}</div>
        </dialog>
      ) : null}

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="w-[17.5rem] rotate-1 scale-[1.02] opacity-95">
            <TaskCard task={activeTask} act={act} isDraggingOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function isEditableTarget(el: HTMLElement): boolean {
  if (el.closest("input, textarea, select, [contenteditable], dialog")) return true;
  try {
    if (el.closest("[popover]:popover-open")) return true;
  } catch {
    /* engines without :popover-open */
  }
  return false;
}

function BacklogIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true">
      <rect x="3.25" y="2.75" width="9.5" height="11" rx="1.25" strokeWidth="1.35" />
      <path
        d="M6 2.75h4v1.15c0 .41-.34.75-.75.75h-2.5a.75.75 0 0 1-.75-.75V2.75Z"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M5.75 7.25h4.5M5.75 9.75h4.5M5.75 12.25h3" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}
