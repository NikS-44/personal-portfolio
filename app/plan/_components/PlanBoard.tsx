"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Link from "next/link";
import { useState } from "react";
import type { Task } from "../_lib/types";
import { BACKLOG_KEY } from "../_lib/types";
import { usePlanBoard } from "../_lib/usePlanBoard";
import PlanColumn, { dayColumnMeta } from "./PlanColumn";
import TaskCard from "./TaskCard";
import WeekSeparator from "./WeekSeparator";

export default function PlanBoard() {
  const {
    hydrated,
    todayKey,
    boardSegments,
    tasksByColumn,
    headerLabel,
    isRolling,
    state,
    act,
    goToPrevWeek,
    goToNextWeek,
    goToToday,
    moveTask,
  } = usePlanBoard();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragStart = (event: DragStartEvent) => {
    const task = state.tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    moveTask(String(active.id), String(over.id));
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-[var(--plan-muted)]">
        Loading planner…
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="flex min-h-dvh flex-col">
        <header className="bg-[var(--plan-surface)]/90 sticky top-0 z-20 flex shrink-0 items-center justify-between gap-4 border-b border-[var(--plan-border)] px-5 py-3 backdrop-blur-md">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              href="/"
              className="hidden text-sm text-[var(--plan-muted)] transition-colors hover:text-[var(--plan-text)] sm:inline"
            >
              ← Home
            </Link>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold tracking-tight text-[var(--plan-text)]">Weekly plan</h1>
              <p className="truncate text-xs text-[var(--plan-muted)]">
                {isRolling ? "From today · next week ahead" : "Browsing past week"}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 rounded-xl border border-[var(--plan-border)] bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={goToPrevWeek}
              className="rounded-lg px-2.5 py-1.5 text-sm text-[var(--plan-muted)] transition-colors hover:bg-[var(--plan-bg)] hover:text-[var(--plan-text)]"
              aria-label="Previous week"
            >
              ‹
            </button>
            {isRolling ? (
              <span className="min-w-[7.5rem] px-2 text-center text-sm font-medium tabular-nums text-[var(--plan-text)]">
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
              <span className="min-w-[7.5rem] px-2 text-center text-sm tabular-nums text-[var(--plan-muted)]">
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
        </header>

        <div className="flex min-h-0 flex-1 gap-3 overflow-x-auto px-4 py-4">
          <PlanColumn
            columnKey={BACKLOG_KEY}
            title="Backlog"
            subtitle="Unscheduled"
            isBacklog
            tasks={tasksByColumn.get(BACKLOG_KEY) ?? []}
            act={act}
            manualOrder={state.manualOrderColumns.includes(BACKLOG_KEY)}
          />

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
                isToday={meta.isToday}
                tasks={tasksByColumn.get(segment.dayKey) ?? []}
                act={act}
                manualOrder={state.manualOrderColumns.includes(segment.dayKey)}
              />
            );
          })}
        </div>
      </div>

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
