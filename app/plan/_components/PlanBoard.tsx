"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCorners,
  pointerWithin,
  useDndMonitor,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type MutableRefObject,
  type PointerEvent,
} from "react";
import type { Task } from "../_lib/types";
import { BACKLOG_KEY } from "../_lib/types";
import { usePlanBoard, type DropTarget } from "../_lib/usePlanBoard";
import { isColumnKey } from "../_lib/planReducer";
import { PlanIconButton } from "./PlanHint";
import PlanColumn, { dayColumnMeta } from "./PlanColumn";
import PlanMenu from "./PlanMenu";
import PlanThemeToggle from "./PlanThemeToggle";
import PlanToast from "./PlanToast";
import TaskCard from "./TaskCard";
import WeekSeparator from "./WeekSeparator";

const BACKLOG_OPEN_KEY = "plan-backlog-open";
const PLAN_BACKLOG_SHEET_ID = "plan-backlog-sheet";
const MOBILE_MQ = "(max-width: 640px)";

/** Prefer pointer hits (whole column shell); task cards win over their column container. */
const planCollisionDetection: CollisionDetection = (args) => {
  const activeId = args.active.id;
  const pointerHits = pointerWithin(args).filter((hit) => hit.id !== activeId);
  if (pointerHits.length > 0) {
    const taskHit = pointerHits.find((hit) => !isColumnKey(String(hit.id)));
    if (taskHit) return [taskHit];
    return pointerHits;
  }
  return closestCorners(args).filter((hit) => hit.id !== activeId);
};

type BoardLayout = "unknown" | "mobile" | "desktop";

type PlanDragMonitorProps = {
  resolveDropTarget: (taskId: string, overId: string) => DropTarget | null;
  dropTargetRef: MutableRefObject<DropTarget | null>;
  dropHighlightRef: MutableRefObject<string | null>;
};

const DROP_TARGET_CLASS = "plan-column--drop-target";

function syncDropTargetHighlight(columnKey: string | null, prevColumnKey: string | null) {
  if (prevColumnKey && prevColumnKey !== columnKey) {
    document.querySelector(`[data-column-key="${CSS.escape(prevColumnKey)}"]`)?.classList.remove(DROP_TARGET_CLASS);
  }
  if (columnKey && columnKey !== prevColumnKey) {
    document.querySelector(`[data-column-key="${CSS.escape(columnKey)}"]`)?.classList.add(DROP_TARGET_CLASS);
  }
}

/** Must render inside DndContext — tracks drop target without React re-renders while dragging. */
function PlanDragMonitor({ resolveDropTarget, dropTargetRef, dropHighlightRef }: PlanDragMonitorProps) {
  useDndMonitor({
    onDragMove(event) {
      const { active, over } = event;
      if (!over) {
        const prev = dropHighlightRef.current;
        dropTargetRef.current = null;
        dropHighlightRef.current = null;
        if (prev) syncDropTargetHighlight(null, prev);
        return;
      }
      const target = resolveDropTarget(String(active.id), String(over.id));
      if (!target) return;
      dropTargetRef.current = target;
      if (target.columnKey === dropHighlightRef.current) return;
      const prev = dropHighlightRef.current;
      dropHighlightRef.current = target.columnKey;
      syncDropTargetHighlight(target.columnKey, prev);
    },
    onDragEnd() {
      const prev = dropHighlightRef.current;
      dropTargetRef.current = null;
      dropHighlightRef.current = null;
      if (prev) syncDropTargetHighlight(null, prev);
    },
    onDragCancel() {
      const prev = dropHighlightRef.current;
      dropTargetRef.current = null;
      dropHighlightRef.current = null;
      if (prev) syncDropTargetHighlight(null, prev);
    },
  });
  return null;
}

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
    tasksByColumn,
    toast,
    dismissToast,
    undoToast,
    notify,
    syncStatus,
  } = usePlanBoard();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const dropTargetRef = useRef<DropTarget | null>(null);
  const dropHighlightRef = useRef<string | null>(null);
  const [backlogOpen, setBacklogOpen] = useState(false);
  const [boardLayout, setBoardLayout] = useState<BoardLayout>("unknown");
  const backlogPinRef = useRef<HTMLElement>(null);
  const backlogSheetRef = useRef<HTMLDialogElement>(null);
  const layoutRef = useRef<BoardLayout>("unknown");
  const backlogTipId = useId();
  const backlogAnchor = "--plan-backlog-menu";

  layoutRef.current = boardLayout;

  const boardIsDragging = draggingTaskId != null;

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

  const closeBacklogSheet = () => {
    if (layoutRef.current === "mobile") {
      backlogSheetRef.current?.close();
      return;
    }
    setBacklogOpenPersisted(false);
  };

  const toggleBacklog = () => {
    if (backlogOpen && layoutRef.current === "mobile") {
      closeBacklogSheet();
      return;
    }
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
      if (dialog.open) dialog.close();
      return;
    }

    if (backlogOpen && !dialog.open) {
      dialog.showModal();
    } else if (!backlogOpen && dialog.open) {
      dialog.close();
    }
  }, [backlogOpen, boardLayout]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 160, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

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

  const displayByColumn = tasksByColumn;

  const onDragStart = (event: DragStartEvent) => {
    const taskId = String(event.active.id);
    const task = state.tasks.find((t) => t.id === taskId);
    const prevHighlight = dropHighlightRef.current;
    setDraggingTaskId(taskId);
    setActiveTask(task ?? null);
    dropTargetRef.current = null;
    dropHighlightRef.current = null;
    if (prevHighlight) syncDropTargetHighlight(null, prevHighlight);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const taskId = String(active.id);
    const target =
      dropTargetRef.current ?? (over && over.id !== active.id ? resolveDropTarget(taskId, String(over.id)) : null);
    setActiveTask(null);
    setDraggingTaskId(null);
    dropTargetRef.current = null;
    dropHighlightRef.current = null;
    if (!target) return;
    commitDrop(taskId, target);
  };

  const onDragCancel = () => {
    setActiveTask(null);
    setDraggingTaskId(null);
    dropTargetRef.current = null;
    dropHighlightRef.current = null;
  };

  const onBacklogSheetClose = () => {
    if (layoutRef.current !== "mobile") return;
    setBacklogOpenPersisted(false);
  };

  const onBacklogSheetPointerUp = (event: PointerEvent<HTMLDialogElement>) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!target.closest("[data-backlog-sheet-close]")) return;
    event.preventDefault();
    event.stopPropagation();
    closeBacklogSheet();
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
      onToggleCollapsed={closeBacklogSheet}
      sheetCloseTargetId={boardLayout === "mobile" ? PLAN_BACKLOG_SHEET_ID : undefined}
      tasks={backlogTasks}
      act={act}
      draggingTaskId={draggingTaskId}
      dragEnabled={boardLayout !== "mobile"}
      boardIsDragging={boardIsDragging}
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
      collisionDetection={planCollisionDetection}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <PlanDragMonitor
        resolveDropTarget={resolveDropTarget}
        dropTargetRef={dropTargetRef}
        dropHighlightRef={dropHighlightRef}
      />
      <main
        id="plan-board"
        tabIndex={-1}
        className={`flex min-h-0 flex-col outline-none${boardIsDragging ? "plan-board--dragging" : ""}`}
      >
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
                    dragEnabled={boardLayout !== "mobile"}
                    boardIsDragging={boardIsDragging}
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
          id={PLAN_BACKLOG_SHEET_ID}
          ref={backlogSheetRef}
          className="plan-backlog-sheet"
          aria-label="Backlog"
          onClose={onBacklogSheetClose}
          onPointerUp={onBacklogSheetPointerUp}
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
