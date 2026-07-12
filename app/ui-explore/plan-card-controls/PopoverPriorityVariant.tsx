"use client";

import { useId, useState } from "react";
import {
  Caret,
  PRIORITY_OPTIONS,
  Shell,
  priorityBar,
  priorityTone,
  useExploreTasks,
  type ExplorePriority,
} from "./shared";

/** Popover priority menu with an SVG caret we fully own; labeled expand control */
export function PopoverPriorityVariant() {
  const { tasks, patch } = useExploreTasks();
  const [openFor, setOpenFor] = useState<string | null>(null);
  const listId = useId();

  return (
    <Shell title="Column · Backlog">
      {tasks.map((task) => {
        const menuOpen = openFor === task.id;
        return (
          <article
            key={task.id}
            className={`rounded-xl border border-l-4 border-stone-200 bg-white p-3 shadow-sm ${priorityBar(task.priority)}`}
          >
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-medium ${task.completed ? "text-stone-400 line-through" : "text-stone-800"}`}
                >
                  {task.title}
                </p>
                {task.collapsed && task.notes ? (
                  <p className="mt-0.5 truncate text-xs text-stone-500">{task.notes}</p>
                ) : null}
              </div>
              <button
                type="button"
                aria-expanded={!task.collapsed}
                onClick={() => patch(task.id, { collapsed: !task.collapsed })}
                className="inline-flex h-7 items-center gap-1 rounded-md px-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100"
              >
                {task.collapsed ? "Details" : "Hide"}
                <Caret open={!task.collapsed} />
              </button>
            </div>

            <div className="relative mt-2">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={menuOpen}
                aria-controls={`${listId}-${task.id}`}
                onClick={(event) => {
                  event.stopPropagation();
                  setOpenFor(menuOpen ? null : task.id);
                }}
                className={`inline-flex h-6 items-center gap-1.5 rounded-md border px-2 text-[11px] font-bold ${priorityTone(task.priority)} hover:brightness-[0.98]`}
              >
                {task.priority.toUpperCase()}
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true" className="text-stone-600">
                  <path
                    d="M1.5 2.75L4 5.25L6.5 2.75"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {menuOpen ? (
                <ul
                  id={`${listId}-${task.id}`}
                  role="listbox"
                  className="absolute left-0 top-full z-10 mt-1 min-w-[4.5rem] rounded-md border border-stone-200 bg-white p-1 shadow-lg"
                >
                  {PRIORITY_OPTIONS.map((o) => (
                    <li key={o.value}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={task.priority === o.value}
                        className={`flex w-full rounded px-2 py-1 text-left text-[11px] font-bold ${
                          task.priority === o.value ? priorityTone(o.value) : "text-stone-600 hover:bg-stone-50"
                        }`}
                        onClick={() => {
                          patch(task.id, { priority: o.value as ExplorePriority });
                          setOpenFor(null);
                        }}
                      >
                        {o.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {!task.collapsed ? (
              <div className="mt-3 space-y-2 border-t border-stone-100 pt-3">
                <p className="text-xs text-stone-500">{task.notes || "Add notes…"}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => patch(task.id, { completed: !task.completed })}
                    className="text-xs font-medium text-emerald-700 hover:underline"
                  >
                    {task.completed ? "Mark incomplete" : "Mark complete"}
                  </button>
                  <button type="button" className="text-xs text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            ) : null}
          </article>
        );
      })}
    </Shell>
  );
}
