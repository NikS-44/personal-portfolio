import type { CardTemplate } from "../types";

export const DHANTERAS_TEMPLATES: CardTemplate[] = [
  {
    id: "dhanteras-01",
    categoryId: "dhanteras",
    name: "Gold and Prosperity",
    layout: "centered-stack",
    themeId: "amber-gold",
    primaryAnimation: "glow-pulse",
    ornaments: [
      { emoji: "🪙", positionClass: "top-2 left-2", sizeClass: "text-3xl", animation: "orbit", animationDelay: "0s" },
      {
        emoji: "🪙",
        positionClass: "top-2 right-2",
        sizeClass: "text-3xl",
        animation: "orbit",
        animationDelay: "0.6s",
      },
      {
        emoji: "🪔",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-2xl",
        animation: "diya-flicker",
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
    id: "dhanteras-02",
    categoryId: "dhanteras",
    name: "Wealth Banner",
    layout: "banner-top",
    themeId: "saffron-gold",
    primaryAnimation: "shimmer",
    ornaments: [
      {
        emoji: "🪙",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-3xl",
        animation: "orbit",
        animationDelay: "0s",
      },
      {
        emoji: "🪔",
        positionClass: "bottom-2 right-2",
        sizeClass: "text-3xl",
        animation: "diya-flicker",
        animationDelay: "0.5s",
      },
    ],
  },
  {
    id: "dhanteras-03",
    categoryId: "dhanteras",
    name: "Lakshmi Coins Garland",
    layout: "garland",
    themeId: "amber-gold",
    primaryAnimation: "fade-in",
    ornaments: [
      { emoji: "🪙", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🪔", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "✨", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌺", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
    ],
  },
];
