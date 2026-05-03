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
  | "thanksgiving"
  // Hindu / Gujarati / Indian
  | "makar-sankranti"
  | "lohri"
  | "pongal"
  | "vasant-panchami"
  | "mahashivratri"
  | "holi"
  | "gudi-padwa"
  | "ram-navami"
  | "hanuman-jayanti"
  | "akshaya-tritiya"
  | "baisakhi"
  | "rath-yatra"
  | "janmashtami"
  | "onam"
  | "ganesh-chaturthi"
  | "navratri"
  | "karva-chauth"
  | "dhanteras"
  | "diwali"
  | "bhai-dooj"
  | "gujarati-new-year"
  | "chhath-puja"
  | "dussehra"
  | "raksha-bandhan"
  | "guru-nanak-jayanti"
  // American
  | "christmas"
  | "easter"
  | "independence-day";

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
  | "spin-slow"
  // Festive
  | "diya-flicker"
  | "color-splash"
  | "kite-soar"
  | "lotus-bloom"
  | "firework-burst"
  | "rangoli-spin"
  | "peacock-dance"
  | "pop"
  | "jiggle"
  | "drop-in"
  | "glow-pulse"
  | "wave-in"
  | "orbit"
  // Extreme / in-your-face
  | "mega-bounce"
  | "elastic-pop"
  | "pendulum"
  | "rubber-shake"
  | "3d-flip"
  | "zoom-pulse"
  | "rainbow-burst"
  | "wobbly-spin"
  | "carnival"
  | "slam-bounce"
  | "neon-flare"
  | "spin-grow";

export interface ColorTheme {
  id: string;
  label: string;
  bg: string;
  gradientFrom: string;
  gradientTo: string;
  text: string;
  accent: string;
  border: string;
  ring: string;
}

export interface OrnamentSpec {
  emoji: string;
  positionClass: string;
  sizeClass: string;
  animation: AnimationKey;
  /** CSS delay value e.g. "0.3s" — staggers this ornament's animation */
  animationDelay?: string;
}

export type CelebrationPreset = "confetti" | "fireworks" | "hearts" | "sparkles" | "stars" | "petals" | "snow" | "none";

export type ParticlePreset =
  | "sparkles"
  | "snow"
  | "confetti-rain"
  | "fireworks"
  | "petals"
  | "hearts"
  | "stars"
  | "embers";

export interface CardTemplate {
  id: string;
  categoryId: CardCategoryId;
  name: string;
  layout: TemplateLayoutKey;
  themeId: string;
  primaryAnimation: AnimationKey;
  ornaments: OrnamentSpec[];
  /** Path relative to /public, e.g. "/ecard-bg/diwali-lights.jpg" */
  backgroundImage?: string;
  /** Ambient particle effect layered behind card content */
  particlePreset?: ParticlePreset;
}

export interface CardCategory {
  id: CardCategoryId;
  label: string;
  emoji: string;
  allowConfetti: boolean;
  /** Custom confetti particle colors for this holiday */
  confettiColors?: string[];
  /** Headline shown on the card, e.g. "Happy Mother's Day!" */
  greeting: string;
  /** 4–5 pre-written messages the user can cycle through in StepPersonalize */
  sampleMessages: string[];
  /** Which celebration effect fires when the card is first viewed */
  defaultCelebration: CelebrationPreset;
}

export interface CardState {
  v: 1;
  t: string; // template id
  r: string; // recipient name
  s: string; // sender name
  m: string; // message
  e: string; // emoji
  c?: string; // color theme override id
  /** User-chosen celebration effect; falls back to category defaultCelebration */
  a?: CelebrationPreset;
}
