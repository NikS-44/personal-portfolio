import type { CardCategory } from "./types";

export const CATEGORIES: CardCategory[] = [
  { id: "birthday", label: "Birthday", emoji: "🎂", allowConfetti: true },
  { id: "anniversary", label: "Anniversary", emoji: "💕", allowConfetti: true },
  { id: "thank-you", label: "Thank You", emoji: "🙏", allowConfetti: true },
  { id: "get-well", label: "Get Well", emoji: "🌷", allowConfetti: false },
  { id: "congrats", label: "Congratulations", emoji: "🎉", allowConfetti: true },
  {
    id: "just-because",
    label: "Just Because",
    emoji: "🌸",
    allowConfetti: true,
  },
  {
    id: "thinking-of-you",
    label: "Thinking of You",
    emoji: "💭",
    allowConfetti: false,
  },
  { id: "good-luck", label: "Good Luck", emoji: "🍀", allowConfetti: true },
  { id: "welcome", label: "Welcome", emoji: "🏠", allowConfetti: true },
  { id: "miss-you", label: "Miss You", emoji: "💙", allowConfetti: false },
  { id: "sympathy", label: "Sympathy", emoji: "🕊️", allowConfetti: false },
  { id: "new-year", label: "New Year", emoji: "🎆", allowConfetti: true },
  { id: "valentines", label: "Valentine's Day", emoji: "❤️", allowConfetti: true },
  { id: "mothers-day", label: "Mother's Day", emoji: "🌹", allowConfetti: true },
  { id: "fathers-day", label: "Father's Day", emoji: "👔", allowConfetti: true },
  { id: "halloween", label: "Halloween", emoji: "🎃", allowConfetti: false },
  {
    id: "thanksgiving",
    label: "Thanksgiving",
    emoji: "🦃",
    allowConfetti: true,
  },
];
