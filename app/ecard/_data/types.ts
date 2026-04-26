export type CardCategoryId =
  | "birthday"
  | "anniversary"
  | "thank-you"
  | "get-well"
  | "congrats"
  | "just-because"
  | "thinking-of-you"
  | "good-luck"
  | "welcome"
  | "miss-you"
  | "sympathy"
  | "new-year"
  | "valentines"
  | "mothers-day"
  | "fathers-day"
  | "halloween"
  | "thanksgiving";

export type TemplateLayoutKey =
  | "centered-stack"
  | "framed"
  | "banner-top"
  | "polaroid"
  | "ribbon"
  | "starburst"
  | "minimal-serif"
  | "envelope"
  | "scattered"
  | "garland";

export type AnimationKey =
  | "none"
  | "float"
  | "pulse-soft"
  | "twinkle"
  | "bounce-gentle"
  | "sway"
  | "shimmer"
  | "fade-in"
  | "rise"
  | "spin-slow";

export interface ColorTheme {
  id: string;
  label: string;
  bg: string; // full Tailwind class e.g. "bg-rose-50"
  gradientFrom: string; // e.g. "from-rose-100"
  gradientTo: string; // e.g. "to-rose-200"
  text: string; // e.g. "text-rose-900"
  accent: string; // e.g. "text-rose-600"
  border: string; // e.g. "border-rose-300"
  ring: string; // e.g. "ring-rose-200"
}

export interface OrnamentSpec {
  emoji: string;
  positionClass: string;
  sizeClass: string;
  animation: AnimationKey;
}

export interface CardTemplate {
  id: string;
  categoryId: CardCategoryId;
  name: string;
  layout: TemplateLayoutKey;
  themeId: string;
  primaryAnimation: AnimationKey;
  ornaments: OrnamentSpec[];
}

export interface CardCategory {
  id: CardCategoryId;
  label: string;
  emoji: string;
  allowConfetti: boolean;
}

export interface CardState {
  v: 1;
  t: string; // template id
  r: string; // recipient name
  s: string; // sender name
  m: string; // message
  e: string; // emoji
  c?: string; // color theme override id
}
