import type { CardTemplate } from "../types";

export const RAM_NAVAMI_TEMPLATES: CardTemplate[] = [
  {
    id: "ram-navami-01",
    categoryId: "ram-navami",
    name: "Jai Shri Ram",
    layout: "centered-stack",
    themeId: "saffron-gold",
    primaryAnimation: "glow-pulse",
    ornaments: [
      {
        emoji: "🙏",
        positionClass: "top-2 left-2",
        sizeClass: "text-3xl",
        animation: "pulse-soft",
        animationDelay: "0s",
      },
      {
        emoji: "🌺",
        positionClass: "top-2 right-2",
        sizeClass: "text-2xl",
        animation: "lotus-bloom",
        animationDelay: "0.5s",
      },
      {
        emoji: "✨",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-2xl",
        animation: "twinkle",
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
    id: "ram-navami-02",
    categoryId: "ram-navami",
    name: "Divine Blessings",
    layout: "framed",
    themeId: "marigold",
    primaryAnimation: "fade-in",
    ornaments: [
      {
        emoji: "🙏",
        positionClass: "top-4 left-4",
        sizeClass: "text-2xl",
        animation: "pulse-soft",
        animationDelay: "0s",
      },
      {
        emoji: "🌼",
        positionClass: "top-4 right-4",
        sizeClass: "text-2xl",
        animation: "lotus-bloom",
        animationDelay: "0.4s",
      },
    ],
  },
  {
    id: "ram-navami-03",
    categoryId: "ram-navami",
    name: "Celebration Garland",
    layout: "garland",
    themeId: "saffron-gold",
    primaryAnimation: "rise",
    ornaments: [
      { emoji: "🙏", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌺", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "✨", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌸", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
    ],
  },
];
