import type { CardTemplate } from "../types";

export const VASANT_PANCHAMI_TEMPLATES: CardTemplate[] = [
  {
    id: "vasant-panchami-01",
    categoryId: "vasant-panchami",
    name: "Yellow Bliss",
    layout: "centered-stack",
    themeId: "sunshine",
    primaryAnimation: "fade-in",
    ornaments: [
      {
        emoji: "🌼",
        positionClass: "top-2 left-2",
        sizeClass: "text-3xl",
        animation: "lotus-bloom",
        animationDelay: "0s",
      },
      {
        emoji: "📚",
        positionClass: "top-2 right-2",
        sizeClass: "text-2xl",
        animation: "float",
        animationDelay: "0.5s",
      },
      {
        emoji: "🌸",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-2xl",
        animation: "lotus-bloom",
        animationDelay: "0.3s",
      },
      {
        emoji: "✨",
        positionClass: "bottom-2 right-2",
        sizeClass: "text-2xl",
        animation: "twinkle",
        animationDelay: "0.7s",
      },
    ],
  },
  {
    id: "vasant-panchami-02",
    categoryId: "vasant-panchami",
    name: "Saraswati Blessings",
    layout: "framed",
    themeId: "marigold",
    primaryAnimation: "shimmer",
    ornaments: [
      {
        emoji: "🌼",
        positionClass: "top-4 left-4",
        sizeClass: "text-2xl",
        animation: "lotus-bloom",
        animationDelay: "0s",
      },
      {
        emoji: "🪷",
        positionClass: "top-4 right-4",
        sizeClass: "text-2xl",
        animation: "lotus-bloom",
        animationDelay: "0.4s",
      },
    ],
  },
  {
    id: "vasant-panchami-03",
    categoryId: "vasant-panchami",
    name: "Spring Garland",
    layout: "garland",
    themeId: "sunshine",
    primaryAnimation: "rise",
    ornaments: [
      { emoji: "🌼", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌸", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌺", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌼", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
    ],
  },
];
