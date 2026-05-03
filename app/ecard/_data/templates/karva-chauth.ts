import type { CardTemplate } from "../types";

export const KARVA_CHAUTH_TEMPLATES: CardTemplate[] = [
  {
    id: "karva-chauth-01",
    categoryId: "karva-chauth",
    name: "Moonlit Love",
    layout: "centered-stack",
    themeId: "midnight",
    primaryAnimation: "shimmer",
    ornaments: [
      { emoji: "🌕", positionClass: "top-2 left-2", sizeClass: "text-3xl", animation: "orbit", animationDelay: "0s" },
      {
        emoji: "💕",
        positionClass: "top-2 right-2",
        sizeClass: "text-2xl",
        animation: "pulse-soft",
        animationDelay: "0.5s",
      },
      {
        emoji: "🪔",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-2xl",
        animation: "diya-flicker",
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
    id: "karva-chauth-02",
    categoryId: "karva-chauth",
    name: "Full Moon Fast",
    layout: "framed",
    themeId: "lavender",
    primaryAnimation: "fade-in",
    ornaments: [
      { emoji: "🌕", positionClass: "top-4 left-4", sizeClass: "text-2xl", animation: "float", animationDelay: "0s" },
      {
        emoji: "💕",
        positionClass: "top-4 right-4",
        sizeClass: "text-2xl",
        animation: "pulse-soft",
        animationDelay: "0.4s",
      },
    ],
  },
  {
    id: "karva-chauth-03",
    categoryId: "karva-chauth",
    name: "Sacred Moon Garland",
    layout: "garland",
    themeId: "rose-garden",
    primaryAnimation: "rise",
    ornaments: [
      { emoji: "🌕", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "💕", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🪔", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌸", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
    ],
  },
];
