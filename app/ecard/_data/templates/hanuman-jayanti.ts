import type { CardTemplate } from "../types";

export const HANUMAN_JAYANTI_TEMPLATES: CardTemplate[] = [
  {
    id: "hanuman-jayanti-01",
    categoryId: "hanuman-jayanti",
    name: "Bajrang Bali",
    layout: "centered-stack",
    themeId: "festival-crimson",
    primaryAnimation: "glow-pulse",
    ornaments: [
      {
        emoji: "🌺",
        positionClass: "top-2 left-2",
        sizeClass: "text-3xl",
        animation: "lotus-bloom",
        animationDelay: "0s",
      },
      {
        emoji: "✨",
        positionClass: "top-2 right-2",
        sizeClass: "text-2xl",
        animation: "twinkle",
        animationDelay: "0.4s",
      },
      {
        emoji: "🌸",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-2xl",
        animation: "lotus-bloom",
        animationDelay: "0.2s",
      },
      {
        emoji: "🌟",
        positionClass: "bottom-2 right-2",
        sizeClass: "text-2xl",
        animation: "glow-pulse",
        animationDelay: "0.6s",
      },
    ],
  },
  {
    id: "hanuman-jayanti-02",
    categoryId: "hanuman-jayanti",
    name: "Devotion Banner",
    layout: "banner-top",
    themeId: "saffron-gold",
    primaryAnimation: "wave-in",
    ornaments: [
      {
        emoji: "🌺",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-3xl",
        animation: "lotus-bloom",
        animationDelay: "0s",
      },
      { emoji: "🌟", positionClass: "bottom-2 right-2", sizeClass: "text-2xl", animation: "glow-pulse" },
    ],
  },
  {
    id: "hanuman-jayanti-03",
    categoryId: "hanuman-jayanti",
    name: "Sacred Garland",
    layout: "garland",
    themeId: "festival-crimson",
    primaryAnimation: "fade-in",
    ornaments: [
      { emoji: "🌺", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "✨", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌸", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌺", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
    ],
  },
];
