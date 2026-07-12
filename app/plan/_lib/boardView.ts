import { addDays, formatWeekRange, getCalendarWeekDayKeys, getWeekStart, parseDayKey, workdaysInRange } from "./dates";

export type BoardDaySegment = { kind: "day"; dayKey: string } | { kind: "separator"; weekStart: string; label: string };

/**
 * Rolling: remaining workdays through this Fri, this Sat+Sun, then next Mon–Fri.
 * Fixed week browse: Mon–Sun for that week.
 */
export function getBoardSegments(fixedWeekStart: string | null, todayKey: string): BoardDaySegment[] {
  if (fixedWeekStart !== null) {
    return getCalendarWeekDayKeys(fixedWeekStart).map((dayKey) => ({ kind: "day" as const, dayKey }));
  }

  const thisWeekMonday = getWeekStart(parseDayKey(todayKey));
  const thisWeekFriday = addDays(thisWeekMonday, 4);
  const thisWeekSaturday = addDays(thisWeekMonday, 5);
  const thisWeekSunday = addDays(thisWeekMonday, 6);
  const dow = parseDayKey(todayKey).getDay();

  const segments: BoardDaySegment[] = [];

  if (dow >= 1 && dow <= 5) {
    workdaysInRange(todayKey, thisWeekFriday).forEach((dayKey) => {
      segments.push({ kind: "day", dayKey });
    });
    segments.push({ kind: "day", dayKey: thisWeekSaturday });
    segments.push({ kind: "day", dayKey: thisWeekSunday });
  } else if (dow === 6) {
    segments.push({ kind: "day", dayKey: thisWeekSaturday });
    segments.push({ kind: "day", dayKey: thisWeekSunday });
  } else {
    segments.push({ kind: "day", dayKey: thisWeekSunday });
  }

  const nextWeekMonday = addDays(thisWeekMonday, 7);
  const nextWeekFriday = addDays(nextWeekMonday, 4);
  const nextDays = workdaysInRange(nextWeekMonday, nextWeekFriday);

  if (nextDays.length > 0) {
    segments.push({
      kind: "separator",
      weekStart: nextWeekMonday,
      label: formatWeekRange(nextWeekMonday),
    });
    nextDays.forEach((dayKey) => segments.push({ kind: "day", dayKey }));
  }

  return segments;
}

export function getDayKeysFromSegments(segments: BoardDaySegment[]): string[] {
  return segments.filter((s): s is BoardDaySegment & { kind: "day" } => s.kind === "day").map((s) => s.dayKey);
}

export function formatBoardHeaderRange(segments: BoardDaySegment[]): string {
  const days = getDayKeysFromSegments(segments);
  if (days.length === 0) return "This week";

  const first = parseDayKey(days[0]);
  const last = parseDayKey(days[days.length - 1]);
  const firstFmt = first.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const lastFmt = last.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: first.getFullYear() !== last.getFullYear() ? "numeric" : undefined,
  });
  if (days.length === 1) return firstFmt;
  return `${firstFmt} – ${lastFmt}`;
}

export function isRollingView(fixedWeekStart: string | null): boolean {
  return fixedWeekStart === null;
}

/** Previous Mon for week navigation. */
export function prevWeekStart(weekStart: string): string {
  return addDays(weekStart, -7);
}

/** Next Mon for week navigation. */
export function nextWeekStart(weekStart: string): string {
  return addDays(weekStart, 7);
}

/** Where ← lands from rolling view: full previous calendar week (Mon start). */
export function prevWeekFromRolling(todayKey: string): string {
  return prevWeekStart(getWeekStart(parseDayKey(todayKey)));
}

/** Where → lands from rolling view: week after the previewed next week. */
export function nextWeekFromRolling(todayKey: string): string {
  const thisWeekMonday = getWeekStart(parseDayKey(todayKey));
  return addDays(thisWeekMonday, 14);
}

export function shouldShowTodayButton(fixedWeekStart: string | null): boolean {
  return fixedWeekStart !== null;
}
