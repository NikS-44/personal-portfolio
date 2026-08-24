import { describe, expect, test } from "vitest";
import { createInitialState } from "./planState";
import { mergePlanStates } from "./taskMerge";
import type { PlanGroup, PlanState, Task } from "./types";

const T0 = "2026-08-22T00:00:00.000Z";
const T1 = "2026-08-22T01:00:00.000Z";
const T2 = "2026-08-22T02:00:00.000Z";

function task(id: string, groupId: string | null = null, updatedAt = T0): Task {
  return {
    id,
    title: id,
    notes: "",
    priority: "p2",
    completed: false,
    completedAt: null,
    subtasks: [],
    collapsed: true,
    dayKey: "2026-08-24",
    sortOrder: 0,
    createdAt: T0,
    updatedAt,
    overdueFrom: null,
    groupId,
  };
}

function group(id: string, name = id, updatedAt = T0): PlanGroup {
  return { id, name, priority: "p1", color: "teal", createdAt: T0, updatedAt };
}

function state(partial: Partial<PlanState>): PlanState {
  return { ...createInitialState(), metaUpdatedAt: T0, ...partial };
}

describe("group merge", () => {
  test("keeps a group that only the remote device has", () => {
    const merged = mergePlanStates(state({}), state({ groups: [group("billing")] }));

    expect(merged.groups.map((g) => g.id)).toEqual(["billing"]);
  });

  test("keeps a group that only the local device has", () => {
    const merged = mergePlanStates(state({ groups: [group("billing")] }), state({}));

    expect(merged.groups.map((g) => g.id)).toEqual(["billing"]);
  });

  test("takes the newer edit when both devices changed the same group", () => {
    const merged = mergePlanStates(
      state({ groups: [group("billing", "Billing revamp", T2)] }),
      state({ groups: [group("billing", "Billing", T1)] }),
    );

    expect(merged.groups[0].name).toBe("Billing revamp");
  });

  test("a remote delete wins over a stale local copy of the group", () => {
    const merged = mergePlanStates(
      state({ groups: [group("billing", "Billing", T0)] }),
      state({ groupGraveyard: { billing: T1 } }),
    );

    expect(merged.groups).toEqual([]);
    expect(merged.groupGraveyard.billing).toBe(T1);
  });

  test("a local re-create after a remote delete survives", () => {
    const merged = mergePlanStates(
      state({ groups: [group("billing", "Billing", T2)] }),
      state({ groupGraveyard: { billing: T1 } }),
    );

    expect(merged.groups.map((g) => g.id)).toEqual(["billing"]);
  });

  test("keeps an empty group rather than garbage-collecting it", () => {
    // Its only task may still live on a peer that has not synced yet.
    const merged = mergePlanStates(state({ groups: [group("billing")] }), state({ groups: [group("billing")] }));

    expect(merged.groups).toHaveLength(1);
  });

  test("nulls a groupId whose group lost to a tombstone", () => {
    const merged = mergePlanStates(
      state({ tasks: [task("migration", "billing")], groups: [group("billing")] }),
      state({ groupGraveyard: { billing: T1 } }),
    );

    expect(merged.tasks[0].groupId).toBeNull();
  });

  test("preserves membership when the group survives", () => {
    const merged = mergePlanStates(
      state({ tasks: [task("migration", "billing")], groups: [group("billing")] }),
      state({}),
    );

    expect(merged.tasks[0].groupId).toBe("billing");
  });

  test("still merges tasks per-id alongside groups", () => {
    const merged = mergePlanStates(state({ tasks: [task("a")] }), state({ tasks: [task("b")] }));

    expect(merged.tasks.map((t) => t.id).sort()).toEqual(["a", "b"]);
  });
});
