"use client";

import { Caret, PRIORITY_OPTIONS, Shell, priorityTone, useExploreTasks, type ExplorePriority } from "./shared";

/** Dense Linear-like row: checkbox · title · priority text · always-on expand */
export function DenseToolbarVariant() {
  const { tasks, patch } = useExploreTasks();

  return (
    <Shell title="Column · Backlog">
      <ul className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
        {tasks.map((task, index) => (
          <li key={task.id} className={index > 0 ? "border-t border-stone-100" : ""}>
            <div className="flex items-center gap-2 px-3 py-2.5">
              <button
                type="button"
                aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                onClick={() => patch(task.id, { completed: !task.completed })}
                className={`grid h-4 w-4 shrink-0 place-items-center rounded-[3px] border text-[9px] leading-none ${
                  task.completed
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-stone-350 border-stone-400 bg-white text-transparent hover:border-emerald-400"
                }`}
              >
                ✓
              </button>
              <button
                type="button"
                className={`min-w-0 flex-1 truncate text-left text-sm ${
                  task.completed ? "text-stone-400 line-through" : "text-stone-800"
                }`}
                onClick={() => patch(task.id, { collapsed: !task.collapsed })}
              >
                {task.title}
              </button>
              <select
                aria-label="Priority"
                value={task.priority}
                onChange={(e) => patch(task.id, { priority: e.target.value as ExplorePriority })}
                className={`h-5 cursor-pointer appearance-none rounded border px-1.5 pr-5 text-[10px] font-bold ${priorityTone(task.priority)}`}
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8' fill='none'%3E%3Cpath d='M1.5 2.75L4 5.25L6.5 2.75' stroke='%236b6560' stroke-width='1.25' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.3rem center",
                }}
              >
                {PRIORITY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                aria-expanded={!task.collapsed}
                aria-label={task.collapsed ? "Expand" : "Collapse"}
                onClick={() => patch(task.id, { collapsed: !task.collapsed })}
                className="grid h-6 w-6 place-items-center rounded text-stone-500 hover:bg-stone-100 hover:text-stone-800"
              >
                <Caret open={!task.collapsed} />
              </button>
            </div>
            {!task.collapsed ? (
              <div className="space-y-2 border-t border-stone-50 bg-stone-50/60 px-3 py-2 pl-9">
                <p className="text-xs text-stone-500">{task.notes || "Add notes…"}</p>
                {task.subtasks.map((s) => (
                  <p key={s.id} className={`text-xs ${s.completed ? "text-stone-400 line-through" : "text-stone-700"}`}>
                    {s.title}
                  </p>
                ))}
                <button type="button" className="text-xs text-red-600 hover:underline">
                  Delete task
                </button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </Shell>
  );
}
