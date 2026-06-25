"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useRef, useState } from "react";
import { priorityAccentClass, priorityActiveClass } from "../_lib/priority";
import type { PlanAction } from "../_lib/planReducer";
import type { Priority, Task } from "../_lib/types";
import { PRIORITY_OPTIONS } from "../_lib/types";

type TaskCardProps = {
  task: Task;
  act: (action: PlanAction) => void;
  isDraggingOverlay?: boolean;
};

export default function TaskCard({ task, act, isDraggingOverlay = false }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: isDraggingOverlay,
  });

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(task.title);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState(task.notes);
  const [newSubtask, setNewSubtask] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingTitle) titleRef.current?.focus();
  }, [editingTitle]);

  useEffect(() => {
    if (editingNotes) notesRef.current?.focus();
  }, [editingNotes]);

  const style = isDraggingOverlay
    ? undefined
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
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

  const onPriorityChange = (priority: Priority) => {
    act({ type: "UPDATE_TASK", taskId: task.id, patch: { priority } });
  };

  return (
    <article
      ref={isDraggingOverlay ? undefined : setNodeRef}
      style={style}
      className={`group rounded-xl border border-l-[3px] border-[var(--plan-border)] bg-white shadow-sm transition-shadow hover:shadow-md ${priorityAccentClass(task.priority)} ${
        task.completed ? "opacity-55" : ""
      } ${isDraggingOverlay ? "ring-[var(--plan-accent)]/30 shadow-xl ring-2" : ""}`}
    >
      <div className="flex gap-1.5 p-2.5">
        <button
          type="button"
          aria-label="Drag task"
          className="flex h-6 w-6 shrink-0 cursor-grab touch-none items-center justify-center self-start rounded text-[var(--plan-muted)] opacity-0 transition-opacity hover:bg-[var(--plan-bg)] hover:text-[var(--plan-text)] active:cursor-grabbing group-hover:opacity-100"
          {...attributes}
          {...listeners}
        >
          <GripIcon />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
              onClick={() => act({ type: "TOGGLE_COMPLETE", taskId: task.id })}
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors ${
                task.completed
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-[var(--plan-border)] bg-white hover:border-emerald-400"
              }`}
            >
              {task.completed ? <CheckIcon /> : null}
            </button>

            <div className="min-w-0 flex-1 self-center">
              {editingTitle ? (
                <input
                  ref={titleRef}
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onBlur={commitTitle}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitTitle();
                    if (e.key === "Escape") {
                      setTitleDraft(task.title);
                      setEditingTitle(false);
                    }
                  }}
                  className="w-full rounded-md border border-[var(--plan-border)] bg-white px-2 py-1 text-[13px] font-medium leading-5 text-[var(--plan-text)]"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setEditingTitle(true)}
                  className={`block w-full text-left text-[13px] font-medium leading-5 ${
                    task.completed ? "text-[var(--plan-muted)] line-through" : "text-[var(--plan-text)]"
                  }`}
                >
                  {task.title}
                </button>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-0.5 self-center">
              <button
                type="button"
                aria-label={task.collapsed ? "Expand task" : "Collapse task"}
                onClick={() => act({ type: "TOGGLE_COLLAPSE", taskId: task.id })}
                className="flex h-6 w-6 items-center justify-center rounded text-[var(--plan-muted)] hover:bg-[var(--plan-bg)] hover:text-[var(--plan-text)]"
              >
                <ChevronIcon collapsed={task.collapsed} />
              </button>

              {confirmDelete ? (
                <div className="flex items-center gap-0.5 rounded-lg bg-red-50 px-1 py-0.5 ring-1 ring-red-100">
                  <button
                    type="button"
                    aria-label="Confirm delete task"
                    onClick={() => act({ type: "DELETE_TASK", taskId: task.id })}
                    className="rounded px-1.5 py-0.5 text-[11px] font-semibold text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    aria-label="Cancel delete task"
                    onClick={() => setConfirmDelete(false)}
                    className="flex h-6 w-6 items-center justify-center rounded text-[11px] text-[var(--plan-muted)] hover:bg-white"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  aria-label="Delete task"
                  onClick={() => setConfirmDelete(true)}
                  className="flex h-6 w-6 items-center justify-center rounded text-[var(--plan-muted)] opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {!task.collapsed ? (
            <div className="border-[var(--plan-border)]/70 mt-2.5 space-y-2.5 border-t pt-2.5">
              <div className="flex flex-wrap gap-1" role="group" aria-label="Priority">
                {PRIORITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onPriorityChange(opt.value)}
                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 transition-colors ${
                      task.priority === opt.value
                        ? priorityActiveClass(opt.value)
                        : "bg-white text-[var(--plan-muted)] ring-[var(--plan-border)] hover:bg-[var(--plan-bg)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div>
                {editingNotes ? (
                  <textarea
                    ref={notesRef}
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    onBlur={commitNotes}
                    placeholder="Notes…"
                    rows={3}
                    className="w-full resize-y rounded-lg border border-[var(--plan-border)] bg-[var(--plan-surface)] px-2.5 py-2 text-xs leading-relaxed text-[var(--plan-text)]"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setNotesDraft(task.notes);
                      setEditingNotes(true);
                    }}
                    className="hover:ring-[var(--plan-accent)]/40 w-full rounded-lg bg-[var(--plan-surface)] px-2.5 py-2 text-left text-xs leading-relaxed text-[var(--plan-muted)] ring-1 ring-[var(--plan-border)] transition-colors"
                  >
                    {task.notes.trim() ? task.notes : "Add notes…"}
                  </button>
                )}
              </div>

              {task.subtasks.length > 0 ? (
                <ul className="space-y-1.5">
                  {task.subtasks.map((sub) => (
                    <li key={sub.id} className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={sub.completed ? "Mark subtask incomplete" : "Mark subtask complete"}
                        onClick={() => act({ type: "TOGGLE_SUBTASK", taskId: task.id, subtaskId: sub.id })}
                        className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border ${
                          sub.completed
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-[var(--plan-border)] bg-white"
                        }`}
                      >
                        {sub.completed ? <SmallCheckIcon /> : null}
                      </button>
                      <input
                        value={sub.title}
                        onChange={(e) =>
                          act({
                            type: "UPDATE_SUBTASK",
                            taskId: task.id,
                            subtaskId: sub.id,
                            title: e.target.value,
                          })
                        }
                        className={`min-w-0 flex-1 bg-transparent text-xs ${
                          sub.completed ? "text-[var(--plan-muted)] line-through" : "text-[var(--plan-text)]"
                        }`}
                      />
                      <button
                        type="button"
                        aria-label="Delete subtask"
                        onClick={() => act({ type: "DELETE_SUBTASK", taskId: task.id, subtaskId: sub.id })}
                        className="text-[var(--plan-muted)] hover:text-red-500"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const title = newSubtask.trim();
                  if (!title) return;
                  act({ type: "ADD_SUBTASK", taskId: task.id, title });
                  setNewSubtask("");
                }}
                className="flex gap-1.5"
              >
                <input
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Subtask"
                  className="min-w-0 flex-1 rounded-lg border border-[var(--plan-border)] bg-white px-2 py-1.5 text-xs"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--plan-accent-soft)] px-2.5 py-1.5 text-xs font-medium text-[var(--plan-accent)] hover:bg-[var(--plan-accent)] hover:text-white"
                >
                  Add
                </button>
              </form>
            </div>
          ) : (
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded-md bg-[var(--plan-bg)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--plan-muted)]">
                {task.priority.toUpperCase()}
              </span>
              {task.notes.trim() ? (
                <span className="truncate text-[11px] text-[var(--plan-muted)]">{task.notes}</span>
              ) : null}
            </div>
          )}
        </div>
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
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`transition-transform ${collapsed ? "-rotate-90" : ""}`}
      aria-hidden="true"
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 5l2 2 4-4" />
    </svg>
  );
}

function SmallCheckIcon() {
  return (
    <svg width="7" height="7" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1.5 4l1.5 1.5 3.5-3.5" />
    </svg>
  );
}
