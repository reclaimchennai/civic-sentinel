export type BadgeRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface ExclusiveBadge {
  id: string;
  name: string;
  description: string;
  rarity: BadgeRarity;
  image: string;
  glowColor: string;
  earnedBy: number;
  condition: string;
}

export const BADGE_RARITY_CONFIG: Record<
  BadgeRarity,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    glowClass: string;
  }
> = {
  common: {
    label: "Common",
    color: "text-zinc-400",
    bgColor: "bg-zinc-800",
    borderColor: "border-zinc-600",
    glowClass: "",
  },
  uncommon: {
    label: "Uncommon",
    color: "text-green-400",
    bgColor: "bg-green-900/20",
    borderColor: "border-green-500/30",
    glowClass: "shadow-green-500/20",
  },
  rare: {
    label: "Rare",
    color: "text-blue-400",
    bgColor: "bg-blue-900/20",
    borderColor: "border-blue-500/30",
    glowClass: "shadow-blue-500/20",
  },
  epic: {
    label: "Epic",
    color: "text-purple-400",
    bgColor: "bg-purple-900/20",
    borderColor: "border-purple-500/30",
    glowClass: "shadow-purple-500/30",
  },
  legendary: {
    label: "Legendary",
    color: "text-yellow-400",
    bgColor: "bg-yellow-900/20",
    borderColor: "border-yellow-500/30",
    glowClass: "shadow-yellow-500/40",
  },
};

export const EXCLUSIVE_BADGES: ExclusiveBadge[] = [
  {
    id: "b1",
    name: "Rookie Sentinel",
    description: "Welcome to Chennai Civic Sentinel! Awarded for signing up.",
    rarity: "common",
    image: "/badges/rookie-sentinel.png",
    glowColor: "zinc",
    earnedBy: 100,
    condition: "Sign up for an account",
  },
  {
    id: "b2",
    name: "First Report",
    description: "You submitted your very first civic violation report.",
    rarity: "common",
    image: "/badges/first-report.png",
    glowColor: "zinc",
    earnedBy: 85,
    condition: "Submit your first report",
  },
  {
    id: "b3",
    name: "Pothole Paladin",
    description: "Dedicated to fixing Chennai's roads, one pothole at a time.",
    rarity: "uncommon",
    image: "/badges/pothole-paladin.png",
    glowColor: "green",
    earnedBy: 32,
    condition: "Report 10 road damage violations",
  },
  {
    id: "b4",
    name: "Night Owl",
    description: "The city never sleeps, and neither do you.",
    rarity: "uncommon",
    image: "/badges/night-owl.png",
    glowColor: "green",
    earnedBy: 18,
    condition: "Submit 5 reports between midnight and 5 AM",
  },
  {
    id: "b5",
    name: "Zone Hero",
    description: "Recognized as a top contributor in your zone.",
    rarity: "rare",
    image: "/badges/zone-hero.png",
    glowColor: "blue",
    earnedBy: 8,
    condition: "Reach #1 on any zone leaderboard",
  },
  {
    id: "b6",
    name: "Streak Master",
    description: "Consistency is key. You maintained a 30-day reporting streak.",
    rarity: "rare",
    image: "/badges/streak-master.png",
    glowColor: "blue",
    earnedBy: 5,
    condition: "Maintain a 30-day reporting streak",
  },
  {
    id: "b7",
    name: "Chennai Explorer",
    description: "You have reported violations across all 15 zones of Chennai.",
    rarity: "epic",
    image: "/badges/chennai-explorer.png",
    glowColor: "purple",
    earnedBy: 2,
    condition: "Submit reports in all 15 Chennai zones",
  },
  {
    id: "b8",
    name: "Monsoon Warrior",
    description: "Braved the rains to report flooding and drainage issues.",
    rarity: "epic",
    image: "/badges/monsoon-warrior.png",
    glowColor: "purple",
    earnedBy: 3,
    condition: "Report 15 drainage/flooding issues during monsoon season",
  },
  {
    id: "b9",
    name: "Chennai Legend",
    description: "A true legend of civic action. Your dedication is unmatched.",
    rarity: "legendary",
    image: "/badges/chennai-legend.png",
    glowColor: "yellow",
    earnedBy: 0.5,
    condition: "Earn 10,000 lifetime points",
  },
  {
    id: "b10",
    name: "The Founder",
    description: "Among the first 100 citizens to join the movement.",
    rarity: "legendary",
    image: "/badges/the-founder.png",
    glowColor: "yellow",
    earnedBy: 0.3,
    condition: "Be among the first 100 users to sign up",
  },
];
