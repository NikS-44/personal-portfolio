import type { CardTemplate, CardCategoryId } from "../types";
import { BIRTHDAY_TEMPLATES } from "./birthday";
import { ANNIVERSARY_TEMPLATES } from "./anniversary";
import { THANK_YOU_TEMPLATES } from "./thank-you";
import { GET_WELL_TEMPLATES } from "./get-well";
import { CONGRATS_TEMPLATES } from "./congrats";
import { JUST_BECAUSE_TEMPLATES } from "./just-because";
import { THINKING_OF_YOU_TEMPLATES } from "./thinking-of-you";
import { GOOD_LUCK_TEMPLATES } from "./good-luck";
import { WELCOME_TEMPLATES } from "./welcome";
import { MISS_YOU_TEMPLATES } from "./miss-you";
import { SYMPATHY_TEMPLATES } from "./sympathy";
import { NEW_YEAR_TEMPLATES } from "./new-year";
import { VALENTINES_TEMPLATES } from "./valentines";
import { MOTHERS_DAY_TEMPLATES } from "./mothers-day";
import { FATHERS_DAY_TEMPLATES } from "./fathers-day";
import { HALLOWEEN_TEMPLATES } from "./halloween";
import { THANKSGIVING_TEMPLATES } from "./thanksgiving";

export const ALL_TEMPLATES: CardTemplate[] = [
  ...BIRTHDAY_TEMPLATES,
  ...ANNIVERSARY_TEMPLATES,
  ...THANK_YOU_TEMPLATES,
  ...GET_WELL_TEMPLATES,
  ...CONGRATS_TEMPLATES,
  ...JUST_BECAUSE_TEMPLATES,
  ...THINKING_OF_YOU_TEMPLATES,
  ...GOOD_LUCK_TEMPLATES,
  ...WELCOME_TEMPLATES,
  ...MISS_YOU_TEMPLATES,
  ...SYMPATHY_TEMPLATES,
  ...NEW_YEAR_TEMPLATES,
  ...VALENTINES_TEMPLATES,
  ...MOTHERS_DAY_TEMPLATES,
  ...FATHERS_DAY_TEMPLATES,
  ...HALLOWEEN_TEMPLATES,
  ...THANKSGIVING_TEMPLATES,
];

export const templatesByCategory: Record<CardCategoryId, CardTemplate[]> = {
  birthday: BIRTHDAY_TEMPLATES,
  anniversary: ANNIVERSARY_TEMPLATES,
  "thank-you": THANK_YOU_TEMPLATES,
  "get-well": GET_WELL_TEMPLATES,
  congrats: CONGRATS_TEMPLATES,
  "just-because": JUST_BECAUSE_TEMPLATES,
  "thinking-of-you": THINKING_OF_YOU_TEMPLATES,
  "good-luck": GOOD_LUCK_TEMPLATES,
  welcome: WELCOME_TEMPLATES,
  "miss-you": MISS_YOU_TEMPLATES,
  sympathy: SYMPATHY_TEMPLATES,
  "new-year": NEW_YEAR_TEMPLATES,
  valentines: VALENTINES_TEMPLATES,
  "mothers-day": MOTHERS_DAY_TEMPLATES,
  "fathers-day": FATHERS_DAY_TEMPLATES,
  halloween: HALLOWEEN_TEMPLATES,
  thanksgiving: THANKSGIVING_TEMPLATES,
};
