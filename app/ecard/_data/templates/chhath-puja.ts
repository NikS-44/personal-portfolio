import type { CardTemplate } from "../types";

export const CHHATH_PUJA_TEMPLATES: CardTemplate[] = [
  {
    id: "chhath-puja-01",
    categoryId: "chhath-puja",
    name: "Sun Worship",
    layout: "centered-stack",
    themeId: "saffron-gold",
    primaryAnimation: "shimmer",
    ornaments: [
      {
        emoji: "☀️",
        positionClass: "top-2 left-2",
        sizeClass: "text-3xl",
        animation: "spin-slow",
        animationDelay: "0s",
      },
      {
        emoji: "🌅",
        positionClass: "top-2 right-2",
        sizeClass: "text-2xl",
        animation: "shimmer",
        animationDelay: "0.5s",
      },
      {
        emoji: "🌾",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-2xl",
        animation: "sway",
        animationDelay: "0.3s",
      },
      {
        emoji: "🌸",
        positionClass: "bottom-2 right-2",
        sizeClass: "text-2xl",
        animation: "lotus-bloom",
        animationDelay: "0.7s",
      },
    ],
  },
  {
    id: "chhath-puja-02",
    categoryId: "chhath-puja",
    name: "River Offering",
    layout: "banner-top",
    themeId: "marigold",
    primaryAnimation: "rise",
    ornaments: [
      {
        emoji: "☀️",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-3xl",
        animation: "spin-slow",
        animationDelay: "0s",
      },
      { emoji: "🌺", positionClass: "bottom-2 right-2", sizeClass: "text-2xl", animation: "lotus-bloom" },
    ],
  },
  {
    id: "chhath-puja-03",
    categoryId: "chhath-puja",
    name: "Sacred Garland",
    layout: "garland",
    themeId: "saffron-gold",
    primaryAnimation: "fade-in",
    ornaments: [
      { emoji: "☀️", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌅", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌾", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌸", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
    ],
  },
];
