import type { CardTemplate } from "../types";

export const GURU_NANAK_JAYANTI_TEMPLATES: CardTemplate[] = [
  {
    id: "guru-nanak-jayanti-01",
    categoryId: "guru-nanak-jayanti",
    name: "Waheguru Blessing",
    layout: "centered-stack",
    themeId: "amber-gold",
    primaryAnimation: "glow-pulse",
    ornaments: [
      { emoji: "🕊️", positionClass: "top-2 left-2", sizeClass: "text-3xl", animation: "float", animationDelay: "0s" },
      {
        emoji: "✨",
        positionClass: "top-2 right-2",
        sizeClass: "text-2xl",
        animation: "twinkle",
        animationDelay: "0.5s",
      },
      {
        emoji: "🌺",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-2xl",
        animation: "lotus-bloom",
        animationDelay: "0.3s",
      },
      {
        emoji: "🌟",
        positionClass: "bottom-2 right-2",
        sizeClass: "text-2xl",
        animation: "glow-pulse",
        animationDelay: "0.7s",
      },
    ],
  },
  {
    id: "guru-nanak-jayanti-02",
    categoryId: "guru-nanak-jayanti",
    name: "Gurpurab Peace",
    layout: "framed",
    themeId: "sky-blue",
    primaryAnimation: "fade-in",
    ornaments: [
      { emoji: "🕊️", positionClass: "top-4 left-4", sizeClass: "text-2xl", animation: "float", animationDelay: "0s" },
      {
        emoji: "🌟",
        positionClass: "top-4 right-4",
        sizeClass: "text-2xl",
        animation: "glow-pulse",
        animationDelay: "0.4s",
      },
    ],
  },
  {
    id: "guru-nanak-jayanti-03",
    categoryId: "guru-nanak-jayanti",
    name: "Golden Temple Garland",
    layout: "garland",
    themeId: "amber-gold",
    primaryAnimation: "rise",
    ornaments: [
      { emoji: "🕊️", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "✨", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌺", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌟", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
    ],
  },
];
