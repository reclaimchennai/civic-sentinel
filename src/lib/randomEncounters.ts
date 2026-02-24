export interface RandomEncounter {
  id: string;
  title: string;
  description: string;
  icon: string;
  probability: number;
  reward: {
    type: "points" | "badge" | "box";
    value: number | string;
    label: string;
  };
}

export const RANDOM_ENCOUNTERS: RandomEncounter[] = [
  {
    id: "e1",
    title: "Lucky Find!",
    description: "You stumbled upon a bonus point cache!",
    icon: "🍀",
    probability: 0.15,
    reward: { type: "points", value: 100, label: "+100 Bonus Points" },
  },
  {
    id: "e2",
    title: "Mystery Box Drop!",
    description: "A mystery box appeared!",
    icon: "📦",
    probability: 0.1,
    reward: { type: "box", value: "bronze", label: "Bronze Mystery Box" },
  },
  {
    id: "e3",
    title: "Double Down!",
    description: "Your next report earns 2x points!",
    icon: "⚡",
    probability: 0.08,
    reward: { type: "points", value: 2, label: "2x Next Report" },
  },
  {
    id: "e4",
    title: "Streak Shield Found!",
    description: "A protective streak shield dropped!",
    icon: "🛡️",
    probability: 0.05,
    reward: { type: "points", value: 0, label: "Streak Shield" },
  },
  {
    id: "e5",
    title: "Rare Badge Spotted!",
    description: "An exclusive badge appeared!",
    icon: "✨",
    probability: 0.02,
    reward: { type: "badge", value: "Lucky Star", label: "Lucky Star Badge" },
  },
];

export function rollEncounter(): RandomEncounter | null {
  const roll = Math.random();
  let cumulative = 0;
  for (const encounter of RANDOM_ENCOUNTERS) {
    cumulative += encounter.probability;
    if (roll <= cumulative) return encounter;
  }
  return null;
}
