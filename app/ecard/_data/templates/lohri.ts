import type { CardTemplate } from "../types";

export const LOHRI_TEMPLATES: CardTemplate[] = [
  {
    id: "lohri-01",
    categoryId: "lohri",
    name: "Bonfire Night",
    layout: "centered-stack",
    themeId: "festival-crimson",
    primaryAnimation: "diya-flicker",
    ornaments: [
      {
        emoji: "🔥",
        positionClass: "top-2 left-2",
        sizeClass: "text-3xl",
        animation: "diya-flicker",
        animationDelay: "0s",
      },
      {
        emoji: "🔥",
        positionClass: "top-2 right-2",
        sizeClass: "text-3xl",
        animation: "diya-flicker",
        animationDelay: "0.5s",
      },
      {
        emoji: "🌽",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-2xl",
        animation: "float",
        animationDelay: "0.3s",
      },
      {
        emoji: "🥜",
        positionClass: "bottom-2 right-2",
        sizeClass: "text-2xl",
        animation: "pop",
        animationDelay: "0.7s",
      },
    ],
  },
  {
    id: "lohri-02",
    categoryId: "lohri",
    name: "Harvest Joy",
    layout: "banner-top",
    themeId: "saffron-gold",
    primaryAnimation: "wave-in",
    ornaments: [
      {
        emoji: "🔥",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-3xl",
        animation: "diya-flicker",
        animationDelay: "0s",
      },
      {
        emoji: "🌾",
        positionClass: "bottom-2 right-2",
        sizeClass: "text-2xl",
        animation: "sway",
        animationDelay: "0.4s",
      },
    ],
  },
  {
    id: "lohri-03",
    categoryId: "lohri",
    name: "Celebration Garland",
    layout: "garland",
    themeId: "amber-gold",
    primaryAnimation: "fade-in",
    ornaments: [
      { emoji: "🔥", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌾", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🥁", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌽", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
    ],
  },
];
