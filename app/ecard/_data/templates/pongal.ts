import type { CardTemplate } from "../types";

export const PONGAL_TEMPLATES: CardTemplate[] = [
  {
    id: "pongal-01",
    categoryId: "pongal",
    name: "Harvest Festival",
    layout: "centered-stack",
    themeId: "marigold",
    primaryAnimation: "fade-in",
    ornaments: [
      { emoji: "🍚", positionClass: "top-2 left-2", sizeClass: "text-3xl", animation: "pop", animationDelay: "0s" },
      {
        emoji: "☀️",
        positionClass: "top-2 right-2",
        sizeClass: "text-3xl",
        animation: "spin-slow",
        animationDelay: "0s",
      },
      {
        emoji: "🌾",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-2xl",
        animation: "sway",
        animationDelay: "0.4s",
      },
      {
        emoji: "🐄",
        positionClass: "bottom-2 right-2",
        sizeClass: "text-2xl",
        animation: "float",
        animationDelay: "0.6s",
      },
    ],
  },
  {
    id: "pongal-02",
    categoryId: "pongal",
    name: "Sweet Pongal",
    layout: "banner-top",
    themeId: "sunshine",
    primaryAnimation: "rise",
    ornaments: [
      { emoji: "🍚", positionClass: "bottom-2 left-2", sizeClass: "text-3xl", animation: "pop", animationDelay: "0s" },
      { emoji: "🌺", positionClass: "bottom-2 right-2", sizeClass: "text-2xl", animation: "lotus-bloom" },
    ],
  },
  {
    id: "pongal-03",
    categoryId: "pongal",
    name: "Kolam Garland",
    layout: "garland",
    themeId: "marigold",
    primaryAnimation: "fade-in",
    ornaments: [
      { emoji: "🍚", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "☀️", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌾", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌺", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
    ],
  },
];
