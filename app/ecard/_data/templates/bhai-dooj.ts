import type { CardTemplate } from "../types";

export const BHAI_DOOJ_TEMPLATES: CardTemplate[] = [
  {
    id: "bhai-dooj-01",
    categoryId: "bhai-dooj",
    name: "Sibling Day",
    layout: "centered-stack",
    themeId: "rose-garden",
    primaryAnimation: "fade-in",
    ornaments: [
      { emoji: "👫", positionClass: "top-2 left-2", sizeClass: "text-3xl", animation: "sway", animationDelay: "0s" },
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
    id: "bhai-dooj-02",
    categoryId: "bhai-dooj",
    name: "Brother Sister Bond",
    layout: "framed",
    themeId: "marigold",
    primaryAnimation: "rise",
    ornaments: [
      { emoji: "👫", positionClass: "top-4 left-4", sizeClass: "text-2xl", animation: "sway", animationDelay: "0s" },
      {
        emoji: "🌺",
        positionClass: "top-4 right-4",
        sizeClass: "text-2xl",
        animation: "lotus-bloom",
        animationDelay: "0.4s",
      },
    ],
  },
  {
    id: "bhai-dooj-03",
    categoryId: "bhai-dooj",
    name: "Post-Diwali Garland",
    layout: "garland",
    themeId: "saffron-gold",
    primaryAnimation: "fade-in",
    ornaments: [
      { emoji: "👫", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "💕", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🪔", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌸", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
    ],
  },
];
