import type { BadgeRarity } from "./exclusiveBadges";

export type BoxRarity = "bronze" | "silver" | "gold";

export interface MysteryBox {
  id: string;
  rarity: BoxRarity;
  earnedAt: string;
  opened: boolean;
  reward?: MysteryReward;
}

export interface MysteryReward {
  type: "points" | "badge" | "multiplier" | "shield";
  value: number | string;
  label: string;
  rarity: BadgeRarity;
}

export const BOX_CONFIG: Record<
  BoxRarity,
  {
    label: string;
    color: string;
    bgGradient: string;
    rewards: { type: string; weight: number; label: string }[];
  }
> = {
  bronze: {
    label: "Bronze Box",
    color: "text-orange-600",
    bgGradient: "from-orange-900 to-zinc-900",
    rewards: [
      { type: "points", weight: 60, label: "25-50 Points" },
      { type: "shield", weight: 25, label: "Streak Shield" },
      { type: "multiplier", weight: 15, label: "1.5x Multiplier (1hr)" },
    ],
  },
  silver: {
    label: "Silver Box",
    color: "text-zinc-300",
    bgGradient: "from-zinc-600 to-zinc-900",
    rewards: [
      { type: "points", weight: 40, label: "50-150 Points" },
      { type: "shield", weight: 20, label: "Streak Shield" },
      { type: "multiplier", weight: 25, label: "2x Multiplier (1hr)" },
      { type: "badge", weight: 15, label: "Uncommon Badge" },
    ],
  },
  gold: {
    label: "Gold Box",
    color: "text-yellow-400",
    bgGradient: "from-yellow-800 to-zinc-900",
    rewards: [
      { type: "points", weight: 30, label: "100-500 Points" },
      { type: "badge", weight: 30, label: "Rare+ Badge" },
      { type: "multiplier", weight: 25, label: "3x Multiplier (2hr)" },
      { type: "shield", weight: 15, label: "2x Streak Shields" },
    ],
  },
};

export const MOCK_BOXES: MysteryBox[] = [
  {
    id: "box1",
    rarity: "bronze",
    earnedAt: new Date(Date.now() - 86400000).toISOString(),
    opened: false,
  },
  {
    id: "box2",
    rarity: "silver",
    earnedAt: new Date(Date.now() - 172800000).toISOString(),
    opened: false,
  },
  {
    id: "box3",
    rarity: "gold",
    earnedAt: new Date(Date.now() - 259200000).toISOString(),
    opened: true,
    reward: {
      type: "points",
      value: 250,
      label: "250 Points",
      rarity: "rare",
    },
  },
];

export function rollReward(rarity: BoxRarity): MysteryReward {
  const config = BOX_CONFIG[rarity];
  const totalWeight = config.rewards.reduce((sum, r) => sum + r.weight, 0);
  const roll = Math.random() * totalWeight;

  let cumulative = 0;
  for (const rewardDef of config.rewards) {
    cumulative += rewardDef.weight;
    if (roll <= cumulative) {
      switch (rewardDef.type) {
        case "points": {
          const pointRanges: Record<BoxRarity, [number, number]> = {
            bronze: [25, 50],
            silver: [50, 150],
            gold: [100, 500],
          };
          const [min, max] = pointRanges[rarity];
          const points = Math.floor(Math.random() * (max - min + 1)) + min;
          return {
            type: "points",
            value: points,
            label: `${points} Points`,
            rarity:
              rarity === "gold"
                ? "rare"
                : rarity === "silver"
                  ? "uncommon"
                  : "common",
          };
        }
        case "badge": {
          const badgeRarityMap: Record<BoxRarity, BadgeRarity> = {
            bronze: "common",
            silver: "uncommon",
            gold: "rare",
          };
          return {
            type: "badge",
            value: rewardDef.label,
            label: rewardDef.label,
            rarity: badgeRarityMap[rarity],
          };
        }
        case "multiplier": {
          const multiplierMap: Record<BoxRarity, number> = {
            bronze: 1.5,
            silver: 2,
            gold: 3,
          };
          return {
            type: "multiplier",
            value: multiplierMap[rarity],
            label: rewardDef.label,
            rarity: rarity === "gold" ? "rare" : "uncommon",
          };
        }
        case "shield": {
          const shieldCount = rarity === "gold" ? 2 : 1;
          return {
            type: "shield",
            value: shieldCount,
            label:
              shieldCount > 1
                ? `${shieldCount}x Streak Shields`
                : "Streak Shield",
            rarity: rarity === "gold" ? "rare" : "uncommon",
          };
        }
        default:
          break;
      }
    }
  }

  // Fallback to points
  return {
    type: "points",
    value: 25,
    label: "25 Points",
    rarity: "common",
  };
}
