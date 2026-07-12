"use client";

import { useState } from "react";

export type ExplorePriority = "p0" | "p1" | "p2" | "p3";

export type ExploreTask = {
  id: string;
  title: string;
  notes: string;
  priority: ExplorePriority;
  completed: boolean;
  collapsed: boolean;
  subtasks: { id: string; title: string; completed: boolean }[];
};

export const MOCK_TASKS: ExploreTask[] = [
  {
    id: "t1",
    title: "Ship planner UI polish",
    notes: "Priority + accordion carets feel off",
    priority: "p1",
    completed: false,
    collapsed: false,
    subtasks: [
      { id: "s1", title: "Fix expand caret direction", completed: true },
      { id: "s2", title: "Rethink priority control", completed: false },
    ],
  },
  {
    id: "t2",
    title: "Review PR backlog",
    notes: "",
    priority: "p2",
    completed: false,
    collapsed: true,
    subtasks: [{ id: "s3", title: "Triage stale reviews", completed: false }],
  },
  {
    id: "t3",
    title: "Write weekly status for eng lead with a deliberately long title to stress wrap",
    notes: "Keep it short",
    priority: "p0",
    completed: false,
    collapsed: true,
    subtasks: [],
  },
  {
    id: "t4",
    title: "Archive done chores",
    notes: "",
    priority: "p3",
    completed: true,
    collapsed: true,
    subtasks: [],
  },
];

export const PRIORITY_OPTIONS: { value: ExplorePriority; label: string }[] = [
  { value: "p0", label: "P0" },
  { value: "p1", label: "P1" },
  { value: "p2", label: "P2" },
  { value: "p3", label: "P3" },
];

export function priorityTone(p: ExplorePriority): string {
  switch (p) {
    case "p0":
      return "bg-red-50 text-red-700 border-red-200";
    case "p1":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "p2":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "p3":
      return "bg-stone-100 text-stone-600 border-stone-200";
  }
}

export function priorityBar(p: ExplorePriority): string {
  switch (p) {
    case "p0":
      return "border-l-red-500";
    case "p1":
      return "border-l-orange-500";
    case "p2":
      return "border-l-amber-400";
    case "p3":
      return "border-l-stone-300";
  }
}

export function useExploreTasks(seed: ExploreTask[] = MOCK_TASKS) {
  const [tasks, setTasks] = useState(seed.map((t) => ({ ...t, subtasks: t.subtasks.map((s) => ({ ...s })) })));

  const patch = (id: string, next: Partial<ExploreTask>) => {
    setTasks((list) => list.map((t) => (t.id === id ? { ...t, ...next } : t)));
  };

  return { tasks, patch, setTasks };
}

export function Caret({ open }: { open: boolean }) {
  // Expanded → points down; collapsed → points up (no transform tricks).
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      {open ? <path d="M4 6l4 4 4-4" /> : <path d="M4 10l4-4 4 4" />}
    </svg>
  );
}

export function Shell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="mx-auto max-w-md space-y-3 p-6" style={{ background: "#ebe8e3", minHeight: "70vh" }}>
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
