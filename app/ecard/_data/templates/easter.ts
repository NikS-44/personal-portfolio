import type { CardTemplate } from "../types";

export const EASTER_TEMPLATES: CardTemplate[] = [
  {
    id: "easter-01",
    categoryId: "easter",
    name: "Spring Bloom",
    layout: "centered-stack",
    themeId: "mint",
    primaryAnimation: "fade-in",
    ornaments: [
      { emoji: "🐣", positionClass: "top-2 left-2", sizeClass: "text-3xl", animation: "pop", animationDelay: "0s" },
      {
        emoji: "🌷",
        positionClass: "top-2 right-2",
        sizeClass: "text-2xl",
        animation: "lotus-bloom",
        animationDelay: "0.5s",
      },
      {
        emoji: "🐰",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-2xl",
        animation: "bounce-gentle",
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
    id: "easter-02",
    categoryId: "easter",
    name: "Easter Egg Hunt",
    layout: "scattered",
    themeId: "lavender",
    primaryAnimation: "bounce-gentle",
    ornaments: [
      { emoji: "🥚", positionClass: "top-2 left-2", sizeClass: "text-3xl", animation: "pop", animationDelay: "0s" },
      {
        emoji: "🐰",
        positionClass: "top-2 right-2",
        sizeClass: "text-3xl",
        animation: "bounce-gentle",
        animationDelay: "0.4s",
      },
      {
        emoji: "🌷",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-3xl",
        animation: "lotus-bloom",
        animationDelay: "0.8s",
      },
      {
        emoji: "🌸",
        positionClass: "bottom-2 right-2",
        sizeClass: "text-2xl",
        animation: "lotus-bloom",
        animationDelay: "0.2s",
      },
    ],
  },
  {
    id: "easter-03",
    categoryId: "easter",
    name: "Pastel Garland",
    layout: "garland",
    themeId: "rose-garden",
    primaryAnimation: "rise",
    ornaments: [
      { emoji: "🐣", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌷", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🐰", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🥚", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
    ],
  },
];
