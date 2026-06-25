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

export function isWorkdayKey(key: string): boolean {
  const day = parseDayKey(key).getDay();
  return day >= 1 && day <= 5;
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

/** Workday to roll incomplete tasks onto (next Mon on weekends). */
export function getRolloverTargetDay(todayKey: string): string {
  return getRollingStartAnchor(todayKey);
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

/** Move incomplete scheduled tasks forward when their day has passed; skip weekend columns. */
export function rollOverIncompleteTasks(tasks: Task[], todayKey: string): Task[] {
  const targetDay = getRolloverTargetDay(todayKey);

  return tasks.map((task) => {
    if (task.completed || task.dayKey === "backlog") return task;

    if (!isWorkdayKey(task.dayKey)) {
      return { ...task, dayKey: targetDay };
    }

    if (task.dayKey < targetDay) {
      return { ...task, dayKey: targetDay };
    }

    return task;
  });
}
