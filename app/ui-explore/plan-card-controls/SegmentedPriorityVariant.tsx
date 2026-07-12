"use client";

import { Caret, PRIORITY_OPTIONS, Shell, priorityBar, useExploreTasks } from "./shared";

/** Segmented priority chips — no dropdown caret at all */
export function SegmentedPriorityVariant() {
  const { tasks, patch } = useExploreTasks();

  return (
    <Shell title="Column · Backlog">
      {tasks.map((task) => (
        <article
          key={task.id}
          className={`rounded-xl border border-l-4 border-stone-200 bg-white p-3 shadow-sm ${priorityBar(task.priority)}`}
        >
          <div className="flex items-start gap-2">
            <button
              type="button"
              className={`min-w-0 flex-1 text-left text-sm font-medium ${
                task.completed ? "text-stone-400 line-through" : "text-stone-800"
              }`}
              onClick={() => patch(task.id, { collapsed: !task.collapsed })}
            >
              {task.title}
            </button>
            <button
              type="button"
              aria-expanded={!task.collapsed}
              aria-label={task.collapsed ? "Expand" : "Collapse"}
              onClick={() => patch(task.id, { collapsed: !task.collapsed })}
              className="grid h-7 w-7 place-items-center rounded-md bg-stone-50 text-stone-700 ring-1 ring-stone-200 hover:bg-stone-100"
            >
              <Caret open={!task.collapsed} />
            </button>
          </div>

          <div role="group" aria-label="Priority" className="mt-2 inline-flex rounded-md bg-stone-100 p-0.5">
            {PRIORITY_OPTIONS.map((o) => {
              const active = task.priority === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => patch(task.id, { priority: o.value })}
                  className={`rounded px-2 py-0.5 text-[10px] font-bold transition ${
                    active
                      ? o.value === "p0"
                        ? "bg-red-500 text-white"
                        : o.value === "p1"
                          ? "bg-orange-500 text-white"
                          : o.value === "p2"
                            ? "bg-amber-500 text-white"
                            : "bg-stone-500 text-white"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>

          {!task.collapsed ? (
            <div className="mt-3 space-y-2 border-t border-stone-100 pt-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => patch(task.id, { completed: !task.completed })}
                  className="rounded-md bg-stone-50 px-2 py-1 text-xs font-medium text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100"
                >
                  {task.completed ? "Undo complete" : "Complete"}
                </button>
                <button type="button" className="rounded-md px-2 py-1 text-xs text-red-600 hover:bg-red-50">
                  Delete
                </button>
              </div>
              <p className="text-xs text-stone-500">{task.notes || "Add notes…"}</p>
            </div>
          ) : null}
        </article>
      ))}
    </Shell>
  );
}
