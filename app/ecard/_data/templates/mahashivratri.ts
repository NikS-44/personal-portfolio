import type { CardTemplate } from "../types";

export const MAHASHIVRATRI_TEMPLATES: CardTemplate[] = [
  {
    id: "mahashivratri-01",
    categoryId: "mahashivratri",
    name: "Shiva's Night",
    layout: "centered-stack",
    themeId: "midnight",
    primaryAnimation: "shimmer",
    ornaments: [
      {
        emoji: "🔱",
        positionClass: "top-2 left-2",
        sizeClass: "text-3xl",
        animation: "glow-pulse",
        animationDelay: "0s",
      },
      {
        emoji: "🌙",
        positionClass: "top-2 right-2",
        sizeClass: "text-3xl",
        animation: "float",
        animationDelay: "0.5s",
      },
      {
        emoji: "🪷",
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
    id: "mahashivratri-02",
    categoryId: "mahashivratri",
    name: "Om Namah Shivaya",
    layout: "framed",
    themeId: "peacock-teal",
    primaryAnimation: "fade-in",
    ornaments: [
      {
        emoji: "🔱",
        positionClass: "top-4 left-4",
        sizeClass: "text-2xl",
        animation: "glow-pulse",
        animationDelay: "0s",
      },
      {
        emoji: "🌙",
        positionClass: "top-4 right-4",
        sizeClass: "text-2xl",
        animation: "float",
        animationDelay: "0.5s",
      },
    ],
  },
  {
    id: "mahashivratri-03",
    categoryId: "mahashivratri",
    name: "Meditation Peace",
    layout: "minimal-serif",
    themeId: "slate-clean",
    primaryAnimation: "fade-in",
    ornaments: [{ emoji: "🔱", positionClass: "top-4 right-4", sizeClass: "text-xl", animation: "pulse-soft" }],
  },
];
