import type { CardTemplate } from "../types";

export const RAKSHA_BANDHAN_TEMPLATES: CardTemplate[] = [
  {
    id: "raksha-bandhan-01",
    categoryId: "raksha-bandhan",
    name: "Thread of Love",
    layout: "centered-stack",
    themeId: "rose-garden",
    primaryAnimation: "fade-in",
    ornaments: [
      { emoji: "🪢", positionClass: "top-2 left-2", sizeClass: "text-3xl", animation: "sway", animationDelay: "0s" },
      {
        emoji: "💕",
        positionClass: "top-2 right-2",
        sizeClass: "text-2xl",
        animation: "pulse-soft",
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
        emoji: "🌺",
        positionClass: "bottom-2 right-2",
        sizeClass: "text-2xl",
        animation: "lotus-bloom",
        animationDelay: "0.6s",
      },
    ],
  },
  {
    id: "raksha-bandhan-02",
    categoryId: "raksha-bandhan",
    name: "Sibling Bond",
    layout: "framed",
    themeId: "marigold",
    primaryAnimation: "rise",
    ornaments: [
      { emoji: "🪢", positionClass: "top-4 left-4", sizeClass: "text-2xl", animation: "sway", animationDelay: "0s" },
      {
        emoji: "💛",
        positionClass: "top-4 right-4",
        sizeClass: "text-2xl",
        animation: "pulse-soft",
        animationDelay: "0.4s",
      },
    ],
  },
  {
    id: "raksha-bandhan-03",
    categoryId: "raksha-bandhan",
    name: "Sweet Rakhi",
    layout: "ribbon",
    themeId: "saffron-gold",
    primaryAnimation: "shimmer",
    ornaments: [
      { emoji: "🪢", positionClass: "bottom-4 left-4", sizeClass: "text-2xl", animation: "sway", animationDelay: "0s" },
      { emoji: "🌸", positionClass: "bottom-4 right-4", sizeClass: "text-2xl", animation: "lotus-bloom" },
    ],
  },
  {
    id: "raksha-bandhan-04",
    categoryId: "raksha-bandhan",
    name: "Rakhi Garland",
    layout: "garland",
    themeId: "rose-garden",
    primaryAnimation: "fade-in",
    ornaments: [
      { emoji: "🪢", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌸", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "💕", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌺", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
    ],
  },
];
