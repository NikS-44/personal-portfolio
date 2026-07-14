import type { DropTarget } from "./dragPreview";

const DROP_INDICATOR_ID = "plan-drop-indicator";

export function dropTargetsEqual(a: DropTarget | null, b: DropTarget | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.columnKey === b.columnKey && a.index === b.index;
}

export function clearDropIndicator(): void {
  document.getElementById(DROP_INDICATOR_ID)?.remove();
}

/** Insertion line — DOM only so drag preview never re-renders the board. */
export function syncDropIndicator(target: DropTarget | null): void {
  clearDropIndicator();
  if (!target) return;

  const columnBody = document.querySelector(
    `[data-column-key="${CSS.escape(target.columnKey)}"] .plan-column-scroll__body`,
  );
  if (!columnBody) return;

  const cards = Array.from(columnBody.querySelectorAll("article.plan-card")).filter(
    (el) => !el.classList.contains("plan-card--dragging"),
  );

  const line = document.createElement("div");
  line.id = DROP_INDICATOR_ID;
  line.className = "plan-drop-indicator";
  line.setAttribute("aria-hidden", "true");

  const insertIndex = Math.max(0, Math.min(target.index, cards.length));
  if (insertIndex < cards.length) {
    cards[insertIndex].before(line);
    return;
  }

  if (cards.length > 0) {
    cards[cards.length - 1].after(line);
    return;
  }

  const addForm = columnBody.querySelector("form");
  if (addForm) {
    columnBody.insertBefore(line, addForm);
  } else {
    columnBody.appendChild(line);
  }
}
