"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useEffect, useId, useRef, useState, type HTMLAttributes, type RefObject } from "react";
import { formatColumnLabel, isWeekendKey, toDayKey } from "../_lib/dates";
import { parseQuickAdd } from "../_lib/quickAdd";
import type { PlanAction } from "../_lib/planReducer";
import { isPriorityOrdered } from "../_lib/priority";
import { BACKLOG_KEY } from "../_lib/types";
import type { Task } from "../_lib/types";
import CompletedTaskRow from "./CompletedTaskRow";
import { PlanIconButton } from "./PlanHint";
import TaskCard from "./TaskCard";

type PlanColumnProps = {
  columnKey: string;
  title: string;
  subtitle?: string;
  isToday?: boolean;
  isBacklog?: boolean;
  onToggleCollapsed?: () => void;
  /** When set, close uses dialog command + touch-friendly handlers (mobile sheet). */
  sheetCloseTargetId?: string;
  tasks: Task[];
  act: (action: PlanAction) => void;
  draggingTaskId: string | null;
};

export default function PlanColumn({
  columnKey,
  title,
  subtitle,
  isToday,
  isBacklog,
  onToggleCollapsed,
  sheetCloseTargetId,
  tasks,
  act,
  draggingTaskId,
}: PlanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: columnKey,
    data: { type: "column", columnKey },
  });
  const [listDraft, setListDraft] = useState("");
  const [footerDraft, setFooterDraft] = useState("");
  const [composing, setComposing] = useState(false);
  const [doneOpen, setDoneOpen] = useState(true);
  const composeInputRef = useRef<HTMLInputElement>(null);
  const sortTipId = useId();
  const sortAnchor = `--plan-sort-${columnKey}`;
  const openTasks = tasks.filter((t) => !t.completed);
  const doneTasks = tasks.filter((t) => t.completed);
  const isWeekend = !isBacklog && isWeekendKey(columnKey);
  // Expand while dragging so Sat/Sun are real hit targets (narrow dormant misses closestCorners).
  const dormant = isWeekend && tasks.length === 0 && !composing && draggingTaskId == null;

  useEffect(() => {
    if (!composing) return;
    composeInputRef.current?.focus();
  }, [composing]);

  useEffect(() => {
    if (tasks.length > 0 && composing) setComposing(false);
  }, [tasks.length, composing]);

  const addTask = (raw: string, clear: () => void) => {
    if (!raw.trim()) return;
    const parsed = parseQuickAdd(raw, toDayKey(new Date()));
    act({
      type: "ADD_TASK",
      columnKey: parsed.dayKey ?? columnKey,
      title: parsed.title,
      priority: parsed.priority,
    });
    clear();
    setComposing(false);
  };

  const surfaceClass = isToday
    ? "ring-[var(--plan-today-border)]/40 border-[var(--plan-today-border)] bg-[var(--plan-today)] shadow-md ring-1"
    : isBacklog
      ? "plan-column--backlog"
      : dormant
        ? "plan-column--weekend plan-column--dormant"
        : isWeekend
          ? "plan-column--weekend border-[var(--plan-border)] bg-[var(--plan-surface)]"
          : "border-[var(--plan-border)] bg-[var(--plan-surface)]";

  if (dormant) {
    return (
      <section
        ref={setNodeRef}
        data-column-key={columnKey}
        aria-label={`${title}${subtitle ? `, ${subtitle}` : ""}`}
        className={`plan-column plan-column--weekend plan-column--dormant flex h-full shrink-0 flex-col overflow-hidden rounded-2xl border shadow-sm ${surfaceClass} ${
          isOver ? "plan-column--dormant-over" : ""
        }`}
      >
        <div className="plan-column-dormant">
          <div className="plan-column-dormant__label">
            <span className="plan-column-dormant__day">{title}</span>
            {subtitle ? <span className="plan-column-dormant__date">{subtitle}</span> : null}
            {isToday ? <span className="plan-column-dormant__today">Today</span> : null}
          </div>
          <button
            type="button"
            className="plan-column-dormant__add"
            aria-label={`Add a task for ${title}`}
            onClick={() => setComposing(true)}
          >
            +
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      data-column-key={columnKey}
      aria-label={`${title}${subtitle ? `, ${subtitle}` : ""}`}
      className={`plan-column flex h-full w-[17.5rem] shrink-0 flex-col overflow-hidden rounded-2xl border shadow-sm ${surfaceClass}`}
    >
      <header className="shrink-0 border-b border-[var(--plan-border)] px-3.5 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-[15px] font-semibold tracking-tight text-[var(--plan-text)]">{title}</h2>
              {isToday ? (
                <span className="rounded-full bg-[var(--plan-accent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  Today
                </span>
              ) : null}
            </div>
            {subtitle ? <p className="mt-0.5 text-xs text-[var(--plan-muted)]">{subtitle}</p> : null}
          </div>
          <div className="plan-column-header__meta">
            <span
              className={`plan-column-count ${capacityClass(isBacklog, openTasks.length)}`}
              title={capacityHint(isBacklog, openTasks.length)}
              aria-label={`${openTasks.length} open tasks`}
            >
              {openTasks.length}
            </span>
            {openTasks.length >= 2 && !isPriorityOrdered(openTasks) ? (
              <PlanIconButton
                label="Sort by priority"
                hint="Sort by priority"
                hintId={sortTipId}
                anchorName={sortAnchor}
                hintAlign="end"
                onClick={() => act({ type: "RESET_COLUMN_PRIORITY_SORT", columnKey })}
                className="plan-sort-btn"
              >
                <SortPriorityIcon />
              </PlanIconButton>
            ) : null}
            {isBacklog && onToggleCollapsed ? (
              <button
                type="button"
                aria-label="Hide backlog"
                data-backlog-sheet-close={sheetCloseTargetId ? "" : undefined}
                {...(sheetCloseTargetId
                  ? ({ commandfor: sheetCloseTargetId, command: "close" } as HTMLAttributes<HTMLButtonElement>)
                  : {})}
                onPointerUp={(event) => {
                  if (!sheetCloseTargetId) return;
                  event.stopPropagation();
                  event.preventDefault();
                  onToggleCollapsed();
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  if (sheetCloseTargetId) return;
                  onToggleCollapsed();
                }}
                className={sheetCloseTargetId ? "plan-sort-btn plan-backlog-sheet-close" : "plan-sort-btn"}
              >
                ×
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <div className="plan-column-scroll relative flex min-h-0 flex-1 flex-col">
        <div className="plan-scroll-edge plan-scroll-edge--top" aria-hidden="true" />
        <div
          ref={setNodeRef}
          className={`plan-column-scroll__body flex min-h-0 flex-1 flex-col overflow-y-auto p-2.5 transition-colors ${
            isOver ? "bg-[var(--plan-accent-soft)]/60" : ""
          }`}
        >
          <SortableContext items={openTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {openTasks.map((task) => (
              <TaskCard key={task.id} task={task} act={act} isBeingDragged={draggingTaskId === task.id} />
            ))}
          </SortableContext>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              addTask(listDraft, () => setListDraft(""));
            }}
          >
            <AddTaskField
              value={listDraft}
              onChange={setListDraft}
              placeholder="Add a task…"
              ariaLabel="Add a task in list"
              inputRef={composing ? composeInputRef : undefined}
              onBlurEmpty={() => {
                if (isWeekend && tasks.length === 0 && !listDraft.trim() && !footerDraft.trim()) {
                  setComposing(false);
                }
              }}
            />
          </form>

          {openTasks.length === 0 ? (
            <p className="px-1 py-1 text-center text-[11px] text-[var(--plan-muted)]">
              {isBacklog ? "Queue work here" : "No open tasks"}
            </p>
          ) : null}

          {doneTasks.length > 0 ? (
            <div className="plan-done-section">
              <button
                type="button"
                className="plan-done-section__toggle"
                aria-expanded={doneOpen}
                onClick={() => setDoneOpen((open) => !open)}
              >
                <span className="plan-done-section__chevron" aria-hidden="true">
                  <DoneChevronIcon />
                </span>
                Done · {doneTasks.length}
              </button>
              {doneOpen ? (
                <ul className="plan-done-section__list">
                  {doneTasks.map((task) => (
                    <li key={task.id}>
                      <CompletedTaskRow task={task} act={act} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="plan-scroll-edge plan-scroll-edge--bottom" aria-hidden="true" />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTask(footerDraft, () => setFooterDraft(""));
        }}
        className="shrink-0 border-t border-[var(--plan-border)] bg-[var(--plan-footer-veil)] p-2.5 backdrop-blur-sm"
      >
        <AddTaskField value={footerDraft} onChange={setFooterDraft} placeholder="Add a task…" ariaLabel="Add a task" />
      </form>
    </section>
  );
}

const HEAVY_DAY_THRESHOLD = 7;
const OVERLOADED_DAY_THRESHOLD = 10;

function capacityClass(isBacklog: boolean | undefined, openCount: number): string {
  if (isBacklog) return "";
  if (openCount >= OVERLOADED_DAY_THRESHOLD) return "plan-column-count--over";
  if (openCount >= HEAVY_DAY_THRESHOLD) return "plan-column-count--heavy";
  return "";
}

function capacityHint(isBacklog: boolean | undefined, openCount: number): string | undefined {
  if (isBacklog) return undefined;
  if (openCount >= OVERLOADED_DAY_THRESHOLD) return "Overloaded day — move tasks out";
  if (openCount >= HEAVY_DAY_THRESHOLD) return "Heavy day";
  return undefined;
}

function DoneChevronIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

function SortPriorityIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <text x="1" y="12" fontSize="11" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
        P
      </text>
      <path
        d="M10.5 3.5v9M10.5 3.5L8.5 5.5M10.5 3.5l2 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function dayColumnMeta(dayKey: string, todayKey: string): { title: string; subtitle: string; isToday: boolean } {
  const { weekday, date, isToday } = formatColumnLabel(dayKey, todayKey);
  return { title: weekday, subtitle: date, isToday };
}

export function isBacklogColumn(columnKey: string): boolean {
  return columnKey === BACKLOG_KEY;
}

function AddTaskField({
  value,
  onChange,
  placeholder,
  ariaLabel,
  inputRef,
  onBlurEmpty,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  inputRef?: RefObject<HTMLInputElement>;
  onBlurEmpty?: () => void;
}) {
  return (
    <label className="plan-add-task-field cursor-text">
      <span className="shrink-0 text-sm font-medium text-[var(--plan-accent)]" aria-hidden="true">
        +
      </span>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => {
          if (!value.trim()) onBlurEmpty?.();
        }}
        placeholder={placeholder}
        aria-label={ariaLabel}
        title="Quick add: !p0–!p3 sets priority, @today/@tue/@backlog picks the day"
        className="min-w-0 flex-1 text-[var(--plan-text)] placeholder:text-[var(--plan-muted)]"
      />
    </label>
  );
}
