import { describe, expect, test } from "vitest";
import { isPriorityOrdered, sortTasksForColumn } from "./priority";
import type { PlanGroup, Priority, Task } from "./types";

function task(title: string, priority: Priority, sortOrder: number, groupId: string | null = null): Task {
  return {
    id: title,
    title,
    notes: "",
    priority,
    completed: false,
    completedAt: null,
    subtasks: [],
    collapsed: true,
    dayKey: "2026-08-24",
    sortOrder,
    createdAt: "2026-08-22T00:00:00.000Z",
    updatedAt: "2026-08-22T00:00:00.000Z",
    overdueFrom: null,
    groupId,
  };
}

function group(id: string, priority: Priority): PlanGroup {
  return {
    id,
    name: id,
    priority,
    color: "teal",
    createdAt: "2026-08-22T00:00:00.000Z",
    updatedAt: "2026-08-22T00:00:00.000Z",
  };
}

const titles = (tasks: Task[]) => tasks.map((t) => t.title);

describe("sortTasksForColumn with groups", () => {
  test("places a group as a unit at the group's priority, not its members' priorities", () => {
    const tasks = [
      task("migration", "p0", 0, "billing"),
      task("docs", "p2", 1, "billing"),
      task("email", "p2", 2),
      task("inbox", "p3", 3),
      task("alert", "p0", 4),
    ];

    const sorted = sortTasksForColumn(tasks, false, [group("billing", "p1")]);

    // The P0 inside the P1 group must NOT jump above the loose P0.
    expect(titles(sorted)).toEqual(["alert", "migration", "docs", "email", "inbox"]);
  });
});

describe("block contiguity in manual-order columns", () => {
  test("keeps a group's tasks adjacent even when their sortOrders are interleaved", () => {
    // A drag left billing's two tasks split by a loose task.
    const tasks = [task("migration", "p0", 0, "billing"), task("email", "p2", 1), task("docs", "p2", 2, "billing")];

    const sorted = sortTasksForColumn(tasks, true, [group("billing", "p1")]);

    expect(titles(sorted)).toEqual(["migration", "docs", "email"]);
  });

  test("ignores group priority in manual columns, as it already ignores task priority", () => {
    const tasks = [task("email", "p3", 0), task("migration", "p0", 1, "billing")];

    const sorted = sortTasksForColumn(tasks, true, [group("billing", "p0")]);

    expect(titles(sorted)).toEqual(["email", "migration"]);
  });
});

describe("same-priority groups", () => {
  test("orders two equal-priority groups deterministically by block anchor", () => {
    const tasks = [
      task("onboarding-a", "p2", 3, "onboarding"),
      task("billing-a", "p2", 1, "billing"),
      task("onboarding-b", "p0", 4, "onboarding"),
      task("billing-b", "p0", 2, "billing"),
    ];
    const groups = [group("billing", "p1"), group("onboarding", "p1")];

    const forward = sortTasksForColumn(tasks, false, groups);
    const reversed = sortTasksForColumn([...tasks].reverse(), false, [...groups].reverse());

    // billing anchors at 1, onboarding at 3 — billing's block comes first either way.
    expect(titles(forward)).toEqual(["billing-b", "billing-a", "onboarding-b", "onboarding-a"]);
    expect(titles(reversed)).toEqual(titles(forward));
  });
});

describe("isPriorityOrdered", () => {
  test("reports a correctly grouped column as ordered so the sort button stays hidden", () => {
    const groups = [group("billing", "p1")];
    const tasks = sortTasksForColumn(
      [task("alert", "p0", 4), task("migration", "p0", 0, "billing"), task("docs", "p2", 1, "billing")],
      false,
      groups,
    );

    expect(isPriorityOrdered(tasks, groups)).toBe(true);
  });

  test("reports a column as unordered when a block sits below a lower-priority loose task", () => {
    const groups = [group("billing", "p0")];
    const tasks = [task("inbox", "p3", 0), task("migration", "p1", 1, "billing")];

    expect(isPriorityOrdered(tasks, groups)).toBe(false);
  });
});

describe("dangling group ids", () => {
  test("sorts a task whose group was deleted elsewhere as ungrouped", () => {
    const tasks = [task("ghost", "p0", 5, "deleted-group"), task("email", "p2", 0)];

    const sorted = sortTasksForColumn(tasks, false, []);

    expect(titles(sorted)).toEqual(["ghost", "email"]);
  });
});
