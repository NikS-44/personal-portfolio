"use client";

import { priorityBadgeClass } from "../_lib/priority";
import type { PlanAction } from "../_lib/planReducer";
import type { PlanGroup, Task } from "../_lib/types";

type CompletedTaskRowProps = {
  task: Task;
  act: (action: PlanAction) => void;
  group?: PlanGroup | null;
};

/** Compact completed row: title · priority · Undo */
export default function CompletedTaskRow({ task, act, group = null }: CompletedTaskRowProps) {
  return (
    <div className={`plan-done-row ${priorityBadgeClass(task.priority)}`}>
      {group ? (
        <span className="plan-group__dot" data-group-color={group.color} title={group.name} aria-hidden="true" />
      ) : null}
      <p className="plan-done-row__title">{task.title}</p>
      <span className="plan-done-row__priority" aria-label={`Priority ${task.priority.toUpperCase()}`}>
        {task.priority.toUpperCase()}
      </span>
      <button
        type="button"
        className="plan-done-row__undo"
        onClick={() => act({ type: "TOGGLE_COMPLETE", taskId: task.id })}
      >
        Undo
      </button>
    </div>
  );
}
