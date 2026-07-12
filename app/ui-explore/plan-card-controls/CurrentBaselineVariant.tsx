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

/** Current shipping pattern: hover-reveal actions, base-select priority, footer badge */
export function CurrentBaselineVariant() {
  const { tasks, patch } = useExploreTasks();

  return (
    <Shell title="Column · Backlog">
      {tasks.map((task) => (
        <article
          key={task.id}
          className={`group rounded-xl border border-l-4 border-stone-200 bg-white p-3 shadow-sm ${priorityBar(task.priority)} ${
            task.completed ? "opacity-60" : ""
          }`}
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
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                aria-label="Complete"
                className="grid h-6 w-6 place-items-center rounded text-stone-400 opacity-0 transition-opacity hover:bg-stone-100 group-focus-within:opacity-100 group-hover:opacity-100"
              >
                ○
              </button>
              <button
                type="button"
                aria-label={task.collapsed ? "Expand" : "Collapse"}
                className="grid h-6 w-6 place-items-center rounded text-stone-700 hover:bg-stone-100"
                onClick={() => patch(task.id, { collapsed: !task.collapsed })}
              >
                <Caret open={!task.collapsed} />
              </button>
              <button
                type="button"
                aria-label="Delete"
                className="grid h-6 w-6 place-items-center rounded text-stone-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-focus-within:opacity-100 group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          </div>
          {task.collapsed && task.notes ? <p className="mt-1 truncate text-xs text-stone-500">{task.notes}</p> : null}
          <div className="mt-2">
            <select
              aria-label="Priority"
              value={task.priority}
              onChange={(e) => patch(task.id, { priority: e.target.value as ExplorePriority })}
              className={`h-5 min-w-[2.75rem] cursor-pointer rounded border px-1.5 pr-5 text-[10px] font-bold ${priorityTone(task.priority)}`}
            >
              {PRIORITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          {!task.collapsed ? (
            <div className="mt-3 space-y-2 border-t border-stone-100 pt-3">
              <p className="text-xs text-stone-500">{task.notes || "Add notes…"}</p>
              {task.subtasks.map((s) => (
                <div key={s.id} className="flex items-center gap-2 text-xs">
                  <span className="h-3.5 w-3.5 rounded border border-stone-300 bg-white" />
                  <span className={s.completed ? "text-stone-400 line-through" : "text-stone-700"}>{s.title}</span>
                </div>
              ))}
            </div>
          ) : null}
        </article>
      ))}
    </Shell>
  );
}
