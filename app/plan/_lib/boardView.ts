import {
  addDays,
  formatWeekRange,
  getRollingStartAnchor,
  getWeekStart,
  getWorkWeekDayKeys,
  parseDayKey,
  workdaysInRange,
} from "./dates";

export type BoardDaySegment = { kind: "day"; dayKey: string } | { kind: "separator"; weekStart: string; label: string };

/** Default rolling view: from today (or next Mon on weekends) through this Fri, then next work week. */
export function getBoardSegments(fixedWeekStart: string | null, todayKey: string): BoardDaySegment[] {
  if (fixedWeekStart !== null) {
    return getWorkWeekDayKeys(fixedWeekStart).map((dayKey) => ({ kind: "day", dayKey }));
  }

  const rollingStart = getRollingStartAnchor(todayKey);
  const thisWeekMonday = getWeekStart(parseDayKey(rollingStart));
  const thisWeekFriday = addDays(thisWeekMonday, 4);
  const currentDays = workdaysInRange(rollingStart, thisWeekFriday);

  const nextWeekMonday = addDays(thisWeekMonday, 7);
  const nextWeekFriday = addDays(nextWeekMonday, 4);
  const nextDays = workdaysInRange(nextWeekMonday, nextWeekFriday);

  const segments: BoardDaySegment[] = currentDays.map((dayKey) => ({ kind: "day", dayKey }));

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

/** Where ← lands from rolling view: full previous work week. */
export function prevWeekFromRolling(todayKey: string): string {
  const anchor = getRollingStartAnchor(todayKey);
  return prevWeekStart(getWeekStart(parseDayKey(anchor)));
}

/** Where → lands from rolling view: week after the previewed next week. */
export function nextWeekFromRolling(todayKey: string): string {
  const anchor = getRollingStartAnchor(todayKey);
  const thisWeekMonday = getWeekStart(parseDayKey(anchor));
  return addDays(thisWeekMonday, 14);
}

export function shouldShowTodayButton(fixedWeekStart: string | null): boolean {
  return fixedWeekStart !== null;
}
