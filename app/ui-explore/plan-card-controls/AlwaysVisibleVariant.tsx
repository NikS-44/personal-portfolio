"use client";

import {
  Caret,
  PRIORITY_OPTIONS,
  Shell,
  priorityBar,
  priorityTone,
  useExploreTasks,
  type ExplorePriority,
} from "./shared";

/** Always-visible expand + complete; static priority caret; no hover-gated chrome */
export function AlwaysVisibleVariant() {
  const { tasks, patch } = useExploreTasks();

  return (
    <Shell title="Column · Backlog">
      {tasks.map((task) => (
        <article
          key={task.id}
          className={`rounded-xl border border-l-4 border-stone-200 bg-white p-3 shadow-sm ${priorityBar(task.priority)}`}
        >
          <div className="flex items-start gap-1.5">
            <button
              type="button"
              aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
              onClick={() => patch(task.id, { completed: !task.completed })}
              className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] ${
                task.completed
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-stone-300 text-transparent hover:border-emerald-400"
              }`}
            >
              ✓
            </button>
            <button
              type="button"
              className={`min-w-0 flex-1 pt-0.5 text-left text-sm font-medium leading-snug ${
                task.completed ? "text-stone-400 line-through" : "text-stone-800"
              }`}
              onClick={() => patch(task.id, { collapsed: !task.collapsed })}
            >
              {task.title}
            </button>
            <button
              type="button"
              aria-label={task.collapsed ? "Expand task" : "Collapse task"}
              aria-expanded={!task.collapsed}
              onClick={() => patch(task.id, { collapsed: !task.collapsed })}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-stone-600 hover:bg-stone-100"
            >
              <Caret open={!task.collapsed} />
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between gap-2 pl-6">
            <label className="inline-flex items-center gap-1">
              <span className="sr-only">Priority</span>
              <select
                value={task.priority}
                onChange={(e) => patch(task.id, { priority: e.target.value as ExplorePriority })}
                className={`h-6 cursor-pointer appearance-none rounded-md border px-2 pr-6 text-[11px] font-bold ${priorityTone(task.priority)}`}
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8' fill='none'%3E%3Cpath d='M1.5 2.75L4 5.25L6.5 2.75' stroke='%236b6560' stroke-width='1.25' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.4rem center",
                }}
              >
                {PRIORITY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="text-xs text-stone-400 hover:text-red-600">
              Delete
            </button>
          </div>

          {!task.collapsed ? (
            <div className="mt-3 space-y-2 border-t border-stone-100 pl-6 pt-3">
              <p className="text-xs text-stone-500">{task.notes || "Add notes…"}</p>
              {task.subtasks.map((s) => (
                <div key={s.id} className="flex items-center gap-2 text-xs text-stone-700">
                  <span
                    className={`h-3.5 w-3.5 rounded border ${s.completed ? "border-emerald-500 bg-emerald-500" : "border-stone-300 bg-white"}`}
                  />
                  {s.title}
                </div>
              ))}
            </div>
          ) : null}
        </article>
      ))}
    </Shell>
  );
}
