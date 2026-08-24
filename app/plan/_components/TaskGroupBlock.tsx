"use client";

import { useDroppable } from "@dnd-kit/core";
import { useId, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import type { PlanAction } from "../_lib/planReducer";
import { groupDroppableId } from "../_lib/usePlanBoard";
import type { GroupColor, PlanGroup, Priority } from "../_lib/types";
import { GROUP_COLORS, PRIORITY_OPTIONS } from "../_lib/types";

type TaskGroupBlockProps = {
  group: PlanGroup;
  columnKey: string;
  taskCount: number;
  act: (action: PlanAction) => void;
  children: ReactNode;
};

/**
 * Bordered container for one group's tasks in one column. The whole block is a droppable so
 * dropping on its padding joins the group; its header opens the group's manage popover.
 */
export default function TaskGroupBlock({ group, columnKey, taskCount, act, children }: TaskGroupBlockProps) {
  const { setNodeRef } = useDroppable({
    id: groupDroppableId(columnKey, group.id),
    data: { type: "group", columnKey, groupId: group.id },
  });

  return (
    <section
      ref={setNodeRef}
      className="plan-group"
      data-group-color={group.color}
      data-group-id={group.id}
      aria-label={`${group.name}, priority ${group.priority.toUpperCase()}, ${taskCount} tasks`}
    >
      <GroupHeader group={group} act={act} scope={columnKey} />
      <div className="plan-group__body">{children}</div>
    </section>
  );
}

/** Header + manage popover. Also rendered from the card menu, where there is no block. */
export function GroupHeader({
  group,
  act,
  variant = "block",
  scope,
}: {
  group: PlanGroup;
  act: (action: PlanAction) => void;
  variant?: "block" | "menu";
  /** One group renders a block per column, so the anchor name must be scoped or they collide. */
  scope: string;
}) {
  const popId = useId();
  const safe = (value: string) => value.replace(/[^a-zA-Z0-9]/g, "");
  const anchorName = `--plan-group-${safe(group.id)}-${variant}-${safe(scope)}`;
  const popRef = useRef<HTMLDivElement>(null);
  const [nameDraft, setNameDraft] = useState(group.name);

  const closePop = () => popRef.current?.hidePopover();

  const commitName = () => {
    const next = nameDraft.trim();
    if (next && next !== group.name) act({ type: "UPDATE_GROUP", groupId: group.id, patch: { name: next } });
    else setNameDraft(group.name);
  };

  const trigger =
    variant === "block" ? (
      <button
        type="button"
        className="plan-group__header"
        title="Edit work stream"
        onPointerDown={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
        onTouchStart={(event) => event.stopPropagation()}
        {...({ popovertarget: popId } as HTMLAttributes<HTMLButtonElement>)}
        style={{ anchorName } as CSSProperties}
      >
        <span className="plan-group__dot" aria-hidden="true" />
        <span className="plan-group__name">{group.name}</span>
        <span className={`plan-group__priority plan-tone--${group.priority}`}>{group.priority.toUpperCase()}</span>
      </button>
    ) : (
      <button
        type="button"
        className="plan-group-menu__edit"
        aria-label={`Edit ${group.name}`}
        title="Edit work stream"
        {...({ popovertarget: popId } as HTMLAttributes<HTMLButtonElement>)}
        style={{ anchorName } as CSSProperties}
      >
        <DotsIcon />
      </button>
    );

  return (
    <>
      {trigger}
      <div
        ref={popRef}
        id={popId}
        popover="auto"
        className="plan-pop plan-group-pop"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
        style={{ positionAnchor: anchorName } as CSSProperties}
      >
        <label className="plan-group-pop__field">
          <span className="plan-group-pop__label">Name</span>
          <input
            value={nameDraft}
            onChange={(event) => setNameDraft(event.target.value)}
            onBlur={commitName}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                commitName();
                closePop();
              }
              if (event.key === "Escape") setNameDraft(group.name);
            }}
            className="plan-group-pop__input"
            aria-label="Group name"
          />
        </label>

        <div className="plan-group-pop__field">
          <span className="plan-group-pop__label">Priority</span>
          <div className="plan-group-pop__priorities" role="group" aria-label="Group priority">
            {PRIORITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                aria-pressed={group.priority === opt.value}
                className={`plan-group-pop__priority plan-tone--${opt.value} ${
                  group.priority === opt.value ? "plan-group-pop__priority--active" : ""
                }`}
                onClick={() => act({ type: "UPDATE_GROUP", groupId: group.id, patch: { priority: opt.value } })}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="plan-group-pop__field">
          <span className="plan-group-pop__label">Color</span>
          <div className="plan-group-pop__colors" role="group" aria-label="Group color">
            {GROUP_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={color}
                aria-pressed={group.color === color}
                data-group-color={color}
                className={`plan-group-pop__swatch ${group.color === color ? "plan-group-pop__swatch--active" : ""}`}
                onClick={() => act({ type: "UPDATE_GROUP", groupId: group.id, patch: { color } })}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          className="plan-pop__item plan-pop__item--danger"
          onClick={() => {
            closePop();
            act({ type: "DELETE_GROUP", groupId: group.id });
          }}
        >
          Delete group
        </button>
        <p className="plan-pop__note">Tasks stay on the board, just ungrouped.</p>
      </div>
    </>
  );
}

export type { GroupColor, Priority };

function DotsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <circle cx="3.25" cy="8" r="1.3" />
      <circle cx="8" cy="8" r="1.3" />
      <circle cx="12.75" cy="8" r="1.3" />
    </svg>
  );
}
