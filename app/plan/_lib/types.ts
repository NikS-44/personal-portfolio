export type Priority = "p0" | "p1" | "p2" | "p3";

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
  /** Day the task originally slipped from; set by rollover, cleared on move/complete */
  overdueFrom?: string | null;
};

export type ViewMode = "today" | "week";

export type PlanState = {
  tasks: Task[];
  /** When set, show that Mon–Fri week only; `null` = rolling view from today + next week */
  fixedWeekStart: string | null;
  /** Columns where the user has manually reordered (skip priority sort) */
  manualOrderColumns: string[];
  /** Today focus vs full week board */
  viewMode: ViewMode;
};

export const BACKLOG_KEY = "backlog";

export const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "p0", label: "P0" },
  { value: "p1", label: "P1" },
  { value: "p2", label: "P2" },
  { value: "p3", label: "P3" },
];
