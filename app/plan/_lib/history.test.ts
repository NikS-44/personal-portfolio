import { describe, expect, test } from "vitest";
import { createHistory, historyReducer } from "./history";
import { createInitialState } from "./planState";

describe("undo for group actions", () => {
  test("undoes creating a group", () => {
    const history = createHistory(createInitialState());

    const created = historyReducer(history, { type: "ADD_GROUP", name: "Billing" });
    const undone = historyReducer(created, { type: "UNDO" });

    expect(created.present.groups).toHaveLength(1);
    expect(undone.present.groups).toEqual([]);
  });

  test("undoes deleting a group, restoring its task membership", () => {
    const base = historyReducer(
      historyReducer(createHistory(createInitialState()), { type: "ADD_TASK", columnKey: "backlog", title: "Migrate" }),
      { type: "ADD_GROUP", name: "Billing" },
    );
    const taskId = base.present.tasks[0].id;
    const groupId = base.present.groups[0].id;
    const assigned = historyReducer(base, { type: "SET_TASK_GROUP", taskId, groupId });

    const deleted = historyReducer(assigned, { type: "DELETE_GROUP", groupId });
    const undone = historyReducer(deleted, { type: "UNDO" });

    expect(deleted.present.tasks[0].groupId).toBeNull();
    expect(undone.present.groups).toHaveLength(1);
    expect(undone.present.tasks[0].groupId).toBe(groupId);
  });

  test("undoes an ungroup caused by a drag", () => {
    const history = createHistory(createInitialState());
    const withGroup = historyReducer(history, { type: "ADD_GROUP", name: "Billing" });

    const undone = historyReducer(
      historyReducer(withGroup, {
        type: "UPDATE_GROUP",
        groupId: withGroup.present.groups[0].id,
        patch: { priority: "p0" },
      }),
      { type: "UNDO" },
    );

    expect(undone.present.groups[0].priority).toBe("p2");
  });
});
