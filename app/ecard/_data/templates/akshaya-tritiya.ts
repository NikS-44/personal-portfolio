import type { CardTemplate } from "../types";

export const AKSHAYA_TRITIYA_TEMPLATES: CardTemplate[] = [
  {
    id: "akshaya-tritiya-01",
    categoryId: "akshaya-tritiya",
    name: "Golden Day",
    layout: "centered-stack",
    themeId: "amber-gold",
    primaryAnimation: "glow-pulse",
    ornaments: [
      {
        emoji: "💛",
        positionClass: "top-2 left-2",
        sizeClass: "text-3xl",
        animation: "glow-pulse",
        animationDelay: "0s",
      },
      {
        emoji: "🌟",
        positionClass: "top-2 right-2",
        sizeClass: "text-3xl",
        animation: "glow-pulse",
        animationDelay: "0.4s",
      },
      {
        emoji: "🌺",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-2xl",
        animation: "lotus-bloom",
        animationDelay: "0.2s",
      },
      {
        emoji: "✨",
        positionClass: "bottom-2 right-2",
        sizeClass: "text-2xl",
        animation: "twinkle",
        animationDelay: "0.6s",
      },
    ],
  },
  {
    id: "akshaya-tritiya-02",
    categoryId: "akshaya-tritiya",
    name: "Prosperity Starburst",
    layout: "starburst",
    themeId: "saffron-gold",
    primaryAnimation: "shimmer",
    ornaments: [
      {
        emoji: "💛",
        positionClass: "top-2 left-2",
        sizeClass: "text-3xl",
        animation: "glow-pulse",
        animationDelay: "0s",
      },
      {
        emoji: "🪙",
        positionClass: "top-2 right-2",
        sizeClass: "text-2xl",
        animation: "orbit",
        animationDelay: "0.5s",
      },
      {
        emoji: "🌟",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-2xl",
        animation: "glow-pulse",
        animationDelay: "0.3s",
      },
      {
        emoji: "🌺",
        positionClass: "bottom-2 right-2",
        sizeClass: "text-2xl",
        animation: "lotus-bloom",
        animationDelay: "0.7s",
      },
    ],
  },
  {
    id: "akshaya-tritiya-03",
    categoryId: "akshaya-tritiya",
    name: "Auspicious Garland",
    layout: "garland",
    themeId: "amber-gold",
    primaryAnimation: "rise",
    ornaments: [
      { emoji: "💛", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌺", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "✨", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌟", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
    ],
  },
];
