import type { CardCategoryId } from "./types";

export interface HolidayEntry {
  categoryId: CardCategoryId;
  label: string;
  /** Gregorian month (1-based) */
  month: number;
  /** Approximate day — Hindu holidays are lunar but kept approximate */
  day: number;
}

/**
 * Static holiday calendar covering Hindu/Gujarati and American holidays.
 * Hindu dates are approximated to a fixed Gregorian date that is close to
 * where they usually fall; the window-based lookup (±30 days) keeps them
 * surfaced around the right season even when dates shift year to year.
 */
export const HOLIDAY_CALENDAR: HolidayEntry[] = [
  { categoryId: "new-year", label: "New Year's Day", month: 1, day: 1 },
  { categoryId: "lohri", label: "Lohri", month: 1, day: 13 },
  { categoryId: "makar-sankranti", label: "Makar Sankranti / Uttarayan", month: 1, day: 14 },
  { categoryId: "pongal", label: "Pongal", month: 1, day: 15 },
  { categoryId: "vasant-panchami", label: "Vasant Panchami", month: 2, day: 2 },
  { categoryId: "valentines", label: "Valentine's Day", month: 2, day: 14 },
  { categoryId: "mahashivratri", label: "Mahashivratri", month: 2, day: 26 },
  { categoryId: "holi", label: "Holi", month: 3, day: 14 },
  { categoryId: "gudi-padwa", label: "Gudi Padwa", month: 3, day: 30 },
  { categoryId: "ram-navami", label: "Ram Navami", month: 4, day: 6 },
  { categoryId: "hanuman-jayanti", label: "Hanuman Jayanti", month: 4, day: 13 },
  { categoryId: "baisakhi", label: "Baisakhi", month: 4, day: 13 },
  { categoryId: "easter", label: "Easter", month: 4, day: 20 },
  { categoryId: "akshaya-tritiya", label: "Akshaya Tritiya", month: 4, day: 30 },
  { categoryId: "mothers-day", label: "Mother's Day", month: 5, day: 11 },
  { categoryId: "fathers-day", label: "Father's Day", month: 6, day: 15 },
  { categoryId: "rath-yatra", label: "Rath Yatra", month: 7, day: 6 },
  { categoryId: "independence-day", label: "Independence Day 🇺🇸", month: 7, day: 4 },
  { categoryId: "raksha-bandhan", label: "Raksha Bandhan", month: 8, day: 9 },
  { categoryId: "janmashtami", label: "Janmashtami", month: 8, day: 16 },
  { categoryId: "onam", label: "Onam", month: 9, day: 5 },
  { categoryId: "ganesh-chaturthi", label: "Ganesh Chaturthi", month: 9, day: 27 },
  { categoryId: "navratri", label: "Navratri", month: 10, day: 2 },
  { categoryId: "karva-chauth", label: "Karva Chauth", month: 10, day: 10 },
  { categoryId: "dussehra", label: "Dussehra", month: 10, day: 12 },
  { categoryId: "halloween", label: "Halloween", month: 10, day: 31 },
  { categoryId: "dhanteras", label: "Dhanteras", month: 10, day: 18 },
  { categoryId: "diwali", label: "Diwali", month: 10, day: 20 },
  { categoryId: "bhai-dooj", label: "Bhai Dooj", month: 10, day: 22 },
  { categoryId: "gujarati-new-year", label: "Gujarati New Year", month: 10, day: 21 },
  { categoryId: "chhath-puja", label: "Chhath Puja", month: 11, day: 2 },
  { categoryId: "thanksgiving", label: "Thanksgiving", month: 11, day: 27 },
  { categoryId: "guru-nanak-jayanti", label: "Guru Nanak Jayanti", month: 11, day: 5 },
  { categoryId: "christmas", label: "Christmas", month: 12, day: 25 },
];

/** Categories that are always popular regardless of the date */
export const ALWAYS_POPULAR: CardCategoryId[] = ["birthday", "anniversary", "congrats", "thank-you", "thinking-of-you"];

/**
 * Returns holiday entries within `windowDays` days of `today`, sorted
 * ascending by proximity (soonest first). Wraps across year boundary.
 */
export function getUpcomingHolidays(today: Date, windowDays = 30): (HolidayEntry & { daysAway: number })[] {
  const year = today.getFullYear();

  return HOLIDAY_CALENDAR.map((entry) => {
    // Build candidate date in current year
    let candidate = new Date(year, entry.month - 1, entry.day);
    let diff = Math.round((candidate.getTime() - today.getTime()) / 86_400_000);

    // If already passed, try next year
    if (diff < 0) {
      candidate = new Date(year + 1, entry.month - 1, entry.day);
      diff = Math.round((candidate.getTime() - today.getTime()) / 86_400_000);
    }

    return { ...entry, daysAway: diff };
  })
    .filter((e) => e.daysAway >= 0 && e.daysAway <= windowDays)
    .sort((a, b) => a.daysAway - b.daysAway);
}
