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
// New Indian / Hindu / Gujarati holidays
import { DIWALI_TEMPLATES } from "./diwali";
import { NAVRATRI_TEMPLATES } from "./navratri";
import { HOLI_TEMPLATES } from "./holi";
import { MAKAR_SANKRANTI_TEMPLATES } from "./makar-sankranti";
import { GANESH_CHATURTHI_TEMPLATES } from "./ganesh-chaturthi";
import { JANMASHTAMI_TEMPLATES } from "./janmashtami";
import { DUSSEHRA_TEMPLATES } from "./dussehra";
import { RAKSHA_BANDHAN_TEMPLATES } from "./raksha-bandhan";
import { GUJARATI_NEW_YEAR_TEMPLATES } from "./gujarati-new-year";
import { LOHRI_TEMPLATES } from "./lohri";
import { PONGAL_TEMPLATES } from "./pongal";
import { VASANT_PANCHAMI_TEMPLATES } from "./vasant-panchami";
import { MAHASHIVRATRI_TEMPLATES } from "./mahashivratri";
import { GUDI_PADWA_TEMPLATES } from "./gudi-padwa";
import { RAM_NAVAMI_TEMPLATES } from "./ram-navami";
import { HANUMAN_JAYANTI_TEMPLATES } from "./hanuman-jayanti";
import { AKSHAYA_TRITIYA_TEMPLATES } from "./akshaya-tritiya";
import { BAISAKHI_TEMPLATES } from "./baisakhi";
import { RATH_YATRA_TEMPLATES } from "./rath-yatra";
import { ONAM_TEMPLATES } from "./onam";
import { KARVA_CHAUTH_TEMPLATES } from "./karva-chauth";
import { DHANTERAS_TEMPLATES } from "./dhanteras";
import { BHAI_DOOJ_TEMPLATES } from "./bhai-dooj";
import { CHHATH_PUJA_TEMPLATES } from "./chhath-puja";
import { GURU_NANAK_JAYANTI_TEMPLATES } from "./guru-nanak-jayanti";
// New American holidays
import { CHRISTMAS_TEMPLATES } from "./christmas";
import { EASTER_TEMPLATES } from "./easter";
import { INDEPENDENCE_DAY_TEMPLATES } from "./independence-day";

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
  ...DIWALI_TEMPLATES,
  ...NAVRATRI_TEMPLATES,
  ...HOLI_TEMPLATES,
  ...MAKAR_SANKRANTI_TEMPLATES,
  ...GANESH_CHATURTHI_TEMPLATES,
  ...JANMASHTAMI_TEMPLATES,
  ...DUSSEHRA_TEMPLATES,
  ...RAKSHA_BANDHAN_TEMPLATES,
  ...GUJARATI_NEW_YEAR_TEMPLATES,
  ...LOHRI_TEMPLATES,
  ...PONGAL_TEMPLATES,
  ...VASANT_PANCHAMI_TEMPLATES,
  ...MAHASHIVRATRI_TEMPLATES,
  ...GUDI_PADWA_TEMPLATES,
  ...RAM_NAVAMI_TEMPLATES,
  ...HANUMAN_JAYANTI_TEMPLATES,
  ...AKSHAYA_TRITIYA_TEMPLATES,
  ...BAISAKHI_TEMPLATES,
  ...RATH_YATRA_TEMPLATES,
  ...ONAM_TEMPLATES,
  ...KARVA_CHAUTH_TEMPLATES,
  ...DHANTERAS_TEMPLATES,
  ...BHAI_DOOJ_TEMPLATES,
  ...CHHATH_PUJA_TEMPLATES,
  ...GURU_NANAK_JAYANTI_TEMPLATES,
  ...CHRISTMAS_TEMPLATES,
  ...EASTER_TEMPLATES,
  ...INDEPENDENCE_DAY_TEMPLATES,
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
  diwali: DIWALI_TEMPLATES,
  navratri: NAVRATRI_TEMPLATES,
  holi: HOLI_TEMPLATES,
  "makar-sankranti": MAKAR_SANKRANTI_TEMPLATES,
  "ganesh-chaturthi": GANESH_CHATURTHI_TEMPLATES,
  janmashtami: JANMASHTAMI_TEMPLATES,
  dussehra: DUSSEHRA_TEMPLATES,
  "raksha-bandhan": RAKSHA_BANDHAN_TEMPLATES,
  "gujarati-new-year": GUJARATI_NEW_YEAR_TEMPLATES,
  lohri: LOHRI_TEMPLATES,
  pongal: PONGAL_TEMPLATES,
  "vasant-panchami": VASANT_PANCHAMI_TEMPLATES,
  mahashivratri: MAHASHIVRATRI_TEMPLATES,
  "gudi-padwa": GUDI_PADWA_TEMPLATES,
  "ram-navami": RAM_NAVAMI_TEMPLATES,
  "hanuman-jayanti": HANUMAN_JAYANTI_TEMPLATES,
  "akshaya-tritiya": AKSHAYA_TRITIYA_TEMPLATES,
  baisakhi: BAISAKHI_TEMPLATES,
  "rath-yatra": RATH_YATRA_TEMPLATES,
  onam: ONAM_TEMPLATES,
  "karva-chauth": KARVA_CHAUTH_TEMPLATES,
  dhanteras: DHANTERAS_TEMPLATES,
  "bhai-dooj": BHAI_DOOJ_TEMPLATES,
  "chhath-puja": CHHATH_PUJA_TEMPLATES,
  "guru-nanak-jayanti": GURU_NANAK_JAYANTI_TEMPLATES,
  christmas: CHRISTMAS_TEMPLATES,
  easter: EASTER_TEMPLATES,
  "independence-day": INDEPENDENCE_DAY_TEMPLATES,
};
