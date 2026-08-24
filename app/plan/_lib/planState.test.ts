import { describe, expect, test } from "vitest";
import { createInitialState, sanitizePlanState } from "./planState";

const legacyTask = {
  id: "t1",
  title: "Ship it",
  notes: "",
  priority: "p1",
  completed: false,
  completedAt: null,
  subtasks: [],
  collapsed: true,
  dayKey: "2026-08-24",
  sortOrder: 0,
  createdAt: "2026-08-22T00:00:00.000Z",
  updatedAt: "2026-08-22T00:00:00.000Z",
};

describe("sanitizePlanState with groups", () => {
  test("loads a pre-groups snapshot without a groups key", () => {
    const state = sanitizePlanState({ tasks: [legacyTask], graveyard: {} });

    expect(state).not.toBeNull();
    expect(state?.groups).toEqual([]);
    expect(state?.groupGraveyard).toEqual({});
    expect(state?.tasks[0].groupId).toBeNull();
  });

  test("keeps a valid group and its task membership", () => {
    const state = sanitizePlanState({
      tasks: [{ ...legacyTask, groupId: "g1" }],
      groups: [
        {
          id: "g1",
          name: "Billing",
          priority: "p1",
          color: "plum",
          createdAt: "2026-08-22T00:00:00.000Z",
          updatedAt: "2026-08-22T00:00:00.000Z",
        },
      ],
    });

    expect(state?.groups).toHaveLength(1);
    expect(state?.groups[0].color).toBe("plum");
    expect(state?.tasks[0].groupId).toBe("g1");
  });

  test("coerces an unknown color and priority rather than dropping the group", () => {
    const state = sanitizePlanState({
      tasks: [],
      groups: [{ id: "g1", name: "Billing", priority: "urgent", color: "hotpink" }],
    });

    expect(state?.groups[0]).toMatchObject({ id: "g1", name: "Billing", priority: "p2", color: "teal" });
  });

  test("drops group entries that are not objects with an id", () => {
    const state = sanitizePlanState({ tasks: [], groups: [null, "nope", { name: "no id" }] });

    expect(state?.groups).toEqual([]);
  });

  test("nulls a groupId that no surviving group claims", () => {
    const state = sanitizePlanState({ tasks: [{ ...legacyTask, groupId: "ghost" }], groups: [] });

    expect(state?.tasks[0].groupId).toBeNull();
  });

  test("createInitialState starts with no groups", () => {
    expect(createInitialState().groups).toEqual([]);
    expect(createInitialState().groupGraveyard).toEqual({});
  });
});
