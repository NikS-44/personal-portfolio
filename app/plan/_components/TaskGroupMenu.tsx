"use client";

import { useId, useRef, useState, type CSSProperties, type HTMLAttributes } from "react";
import type { PlanAction } from "../_lib/planReducer";
import type { PlanGroup, Task } from "../_lib/types";
import { GroupHeader } from "./TaskGroupBlock";

type TaskGroupMenuProps = {
  task: Task;
  groups: PlanGroup[];
  act: (action: PlanAction) => void;
  /** Stop dnd-kit sensors arming while the menu is used. */
  dragGuardProps: Record<string, (event: React.SyntheticEvent) => void>;
};

/**
 * `Group ▸` on a task card. Each row carries its own edit affordance, so a group whose last
 * task left — and therefore has no block on the board — is still reachable.
 */
export default function TaskGroupMenu({ task, groups, act, dragGuardProps }: TaskGroupMenuProps) {
  const popId = useId();
  const anchorName = `--plan-group-menu-${task.id.replace(/[^a-zA-Z0-9]/g, "")}`;
  const popRef = useRef<HTMLDivElement>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState("");

  const current = groups.find((g) => g.id === task.groupId) ?? null;
  const closePop = () => popRef.current?.hidePopover();

  const createGroup = () => {
    const name = draft.trim();
    if (!name) return;
    act({ type: "ADD_GROUP", name, taskId: task.id });
    setDraft("");
    setCreating(false);
    closePop();
  };

  return (
    <>
      <button
        type="button"
        className="plan-card__meta-btn plan-card__meta-btn--group"
        title="Assign to a work stream"
        {...dragGuardProps}
        {...({ popovertarget: popId } as HTMLAttributes<HTMLButtonElement>)}
        style={{ anchorName } as CSSProperties}
        onClick={(event) => event.stopPropagation()}
      >
        {current ? (
          <>
            <span className="plan-group__dot" data-group-color={current.color} aria-hidden="true" />
            <span className="plan-card__meta-btn-label">{current.name}</span>
          </>
        ) : (
          "Group"
        )}
      </button>

      <div
        ref={popRef}
        id={popId}
        popover="auto"
        className="plan-pop plan-group-menu"
        onClick={(event) => event.stopPropagation()}
        {...dragGuardProps}
        style={{ positionAnchor: anchorName } as CSSProperties}
      >
        <button
          type="button"
          className={`plan-pop__item ${task.groupId === null ? "plan-pop__item--checked" : ""}`}
          onClick={() => {
            act({ type: "SET_TASK_GROUP", taskId: task.id, groupId: null });
            closePop();
          }}
        >
          <span className="plan-group-menu__check" aria-hidden="true">
            {task.groupId === null ? "✓" : ""}
          </span>
          No group
        </button>

        {groups.map((group) => (
          <div key={group.id} className="plan-group-menu__row">
            <button
              type="button"
              className={`plan-pop__item plan-group-menu__pick ${
                task.groupId === group.id ? "plan-pop__item--checked" : ""
              }`}
              onClick={() => {
                act({ type: "SET_TASK_GROUP", taskId: task.id, groupId: group.id });
                closePop();
              }}
            >
              <span className="plan-group-menu__check" aria-hidden="true">
                {task.groupId === group.id ? "✓" : ""}
              </span>
              <span className="plan-group__dot" data-group-color={group.color} aria-hidden="true" />
              <span className="plan-group-menu__name">{group.name}</span>
              <span className={`plan-group__priority plan-tone--${group.priority}`}>
                {group.priority.toUpperCase()}
              </span>
            </button>
            <GroupHeader group={group} act={act} variant="menu" scope={task.id} />
          </div>
        ))}

        {creating ? (
          <form
            className="plan-group-menu__create"
            onSubmit={(event) => {
              event.preventDefault();
              createGroup();
            }}
          >
            {/* eslint-disable-next-line jsx-a11y/no-autofocus -- focus follows the click that revealed it */}
            <input
              autoFocus
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setCreating(false);
                  setDraft("");
                }
              }}
              placeholder="Stream name…"
              aria-label="New group name"
              className="plan-group-pop__input"
            />
            <button type="submit" className="plan-group-menu__create-btn">
              Add
            </button>
          </form>
        ) : (
          <button type="button" className="plan-pop__item" onClick={() => setCreating(true)}>
            <span className="plan-group-menu__check" aria-hidden="true">
              +
            </span>
            New group…
          </button>
        )}
      </div>
    </>
  );
}
