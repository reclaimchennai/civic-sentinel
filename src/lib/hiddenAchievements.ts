export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

export interface HiddenAchievement {
  id: string;
  name: string;
  hint: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  pointsReward: number;
  // Detection contract: the check route's matches() switch on `id`.
  // Adding an entry here without also updating the matches() function
  // means it will never unlock.
}

export const HIDDEN_ACHIEVEMENTS: HiddenAchievement[] = [
  {
    id: "midnight_warrior",
    name: "Night Owl",
    hint: "The city never sleeps...",
    description: "Submit 5+ reports between midnight and 4 AM IST",
    icon: "Bird",
    rarity: "rare",
    pointsReward: 100,
  },
  {
    id: "early_bird",
    name: "Early Bird",
    hint: "Catch the worm...",
    description: "Submit 3+ reports between 5 and 8 AM IST",
    icon: "Sunrise",
    rarity: "rare",
    pointsReward: 100,
  },
  {
    id: "fibonacci_filer",
    name: "Fibonacci Filer",
    hint: "There's a pattern in numbers...",
    description: "Have a total report count equal to a Fibonacci number",
    icon: "Spiral",
    rarity: "epic",
    pointsReward: 75,
  },
  {
    id: "category_collector",
    name: "Category Collector",
    hint: "A jack of all trades...",
    description: "Report in all 6 violation categories",
    icon: "Layers",
    rarity: "rare",
    pointsReward: 200,
  },
  {
    id: "zone_nomad",
    name: "Zone Nomad",
    hint: "Always exploring...",
    description: "Submit reports from 10+ distinct zones",
    icon: "Compass",
    rarity: "epic",
    pointsReward: 300,
  },
  {
    id: "perfect_streak",
    name: "The Perfectionist",
    hint: "Consistency is everything...",
    description: "Hit a 7-day report streak",
    icon: "Flame",
    rarity: "rare",
    pointsReward: 150,
  },
  {
    id: "century_club",
    name: "Centurion",
    hint: "Triple digits await...",
    description: "Submit 100 reports lifetime",
    icon: "Award",
    rarity: "legendary",
    pointsReward: 500,
  },
  {
    id: "approval_ace",
    name: "Approval Ace",
    hint: "Quality over quantity...",
    description: "95%+ approval rate with at least 20 reports submitted",
    icon: "ShieldCheck",
    rarity: "epic",
    pointsReward: 400,
  },
];
