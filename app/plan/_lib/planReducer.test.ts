import { describe, expect, test } from "vitest";
import { planReducer } from "./planReducer";
import { createInitialState } from "./planState";
import type { PlanGroup, PlanState, Task } from "./types";

function task(id: string, dayKey: string, groupId: string | null = null, sortOrder = 0): Task {
  return {
    id,
    title: id,
    notes: "",
    priority: "p2",
    completed: false,
    completedAt: null,
    subtasks: [],
    collapsed: true,
    dayKey,
    sortOrder,
    createdAt: "2026-08-22T00:00:00.000Z",
    updatedAt: "2026-08-22T00:00:00.000Z",
    overdueFrom: null,
    groupId,
  };
}

function group(id: string): PlanGroup {
  return {
    id,
    name: id,
    priority: "p1",
    color: "teal",
    createdAt: "2026-08-22T00:00:00.000Z",
    updatedAt: "2026-08-22T00:00:00.000Z",
  };
}

function stateWith(tasks: Task[], groups: PlanGroup[] = []): PlanState {
  return { ...createInitialState(), tasks, groups };
}

const find = (state: PlanState, id: string) => state.tasks.find((t) => t.id === id)!;

const MON = "2026-08-24";
const TUE = "2026-08-25";

describe("MOVE_TASK membership rules", () => {
  test("joins the group when dropped inside that group's block", () => {
    const state = stateWith([task("loose", MON), task("migration", MON, "billing", 1)], [group("billing")]);

    const next = planReducer(state, {
      type: "MOVE_TASK",
      taskId: "loose",
      toColumn: MON,
      toIndex: 1,
      groupId: "billing",
    });

    expect(find(next, "loose").groupId).toBe("billing");
  });

  test("leaves the group when dropped loose in a column where the block survives", () => {
    const state = stateWith(
      [task("migration", MON, "billing", 0), task("docs", MON, "billing", 1), task("email", MON, null, 2)],
      [group("billing")],
    );

    const next = planReducer(state, { type: "MOVE_TASK", taskId: "docs", toColumn: MON, toIndex: 2, groupId: null });

    expect(find(next, "docs").groupId).toBeNull();
    expect(find(next, "migration").groupId).toBe("billing");
  });

  test("keeps the group when dropped in a column that has no block for it", () => {
    // The guardrail: nothing to aim at on Tuesday, so a reschedule must not silently ungroup.
    const state = stateWith([task("migration", MON, "billing", 0), task("email", TUE, null, 0)], [group("billing")]);

    const next = planReducer(state, {
      type: "MOVE_TASK",
      taskId: "migration",
      toColumn: TUE,
      toIndex: 1,
      groupId: null,
    });

    expect(find(next, "migration").groupId).toBe("billing");
    expect(find(next, "migration").dayKey).toBe(TUE);
  });

  test("keeps the group when a solo block's only task is reordered in its own column", () => {
    // A one-task block IS the task — there is no surviving fence to step outside of.
    const state = stateWith([task("migration", MON, "billing", 0), task("email", MON, null, 1)], [group("billing")]);

    const next = planReducer(state, {
      type: "MOVE_TASK",
      taskId: "migration",
      toColumn: MON,
      toIndex: 1,
      groupId: null,
    });

    expect(find(next, "migration").groupId).toBe("billing");
  });

  test("leaves an already-ungrouped task ungrouped", () => {
    const state = stateWith([task("email", MON, null, 0), task("inbox", MON, null, 1)]);

    const next = planReducer(state, { type: "MOVE_TASK", taskId: "email", toColumn: MON, toIndex: 1, groupId: null });

    expect(find(next, "email").groupId).toBeNull();
  });

  test("preserves membership when the move carries no drag context", () => {
    const state = stateWith(
      [task("migration", MON, "billing", 0), task("docs", MON, "billing", 1)],
      [group("billing")],
    );

    const next = planReducer(state, { type: "MOVE_TASK", taskId: "migration", toColumn: TUE, toIndex: 0 });

    expect(find(next, "migration").groupId).toBe("billing");
  });
});

describe("group actions", () => {
  test("ADD_GROUP creates a group and assigns the originating task in one step", () => {
    const state = stateWith([task("migration", MON)]);

    const next = planReducer(state, { type: "ADD_GROUP", name: "Billing revamp", taskId: "migration" });

    expect(next.groups).toHaveLength(1);
    expect(next.groups[0]).toMatchObject({ name: "Billing revamp", priority: "p2", color: "teal" });
    expect(find(next, "migration").groupId).toBe(next.groups[0].id);
  });

  test("UPDATE_GROUP patches the group and bumps its sync clock", () => {
    const state = stateWith([], [group("billing")]);

    const next = planReducer(state, { type: "UPDATE_GROUP", groupId: "billing", patch: { priority: "p0" } });

    expect(next.groups[0].priority).toBe("p0");
    expect(next.groups[0].updatedAt > state.groups[0].updatedAt).toBe(true);
  });

  test("DELETE_GROUP tombstones the group and releases its tasks", () => {
    const state = stateWith([task("migration", MON, "billing")], [group("billing")]);

    const next = planReducer(state, { type: "DELETE_GROUP", groupId: "billing" });

    expect(next.groups).toEqual([]);
    expect(next.groupGraveyard.billing).toBeDefined();
    expect(find(next, "migration").groupId).toBeNull();
  });

  test("SET_TASK_GROUP assigns and clears membership", () => {
    const state = stateWith([task("migration", MON)], [group("billing")]);

    const joined = planReducer(state, { type: "SET_TASK_GROUP", taskId: "migration", groupId: "billing" });
    const cleared = planReducer(joined, { type: "SET_TASK_GROUP", taskId: "migration", groupId: null });

    expect(find(joined, "migration").groupId).toBe("billing");
    expect(find(cleared, "migration").groupId).toBeNull();
  });

  test("ADD_TASK starts a task ungrouped", () => {
    const next = planReducer(createInitialState(), { type: "ADD_TASK", columnKey: MON, title: "New" });

    expect(next.tasks[0].groupId).toBeNull();
  });
});
