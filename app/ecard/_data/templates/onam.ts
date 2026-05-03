import type { CardTemplate } from "../types";

export const ONAM_TEMPLATES: CardTemplate[] = [
  {
    id: "onam-01",
    categoryId: "onam",
    name: "Pookalam Bloom",
    layout: "centered-stack",
    themeId: "emerald",
    primaryAnimation: "rangoli-spin",
    ornaments: [
      {
        emoji: "🌸",
        positionClass: "top-2 left-2",
        sizeClass: "text-3xl",
        animation: "lotus-bloom",
        animationDelay: "0s",
      },
      {
        emoji: "🌺",
        positionClass: "top-2 right-2",
        sizeClass: "text-3xl",
        animation: "lotus-bloom",
        animationDelay: "0.5s",
      },
      {
        emoji: "🌼",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-2xl",
        animation: "lotus-bloom",
        animationDelay: "0.3s",
      },
      {
        emoji: "🌻",
        positionClass: "bottom-2 right-2",
        sizeClass: "text-2xl",
        animation: "lotus-bloom",
        animationDelay: "0.7s",
      },
    ],
  },
  {
    id: "onam-02",
    categoryId: "onam",
    name: "Harvest Celebration",
    layout: "banner-top",
    themeId: "marigold",
    primaryAnimation: "wave-in",
    ornaments: [
      {
        emoji: "🌸",
        positionClass: "bottom-2 left-2",
        sizeClass: "text-3xl",
        animation: "lotus-bloom",
        animationDelay: "0s",
      },
      { emoji: "🌾", positionClass: "bottom-2 right-2", sizeClass: "text-2xl", animation: "sway" },
    ],
  },
  {
    id: "onam-03",
    categoryId: "onam",
    name: "Kerala Flower Garland",
    layout: "garland",
    themeId: "emerald",
    primaryAnimation: "fade-in",
    ornaments: [
      { emoji: "🌸", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌺", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌼", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌻", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
      { emoji: "🌹", positionClass: "top-0", sizeClass: "text-xl", animation: "none" },
    ],
  },
];
