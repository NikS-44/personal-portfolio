"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useId, useRef, useState, type CSSProperties, type HTMLAttributes } from "react";
import { addDays, formatOverdueFrom, formatTaskAge, nextWorkday, parseDayKey, toDayKey } from "../_lib/dates";
import type { PlanAction } from "../_lib/planReducer";
import type { Priority } from "../_lib/types";
import { BACKLOG_KEY } from "../_lib/types";
import type { Task } from "../_lib/types";
import PrioritySelect from "./PrioritySelect";

type TaskCardProps = {
  task: Task;
  act: (action: PlanAction) => void;
  isDraggingOverlay?: boolean;
  isBeingDragged?: boolean;
  /** Cross-column drag preview ghost — must not register a second sortable id. */
  disableSortable?: boolean;
};

export default function TaskCard({
  task,
  act,
  isDraggingOverlay = false,
  isBeingDragged = false,
  disableSortable = false,
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: isDraggingOverlay || disableSortable,
    data: { type: "task", columnKey: task.dayKey },
  });

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(task.title);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState(task.notes);
  const [newSubtask, setNewSubtask] = useState("");
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const schedulePopRef = useRef<HTMLDivElement>(null);
  const skipClickRef = useRef(false);
  const scheduleId = useId();
  const scheduleAnchor = `--plan-sched-${task.id}`;
  const inBacklog = task.dayKey === BACKLOG_KEY;

  useEffect(() => {
    if (!editingTitle) return;
    titleRef.current?.focus();
  }, [editingTitle]);

  useEffect(() => {
    if (editingNotes) notesRef.current?.focus();
  }, [editingNotes]);

  useEffect(() => {
    if (isDragging) skipClickRef.current = true;
  }, [isDragging]);

  const shouldSkipClick = () => {
    if (!skipClickRef.current) return false;
    skipClickRef.current = false;
    return true;
  };

  const stopDragActivation = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  const style = isDraggingOverlay
    ? undefined
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isBeingDragged ? 0 : isDragging ? 0.35 : 1,
      };

  const commitTitle = () => {
    setEditingTitle(false);
    const next = titleDraft.trim() || "Untitled task";
    setTitleDraft(next);
    if (next !== task.title) act({ type: "UPDATE_TASK", taskId: task.id, patch: { title: next } });
  };

  const commitNotes = () => {
    setEditingNotes(false);
    if (notesDraft !== task.notes) act({ type: "UPDATE_TASK", taskId: task.id, patch: { notes: notesDraft } });
  };

  const onPriorityChange = (priority: Task["priority"]) => {
    act({ type: "UPDATE_TASK", taskId: task.id, patch: { priority } });
  };

  const toggleCollapse = () => {
    act({ type: "TOGGLE_COLLAPSE", taskId: task.id });
  };

  const moveToBacklog = () => {
    if (inBacklog) return;
    act({ type: "MOVE_TASK", taskId: task.id, toColumn: BACKLOG_KEY, toIndex: 0 });
  };

  const deleteTask = () => {
    act({ type: "DELETE_TASK", taskId: task.id });
  };

  const scheduleTo = (dayKey: string) => {
    schedulePopRef.current?.hidePopover();
    if (dayKey === task.dayKey) return;
    // Large index = append; keeps the destination's priority sort intact.
    act({ type: "MOVE_TASK", taskId: task.id, toColumn: dayKey, toIndex: Number.MAX_SAFE_INTEGER });
  };

  const scheduleOptions = (): { label: string; dayKey: string }[] => {
    const today = toDayKey(new Date());
    const options: { label: string; dayKey: string }[] = [];
    const push = (label: string, dayKey: string) => {
      if (dayKey !== task.dayKey && !options.some((o) => o.dayKey === dayKey)) options.push({ label, dayKey });
    };
    const dayLabel = (dayKey: string) =>
      parseDayKey(dayKey).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

    push("Today", today);
    const first = nextWorkday(today);
    const second = nextWorkday(first);
    push(first === addDays(today, 1) ? "Tomorrow" : dayLabel(first), first);
    push(dayLabel(second), second);
    push("Backlog", BACKLOG_KEY);
    return options;
  };

  const startTitleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (shouldSkipClick()) return;
    if (task.collapsed) act({ type: "TOGGLE_COLLAPSE", taskId: task.id });
    setTitleDraft(task.title);
    setEditingTitle(true);
  };

  const handleCardClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isDraggingOverlay) return;
    if (shouldSkipClick()) return;
    const target = event.target as HTMLElement;
    if (target.closest("button, input, textarea, select, a, form, dialog")) return;
    toggleCollapse();
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (isDraggingOverlay) return;
    const target = event.target as HTMLElement;
    if (target.closest("button, input, textarea, select, a, form, dialog")) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleCollapse();
    }
  };

  const notePreview = task.notes.trim();
  const subtaskTotal = task.subtasks.length;
  const subtaskDone = task.subtasks.filter((s) => s.completed).length;
  const age = inBacklog && !task.completed ? formatTaskAge(task.createdAt, toDayKey(new Date())) : null;
  const { onKeyDown: sortableKeyDown, ...sortablePointerListeners } = listeners ?? {};

  const handleArticleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("input, textarea, select, dialog")) return;

    handleCardKeyDown(event);

    // Shortcuts and keyboard drag only when the card itself is focused, not nested controls.
    if (event.target !== event.currentTarget) return;

    if (event.metaKey || event.ctrlKey || event.altKey) {
      sortableKeyDown?.(event);
      return;
    }

    const key = event.key.toLowerCase();
    if (event.key >= "1" && event.key <= "4") {
      event.preventDefault();
      act({ type: "UPDATE_TASK", taskId: task.id, patch: { priority: `p${Number(event.key) - 1}` as Priority } });
      return;
    }
    if (key === "d") {
      event.preventDefault();
      act({ type: "TOGGLE_COMPLETE", taskId: task.id });
      return;
    }
    if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      deleteTask();
      return;
    }
    if (key === "t") {
      event.preventDefault();
      scheduleTo(toDayKey(new Date()));
      return;
    }

    sortableKeyDown?.(event);
  };

  return (
    <article
      ref={isDraggingOverlay ? undefined : setNodeRef}
      style={style}
      onClick={handleCardClick}
      onKeyDown={handleArticleKeyDown}
      className={`plan-card group ${task.completed ? "plan-card--done" : ""} ${
        isDraggingOverlay ? "plan-card--overlay" : ""
      } ${isBeingDragged ? "plan-card--dragging" : ""}`}
      data-priority={task.priority}
      {...(isDraggingOverlay ? {} : attributes)}
      {...(isDraggingOverlay ? {} : sortablePointerListeners)}
      tabIndex={isDraggingOverlay ? undefined : 0}
    >
      <span className="plan-card__drag" aria-hidden="true">
        <GripIcon />
      </span>

      <div className="plan-card__body">
        <div className="plan-card__face">
          <div className="plan-card__title-wrap">
            {editingTitle ? (
              <textarea
                ref={titleRef}
                value={titleDraft}
                rows={1}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={commitTitle}
                onClick={(event) => event.stopPropagation()}
                onPointerDown={stopDragActivation}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitTitle();
                  }
                  if (e.key === "Escape") {
                    setTitleDraft(task.title);
                    setEditingTitle(false);
                  }
                }}
                className="plan-title-slot plan-title-slot--editing w-full text-[var(--plan-text)]"
                aria-label="Task title"
              />
            ) : (
              <button
                type="button"
                onClick={startTitleEdit}
                className={`plan-title-slot hover:bg-[var(--plan-bg)]/70 text-left transition-colors ${
                  task.completed ? "text-[var(--plan-muted)] line-through" : "text-[var(--plan-text)]"
                }`}
              >
                {task.title}
              </button>
            )}
          </div>

          <div className="plan-card__actions">
            <button
              type="button"
              aria-label={task.collapsed ? "Expand task" : "Collapse task"}
              onPointerDown={stopDragActivation}
              onClick={(event) => {
                event.stopPropagation();
                toggleCollapse();
              }}
              className="plan-card__action plan-card__action--expand"
            >
              <ChevronIcon collapsed={task.collapsed} />
            </button>
          </div>

          {task.collapsed && (notePreview || subtaskTotal > 0) ? (
            <div className="plan-card__preview">
              {subtaskTotal > 0 ? (
                <span className="plan-card__subprogress" aria-label={`${subtaskDone} of ${subtaskTotal} subtasks done`}>
                  <span className="plan-card__subprogress-bar" aria-hidden="true">
                    <span
                      className="plan-card__subprogress-fill"
                      style={{ width: `${Math.round((subtaskDone / subtaskTotal) * 100)}%` }}
                    />
                  </span>
                  <span aria-hidden="true">
                    {subtaskDone}/{subtaskTotal}
                  </span>
                </span>
              ) : null}
              {notePreview ? <p className="truncate">{notePreview}</p> : null}
            </div>
          ) : null}

          <div className="plan-card__footer">
            <div className="flex min-w-0 items-center gap-1.5">
              <PrioritySelect value={task.priority} onChange={onPriorityChange} />
              {age ? (
                <span
                  className={`plan-card__age ${age.stale ? "plan-card__age--stale" : ""}`}
                  title={`Added ${new Date(task.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}`}
                >
                  {age.label}
                </span>
              ) : null}
              {task.overdueFrom && !task.completed && !inBacklog ? (
                <span className="plan-card__age plan-card__age--overdue" title="Slipped from an earlier day">
                  {formatOverdueFrom(task.overdueFrom, toDayKey(new Date()))}
                </span>
              ) : null}
            </div>
            <div className="plan-card__footer-actions">
              <button
                type="button"
                aria-label="Schedule task"
                title="Schedule (move to today, tomorrow…)"
                onPointerDown={stopDragActivation}
                onClick={(event) => event.stopPropagation()}
                {...({ popovertarget: scheduleId } as HTMLAttributes<HTMLButtonElement>)}
                className="plan-card__sched-btn"
                style={{ anchorName: scheduleAnchor } as CSSProperties}
              >
                <ScheduleIcon />
              </button>
              <button
                type="button"
                onPointerDown={stopDragActivation}
                onClick={(event) => {
                  event.stopPropagation();
                  act({ type: "TOGGLE_COMPLETE", taskId: task.id });
                }}
                className="plan-card__done-btn"
              >
                Mark done
              </button>
            </div>
          </div>
        </div>

        {!task.collapsed ? (
          <div className="plan-card__details">
            <div>
              {editingNotes ? (
                <textarea
                  ref={notesRef}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  onBlur={commitNotes}
                  onPointerDown={stopDragActivation}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder="Notes…"
                  className="plan-notes-slot w-full resize-y text-[var(--plan-text)]"
                />
              ) : (
                <div className="plan-notes-slot plan-notes-slot--idle">
                  <button
                    type="button"
                    onPointerDown={stopDragActivation}
                    onClick={(event) => {
                      event.stopPropagation();
                      if (shouldSkipClick()) return;
                      setNotesDraft(task.notes);
                      setEditingNotes(true);
                    }}
                    className="plan-notes-slot__hit text-[var(--plan-muted)]"
                  >
                    <span className="plan-notes-slot__text">{task.notes.trim() ? task.notes : "Add notes…"}</span>
                  </button>
                </div>
              )}
            </div>

            {task.subtasks.length > 0 ? (
              <ul className="space-y-1">
                {task.subtasks.map((sub) => (
                  <li key={sub.id} className="plan-subtask-row">
                    <button
                      type="button"
                      aria-label={sub.completed ? "Mark subtask incomplete" : "Mark subtask complete"}
                      onPointerDown={stopDragActivation}
                      onClick={() => act({ type: "TOGGLE_SUBTASK", taskId: task.id, subtaskId: sub.id })}
                      className={`plan-subtask-check ${sub.completed ? "plan-subtask-check--done" : ""}`}
                    >
                      {sub.completed ? <SmallCheckIcon /> : null}
                    </button>
                    <textarea
                      value={sub.title}
                      rows={1}
                      onPointerDown={stopDragActivation}
                      onKeyDown={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        act({
                          type: "UPDATE_SUBTASK",
                          taskId: task.id,
                          subtaskId: sub.id,
                          title: e.target.value,
                        })
                      }
                      className={`plan-subtask-slot min-w-0 ${
                        sub.completed ? "text-[var(--plan-muted)] line-through" : "text-[var(--plan-text)]"
                      }`}
                      aria-label="Subtask"
                    />
                    <button
                      type="button"
                      aria-label="Delete subtask"
                      onPointerDown={stopDragActivation}
                      onClick={() => act({ type: "DELETE_SUBTASK", taskId: task.id, subtaskId: sub.id })}
                      className="plan-subtask-delete"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            <form
              onPointerDown={stopDragActivation}
              onSubmit={(e) => {
                e.preventDefault();
                const title = newSubtask.trim();
                if (!title) return;
                act({ type: "ADD_SUBTASK", taskId: task.id, title });
                setNewSubtask("");
              }}
              className="plan-subtask-row"
            >
              <span aria-hidden="true" className="plan-subtask-check" />
              <input
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="Add subtask…"
                className="plan-subtask-add-slot min-w-0"
                aria-label="Add subtask"
              />
              <button type="submit" className="plan-subtask-add-btn" aria-label="Add subtask">
                +
              </button>
            </form>

            <div className="plan-card__meta">
              {inBacklog ? (
                <span className="plan-card__meta-spacer" aria-hidden="true" />
              ) : (
                <button
                  type="button"
                  onPointerDown={stopDragActivation}
                  onClick={(event) => {
                    event.stopPropagation();
                    moveToBacklog();
                  }}
                  className="plan-card__meta-btn plan-card__meta-btn--backlog"
                >
                  Move to backlog
                </button>
              )}
              <button
                type="button"
                aria-label="Delete task"
                title="Delete (undo from the toast)"
                onPointerDown={stopDragActivation}
                onClick={(event) => {
                  event.stopPropagation();
                  deleteTask();
                }}
                className="plan-card__meta-btn plan-card__meta-btn--trash"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div
        ref={schedulePopRef}
        id={scheduleId}
        popover="auto"
        className="plan-pop"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={stopDragActivation}
        style={{ positionAnchor: scheduleAnchor } as CSSProperties}
      >
        {scheduleOptions().map((option) => (
          <button
            key={option.dayKey}
            type="button"
            className="plan-pop__item"
            onClick={() => scheduleTo(option.dayKey)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </article>
  );
}

function GripIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <circle cx="4" cy="3" r="1.2" />
      <circle cx="10" cy="3" r="1.2" />
      <circle cx="4" cy="7" r="1.2" />
      <circle cx="10" cy="7" r="1.2" />
      <circle cx="4" cy="11" r="1.2" />
      <circle cx="10" cy="11" r="1.2" />
    </svg>
  );
}

function ChevronIcon({ collapsed }: { collapsed: boolean }) {
  // Collapsed → points up; expanded → points down.
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      {collapsed ? <path d="M4 10l4-4 4 4" /> : <path d="M4 6l4 4 4-4" />}
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 4.5h9M6 4.5V3.25A.75.75 0 0 1 6.75 2.5h2.5a.75.75 0 0 1 .75.75V4.5m1.5 0V12.5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V4.5"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6.75 7v4M9.25 7v4" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function ScheduleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true">
      <rect x="2.25" y="3.25" width="11.5" height="10.5" rx="1.5" strokeWidth="1.35" />
      <path d="M2.25 6.5h11.5M5.5 1.75v3M10.5 1.75v3" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M6 10.25l1.5 1.5 2.75-2.75" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SmallCheckIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M1.5 4l1.5 1.5 3.5-3.5" />
    </svg>
  );
}
