import type { CardTemplate } from "../types";

export const MAKAR_SANKRANTI_TEMPLATES: CardTemplate[] = [
  {
    id: "makar-sankranti-01",
    categoryId: "makar-sankranti",
    name: "Kite Festival Sky",
    layout: "centered-stack",
    themeId: "sky-blue",
    primaryAnimation: "fade-in",
    ornaments: [
      {
        emoji: "🪁",
        positionClass: "top-2 left-2",
        sizeClass: "text-4xl",
        animation: "kite-soar",
        animationDelay: "0s",
      },
      {
        emoji: "🪁",
        positionClass: "top-4 right-4",
        sizeClass: "text-3xl",
        animation: "kite-soar",
        animationDelay: "0.8s",
      },
      { emoji: "☀️", positionClass: "bottom-2 right-2", sizeClass: "text-2xl", animation: "spin-slow" },
    ],
  },
  {
    id: "makar-sankranti-02",
    categoryId: "makar-sankranti",
    name: "Uttarayan Celebration",
    layout: "starburst",
    themeId: "sunshine",
    primaryAnimation: "bounce-gentle",
    ornaments: [
      {
        emoji: "🪁",
        positionClass: "top-2 left-2",
        sizeClass: "text-3xl",
        animation: "kite-soar",
        animationDelay: "0s",
      },
      {
        emoji: "🌤️",
        positionClass: "top-2 right-2",
        sizeClass: "text-2xl",
        animation: "float",
        animationDelay: "0.5s",
      },
      {
        emoji: "🪁",
        positionClass: "bottom-4 left-4",
        sizeClass: "text-2xl",
        animation: "kite-soar",
        animationDelay: "1s",
      },
      { emoji: "✨", positionClass: "bottom-4 right-4", sizeClass: "text-2xl", animation: "twinkle" },
    ],
  },
  {
    id: "makar-sankranti-03",
    categoryId: "makar-sankranti",
    name: "Sesame Sweet",
    layout: "banner-top",
    themeId: "amber-gold",
    primaryAnimation: "rise",
    ornaments: [
      {
        emoji: "🪁",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-3xl",
        animation: "kite-soar",
        animationDelay: "0s",
      },
      { emoji: "🌅", positionClass: "bottom-2 right-2", sizeClass: "text-3xl", animation: "shimmer" },
    ],
  },
  {
    id: "makar-sankranti-04",
    categoryId: "makar-sankranti",
    name: "Kite Garland",
    layout: "garland",
    themeId: "sky-blue",
    primaryAnimation: "fade-in",
    ornaments: [
      { emoji: "🪁", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "☀️", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🪁", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌤️", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🪁", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
    ],
  },
];
