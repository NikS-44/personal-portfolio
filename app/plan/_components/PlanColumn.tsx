"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";
import { formatColumnLabel } from "../_lib/dates";
import type { PlanAction } from "../_lib/planReducer";
import { BACKLOG_KEY } from "../_lib/types";
import type { Task } from "../_lib/types";
import TaskCard from "./TaskCard";

type PlanColumnProps = {
  columnKey: string;
  title: string;
  subtitle?: string;
  isToday?: boolean;
  isBacklog?: boolean;
  tasks: Task[];
  act: (action: PlanAction) => void;
  manualOrder: boolean;
};

export default function PlanColumn({
  columnKey,
  title,
  subtitle,
  isToday,
  isBacklog,
  tasks,
  act,
  manualOrder,
}: PlanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: columnKey });
  const [draft, setDraft] = useState("");

  const addTask = () => {
    const titleText = draft.trim();
    if (!titleText) return;
    act({ type: "ADD_TASK", columnKey, title: titleText });
    setDraft("");
  };

  return (
    <section
      className={`flex h-[calc(100dvh-4.5rem)] w-[17.5rem] shrink-0 flex-col overflow-hidden rounded-2xl border shadow-sm ${
        isToday
          ? "ring-[var(--plan-today-border)]/40 border-[var(--plan-today-border)] bg-[var(--plan-today)] shadow-md ring-1"
          : isBacklog
            ? "border-[var(--plan-border)] bg-[#f3f1ed]"
            : "border-[var(--plan-border)] bg-[var(--plan-surface)]"
      }`}
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
          <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium tabular-nums text-[var(--plan-muted)] ring-1 ring-[var(--plan-border)]">
            {tasks.length}
          </span>
        </div>
        {manualOrder ? (
          <button
            type="button"
            onClick={() => act({ type: "RESET_COLUMN_PRIORITY_SORT", columnKey })}
            className="mt-2 text-xs font-medium text-[var(--plan-accent)] hover:underline"
          >
            Sort by priority
          </button>
        ) : null}
      </header>

      <div
        ref={setNodeRef}
        className={`flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2.5 transition-colors ${
          isOver ? "bg-[var(--plan-accent-soft)]/60" : ""
        }`}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} act={act} />
          ))}
        </SortableContext>

        {tasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-[var(--plan-border)] bg-white/40 px-4 py-8 text-center">
            <p className="text-xs leading-relaxed text-[var(--plan-muted)]">
              {isBacklog ? "Queue work here" : "Drop tasks here"}
            </p>
          </div>
        ) : null}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTask();
        }}
        className="shrink-0 border-t border-[var(--plan-border)] bg-white/50 p-2.5 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 rounded-xl border border-[var(--plan-border)] bg-white px-3.5 py-2.5 shadow-sm focus-within:border-[var(--plan-accent)] focus-within:ring-2 focus-within:ring-[var(--plan-accent-soft)]">
          <span className="shrink-0 text-sm text-[var(--plan-muted)]">+</span>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="New task"
            className="min-w-0 flex-1 bg-transparent py-0.5 text-sm text-[var(--plan-text)] placeholder:text-[var(--plan-muted)]"
          />
        </div>
      </form>
    </section>
  );
}

export function dayColumnMeta(dayKey: string, todayKey: string): { title: string; subtitle: string; isToday: boolean } {
  const { weekday, date, isToday } = formatColumnLabel(dayKey, todayKey);
  return { title: weekday, subtitle: date, isToday };
}

export function isBacklogColumn(columnKey: string): boolean {
  return columnKey === BACKLOG_KEY;
}
