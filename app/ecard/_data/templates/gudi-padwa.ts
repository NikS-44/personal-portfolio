import type { CardTemplate } from "../types";

export const GUDI_PADWA_TEMPLATES: CardTemplate[] = [
  {
    id: "gudi-padwa-01",
    categoryId: "gudi-padwa",
    name: "New Year Gudi",
    layout: "centered-stack",
    themeId: "saffron-gold",
    primaryAnimation: "wave-in",
    ornaments: [
      { emoji: "🪇", positionClass: "top-2 left-2", sizeClass: "text-3xl", animation: "jiggle", animationDelay: "0s" },
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
    id: "gudi-padwa-02",
    categoryId: "gudi-padwa",
    name: "Festive Flag",
    layout: "banner-top",
    themeId: "festival-crimson",
    primaryAnimation: "rise",
    ornaments: [
      {
        emoji: "🪇",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-3xl",
        animation: "jiggle",
        animationDelay: "0s",
      },
      { emoji: "🌺", positionClass: "bottom-2 right-2", sizeClass: "text-2xl", animation: "lotus-bloom" },
    ],
  },
  {
    id: "gudi-padwa-03",
    categoryId: "gudi-padwa",
    name: "Prosperity Garland",
    layout: "garland",
    themeId: "marigold",
    primaryAnimation: "fade-in",
    ornaments: [
      { emoji: "🪇", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌺", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "✨", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌸", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
    ],
  },
];
