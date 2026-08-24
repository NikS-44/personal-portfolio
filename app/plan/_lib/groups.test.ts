import { describe, expect, test } from "vitest";
import { buildColumnBlocks, nextGroupColor, reconcileGroupIds } from "./groups";
import { createInitialState } from "./planState";
import type { GroupColor, PlanGroup, Priority, Task } from "./types";
import { GROUP_COLORS } from "./types";

function task(title: string, groupId: string | null = null, completed = false): Task {
  return {
    id: title,
    title,
    notes: "",
    priority: "p2",
    completed,
    completedAt: completed ? "2026-08-22T00:00:00.000Z" : null,
    subtasks: [],
    collapsed: true,
    dayKey: "2026-08-24",
    sortOrder: 0,
    createdAt: "2026-08-22T00:00:00.000Z",
    updatedAt: "2026-08-22T00:00:00.000Z",
    overdueFrom: null,
    groupId,
  };
}

function group(id: string, color: GroupColor = "teal", priority: Priority = "p2"): PlanGroup {
  return {
    id,
    name: id,
    priority,
    color,
    createdAt: "2026-08-22T00:00:00.000Z",
    updatedAt: "2026-08-22T00:00:00.000Z",
  };
}

describe("buildColumnBlocks", () => {
  test("folds a contiguous run of one group into a single block", () => {
    const blocks = buildColumnBlocks(
      [task("alert"), task("migration", "billing"), task("docs", "billing"), task("email")],
      [group("billing")],
    );

    expect(blocks.map((b) => (b.kind === "group" ? `group:${b.group.id}` : `task:${b.task.title}`))).toEqual([
      "task:alert",
      "group:billing",
      "task:email",
    ]);
    expect(blocks[1].kind === "group" && blocks[1].tasks.map((t) => t.title)).toEqual(["migration", "docs"]);
  });

  test("renders a task whose group was deleted elsewhere as a loose card", () => {
    const blocks = buildColumnBlocks([task("ghost", "deleted-group")], []);

    expect(blocks).toEqual([{ kind: "task", task: task("ghost", "deleted-group") }]);
  });
});

describe("nextGroupColor", () => {
  test("cycles the palette so consecutively created groups stay visually separated", () => {
    expect(nextGroupColor([])).toBe(GROUP_COLORS[0]);
    expect(nextGroupColor([group("a", GROUP_COLORS[0])])).toBe(GROUP_COLORS[1]);
  });

  test("wraps around once every palette hue is taken", () => {
    const taken = GROUP_COLORS.map((color, i) => group(`g${i}`, color));

    expect(nextGroupColor(taken)).toBe(GROUP_COLORS[0]);
  });

  test("reuses the first hue no longer in use rather than counting groups", () => {
    // g0 was deleted; its hue is free again.
    const taken = GROUP_COLORS.slice(1).map((color, i) => group(`g${i + 1}`, color));

    expect(nextGroupColor(taken)).toBe(GROUP_COLORS[0]);
  });
});

describe("reconcileGroupIds", () => {
  test("nulls a groupId pointing at a group deleted on another device", () => {
    const state = { ...createInitialState(), tasks: [task("ghost", "deleted-group")], groups: [] };

    const next = reconcileGroupIds(state);

    expect(next.tasks[0].groupId).toBeNull();
  });

  test("leaves tasks untouched when every groupId resolves", () => {
    const state = { ...createInitialState(), tasks: [task("migration", "billing")], groups: [group("billing")] };

    expect(reconcileGroupIds(state)).toBe(state);
  });
});
