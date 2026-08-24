import { describe, expect, test } from "vitest";
import { applyDragPreview } from "./dragPreview";
import type { Task } from "./types";

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

const MON = "2026-08-24";
const TUE = "2026-08-25";

describe("applyDragPreview group membership", () => {
  test("shows the dragged task inside the block it is hovering", () => {
    const columns = new Map([
      [MON, [task("email", MON)]],
      [TUE, [task("migration", TUE, "billing")]],
    ]);

    const next = applyDragPreview(columns, "email", { columnKey: TUE, index: 1, groupId: "billing" });

    expect(next.get(TUE)?.find((t) => t.id === "email")?.groupId).toBe("billing");
  });

  test("keeps the group in the preview when the destination has no block for it", () => {
    // Must agree with the reducer's guardrail, or the card jumps on drop.
    const columns = new Map([
      [MON, [task("migration", MON, "billing")]],
      [TUE, [task("email", TUE)]],
    ]);

    const next = applyDragPreview(columns, "migration", { columnKey: TUE, index: 1, groupId: null });

    expect(next.get(TUE)?.find((t) => t.id === "migration")?.groupId).toBe("billing");
  });

  test("drops the group in the preview when the block survives in the destination", () => {
    const columns = new Map([
      [MON, [task("migration", MON, "billing", 0), task("docs", MON, "billing", 1), task("email", MON, null, 2)]],
    ]);

    const next = applyDragPreview(columns, "docs", { columnKey: MON, index: 2, groupId: null });

    // Same-column previews are left to SortableContext, so the map is returned unchanged.
    expect(next).toBe(columns);
  });
});
