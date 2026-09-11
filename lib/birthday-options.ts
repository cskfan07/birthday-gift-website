import type { CakeId } from "@/types/birthday";

export interface CakeOption {
  id: CakeId;
  name: string;
  description: string;
  colors: string;
  accent: string;
}

export const CAKE_OPTIONS: CakeOption[] = [
  {
    id: "midnight-chocolate",
    name: "Midnight Chocolate",
    description: "Deep cocoa, dark ganache, and a dramatic candle glow.",
    colors: "from-[#1f1315] via-[#4a2422] to-[#0c0a10]",
    accent: "#d99a72",
  },
  {
    id: "strawberry-blush",
    name: "Strawberry Blush",
    description: "Soft pink frosting, strawberry sweetness, and rosy sparkle.",
    colors: "from-[#f48aa7] via-[#b94570] to-[#4d1b3d]",
    accent: "#ffd2dc",
  },
  {
    id: "vanilla-gold",
    name: "Vanilla Gold",
    description: "Warm vanilla cream, golden details, and a bright celebration.",
    colors: "from-[#f7d68c] via-[#b7813f] to-[#4c2c28]",
    accent: "#fff1bd",
  },
];

export const READY_REASONS = [
  "Your smile can fix even my worst day.",
  "You make ordinary moments feel special.",
  "You always know how to make me laugh.",
  "Your heart is kinder than you realize.",
  "Life feels brighter whenever you are around.",
  "You are completely, wonderfully yourself.",
];

export const READY_LETTERS = [
  "Today is all about celebrating you. I hope this new year brings you gentle days, big dreams, and every kind of happiness you deserve.",
  "Happy Birthday to one of the most special people in my life. Thank you for all the memories, the laughs, and the little moments that mean everything.",
  "You deserve a birthday that feels as beautiful and unforgettable as you are. I am so grateful that life gave me you.",
  "Another year of you is another reason to celebrate. Keep shining, keep dreaming, and never forget how deeply loved you are.",
];
