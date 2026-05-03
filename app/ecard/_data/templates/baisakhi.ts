import type { CardTemplate } from "../types";

export const BAISAKHI_TEMPLATES: CardTemplate[] = [
  {
    id: "baisakhi-01",
    categoryId: "baisakhi",
    name: "Harvest Dance",
    layout: "centered-stack",
    themeId: "marigold",
    primaryAnimation: "bounce-gentle",
    ornaments: [
      { emoji: "🌾", positionClass: "top-2 left-2", sizeClass: "text-3xl", animation: "sway", animationDelay: "0s" },
      {
        emoji: "💃",
        positionClass: "top-2 right-2",
        sizeClass: "text-3xl",
        animation: "peacock-dance",
        animationDelay: "0.4s",
      },
      {
        emoji: "🥁",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-2xl",
        animation: "jiggle",
        animationDelay: "0.2s",
      },
      {
        emoji: "🌻",
        positionClass: "bottom-2 right-2",
        sizeClass: "text-2xl",
        animation: "lotus-bloom",
        animationDelay: "0.6s",
      },
    ],
  },
  {
    id: "baisakhi-02",
    categoryId: "baisakhi",
    name: "Bhangra Beat",
    layout: "scattered",
    themeId: "saffron-gold",
    primaryAnimation: "color-splash",
    ornaments: [
      { emoji: "🌾", positionClass: "top-2 left-2", sizeClass: "text-3xl", animation: "sway", animationDelay: "0s" },
      { emoji: "🎊", positionClass: "top-2 right-2", sizeClass: "text-3xl", animation: "pop", animationDelay: "0.5s" },
      {
        emoji: "💃",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-3xl",
        animation: "sway",
        animationDelay: "0.8s",
      },
      {
        emoji: "🥁",
        positionClass: "bottom-2 right-2",
        sizeClass: "text-2xl",
        animation: "jiggle",
        animationDelay: "0.3s",
      },
    ],
  },
  {
    id: "baisakhi-03",
    categoryId: "baisakhi",
    name: "Golden Harvest Garland",
    layout: "garland",
    themeId: "marigold",
    primaryAnimation: "rise",
    ornaments: [
      { emoji: "🌾", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌻", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "💃", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🥁", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
    ],
  },
];
