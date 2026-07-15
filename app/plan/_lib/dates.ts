import type { Task } from "./types";

export function toDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDayKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key: string, days: number): string {
  const date = parseDayKey(key);
  date.setDate(date.getDate() + days);
  return toDayKey(date);
}

/** Monday of the calendar week containing `date`. */
export function getWeekStart(date: Date): string {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const weekday = d.getDay();
  const diff = weekday === 0 ? -6 : 1 - weekday;
  d.setDate(d.getDate() + diff);
  return toDayKey(d);
}

/** Mon–Fri day keys for the week starting on `weekStart` (Monday). */
export function getWorkWeekDayKeys(weekStart: string): string[] {
  return [0, 1, 2, 3, 4].map((offset) => addDays(weekStart, offset));
}

/** Mon–Sun day keys for the week starting on `weekStart` (Monday). */
export function getCalendarWeekDayKeys(weekStart: string): string[] {
  return [0, 1, 2, 3, 4, 5, 6].map((offset) => addDays(weekStart, offset));
}

export function isWorkdayKey(key: string): boolean {
  const day = parseDayKey(key).getDay();
  return day >= 1 && day <= 5;
}

export function isWeekendKey(key: string): boolean {
  const day = parseDayKey(key).getDay();
  return day === 0 || day === 6;
}

/** Next Mon–Fri strictly after `dayKey`. */
export function nextWorkday(dayKey: string): string {
  let cur = addDays(dayKey, 1);
  while (!isWorkdayKey(cur)) {
    cur = addDays(cur, 1);
  }
  return cur;
}

/** First visible workday in the default rolling view (today, or next Mon on weekends). */
export function getRollingStartAnchor(todayKey: string): string {
  const day = parseDayKey(todayKey).getDay();
  if (day === 0) return addDays(todayKey, 1);
  if (day === 6) return addDays(todayKey, 2);
  return todayKey;
}

export function workdaysInRange(startKey: string, endKey: string): string[] {
  const days: string[] = [];
  let cur = startKey;
  while (cur <= endKey) {
    if (isWorkdayKey(cur)) days.push(cur);
    cur = addDays(cur, 1);
  }
  return days;
}

/** Upcoming Monday on or after `dayKey` (today if already Monday). */
export function getNextMondayFrom(dayKey: string): string {
  const day = parseDayKey(dayKey).getDay();
  if (day === 1) return dayKey;
  if (day === 0) return addDays(dayKey, 1);
  return addDays(dayKey, 8 - day);
}

export function formatColumnLabel(
  dayKey: string,
  todayKey: string,
): { weekday: string; date: string; isToday: boolean } {
  const date = parseDayKey(dayKey);
  const weekday = date.toLocaleDateString(undefined, { weekday: "short" });
  const dateLabel = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return { weekday, date: dateLabel, isToday: dayKey === todayKey };
}

export function formatWeekRange(weekStart: string): string {
  const end = addDays(weekStart, 4);
  const startDate = parseDayKey(weekStart);
  const endDate = parseDayKey(end);
  const startFmt = startDate.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const endFmt = endDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  return `${startFmt} – ${endFmt}`;
}

export type TaskAge = { label: string; stale: boolean };

/** Age chip for backlog cards: null under a week, then "2w", "3mo"…; stale from 3 weeks. */
export function formatTaskAge(createdAt: string, todayKey: string): TaskAge | null {
  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) return null;

  const days = Math.round((parseDayKey(todayKey).getTime() - parseDayKey(toDayKey(created)).getTime()) / 86_400_000);
  if (days < 7) return null;

  const label = days < 60 ? `${Math.floor(days / 7)}w` : `${Math.floor(days / 30)}mo`;
  return { label, stale: days >= 21 };
}

/** Move incomplete past-due tasks to today, remembering where they slipped from. */
export function rollOverIncompleteTasks(tasks: Task[], todayKey: string): Task[] {
  return tasks.map((task) => {
    if (task.completed || task.dayKey === "backlog") return task;
    if (task.dayKey < todayKey) {
      return {
        ...task,
        dayKey: todayKey,
        overdueFrom: task.overdueFrom ?? task.dayKey,
      };
    }
    return task;
  });
}

/** Short label for the overdue badge: "was Tue" (or "was Jun 3" if older than a week). */
export function formatOverdueFrom(overdueFrom: string, todayKey: string): string {
  const from = parseDayKey(overdueFrom);
  const days = Math.round((parseDayKey(todayKey).getTime() - from.getTime()) / 86_400_000);
  if (days <= 6) return `was ${from.toLocaleDateString(undefined, { weekday: "short" })}`;
  return `was ${from.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}
