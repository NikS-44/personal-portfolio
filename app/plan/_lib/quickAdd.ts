import { addDays, parseDayKey } from "./dates";
import type { Priority } from "./types";
import { BACKLOG_KEY } from "./types";

export type QuickAdd = {
  title: string;
  priority?: Priority;
  dayKey?: string;
};

const PRIORITY_TOKEN = /(^|\s)!(p[0-3])(?=\s|$)/i;
const DAY_TOKEN = /(^|\s)@(today|tomorrow|backlog|mon|tue|wed|thu|fri|sat|sun)(?=\s|$)/i;

const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/** Next occurrence of `weekday` on or after today (today itself counts). */
function upcomingWeekday(todayKey: string, weekday: string): string {
  const target = WEEKDAYS.indexOf(weekday);
  const current = parseDayKey(todayKey).getDay();
  return addDays(todayKey, (target - current + 7) % 7);
}

/**
 * Inline tokens for the add-task fields: `!p0`–`!p3` set priority,
 * `@today` / `@tomorrow` / `@mon`…`@sun` / `@backlog` pick the column.
 * Tokens are stripped from the title; the rest is left as typed.
 */
export function parseQuickAdd(raw: string, todayKey: string): QuickAdd {
  let title = raw;
  let priority: Priority | undefined;
  let dayKey: string | undefined;

  const priorityMatch = title.match(PRIORITY_TOKEN);
  if (priorityMatch) {
    priority = priorityMatch[2].toLowerCase() as Priority;
    title = title.replace(PRIORITY_TOKEN, " ");
  }

  const dayMatch = title.match(DAY_TOKEN);
  if (dayMatch) {
    const token = dayMatch[2].toLowerCase();
    if (token === "today") dayKey = todayKey;
    else if (token === "tomorrow") dayKey = addDays(todayKey, 1);
    else if (token === "backlog") dayKey = BACKLOG_KEY;
    else dayKey = upcomingWeekday(todayKey, token);
    title = title.replace(DAY_TOKEN, " ");
  }

  return { title: title.replace(/\s+/g, " ").trim(), priority, dayKey };
}
