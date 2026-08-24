export type Priority = "p0" | "p1" | "p2" | "p3";

/** Palette keys for group blocks; kept distinct from the p0–p3 accents. */
export type GroupColor = "teal" | "sky" | "plum" | "moss" | "clay" | "slate";

/** A work stream. Board-wide, not per-column: its tasks spread across days. */
export type PlanGroup = {
  id: string;
  name: string;
  /** Positions the whole group among ungrouped tasks. */
  priority: Priority;
  color: GroupColor;
  createdAt: string;
  /** Last mutation to this group (sync LWW). */
  updatedAt: string;
};

export type SubTask = {
  id: string;
  title: string;
  completed: boolean;
};

export type Task = {
  id: string;
  title: string;
  notes: string;
  priority: Priority;
  completed: boolean;
  completedAt: string | null;
  subtasks: SubTask[];
  collapsed: boolean;
  /** `backlog` or ISO date `YYYY-MM-DD` */
  dayKey: string;
  sortOrder: number;
  createdAt: string;
  /** Last mutation to this task (sync LWW). */
  updatedAt: string;
  /** Day the task originally slipped from; set by rollover, cleared on move/complete */
  overdueFrom?: string | null;
  /** Single work stream, or `null` when ungrouped. */
  groupId: string | null;
};

/** id → ISO deletedAt — tombstones so deletes survive cross-device sync. */
export type PlanGraveyard = Record<string, string>;

export type ViewMode = "today" | "week";

export type PlanState = {
  tasks: Task[];
  graveyard: PlanGraveyard;
  groups: PlanGroup[];
  /** Group tombstones; same contract as `graveyard`, separate id space. */
  groupGraveyard: PlanGraveyard;
  /** When set, show that Mon–Fri week only; `null` = rolling view from today + next week */
  fixedWeekStart: string | null;
  /** Columns where the user has manually reordered (skip priority sort) */
  manualOrderColumns: string[];
  /** Today focus vs full week board */
  viewMode: ViewMode;
  /** Last change to board meta (view / column order), not individual tasks. */
  metaUpdatedAt: string;
};

export const BACKLOG_KEY = "backlog";

export const GROUP_COLORS: GroupColor[] = ["teal", "sky", "plum", "moss", "clay", "slate"];

export const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "p0", label: "P0" },
  { value: "p1", label: "P1" },
  { value: "p2", label: "P2" },
  { value: "p3", label: "P3" },
];
