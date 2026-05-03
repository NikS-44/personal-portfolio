import type { CardTemplate } from "../types";

export const RATH_YATRA_TEMPLATES: CardTemplate[] = [
  {
    id: "rath-yatra-01",
    categoryId: "rath-yatra",
    name: "Chariot Festival",
    layout: "centered-stack",
    themeId: "saffron-gold",
    primaryAnimation: "wave-in",
    ornaments: [
      { emoji: "🎠", positionClass: "top-2 left-2", sizeClass: "text-3xl", animation: "drop-in", animationDelay: "0s" },
      {
        emoji: "🌺",
        positionClass: "top-2 right-2",
        sizeClass: "text-2xl",
        animation: "lotus-bloom",
        animationDelay: "0.5s",
      },
      {
        emoji: "🎊",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-2xl",
        animation: "pop",
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
    id: "rath-yatra-02",
    categoryId: "rath-yatra",
    name: "Jagannath Chariot",
    layout: "banner-top",
    themeId: "festival-crimson",
    primaryAnimation: "rise",
    ornaments: [
      {
        emoji: "🎠",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-3xl",
        animation: "drop-in",
        animationDelay: "0s",
      },
      { emoji: "🌟", positionClass: "bottom-2 right-2", sizeClass: "text-2xl", animation: "glow-pulse" },
    ],
  },
  {
    id: "rath-yatra-03",
    categoryId: "rath-yatra",
    name: "Procession Garland",
    layout: "garland",
    themeId: "amber-gold",
    primaryAnimation: "fade-in",
    ornaments: [
      { emoji: "🎠", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌺", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🎊", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌸", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
    ],
  },
];
