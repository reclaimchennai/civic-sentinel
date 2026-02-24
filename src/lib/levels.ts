export interface Level {
  tier: number;
  name: string;
  minPoints: number;
  maxPoints: number;
  icon: string;
  color: string;
}

export const LEVELS: Level[] = [
  { tier: 1, name: "Rookie Sentinel", minPoints: 0, maxPoints: 99, icon: "🛡️", color: "text-zinc-400" },
  { tier: 2, name: "Street Guardian", minPoints: 100, maxPoints: 499, icon: "⚔️", color: "text-blue-400" },
  { tier: 3, name: "Ward Protector", minPoints: 500, maxPoints: 1499, icon: "🏛️", color: "text-green-400" },
  { tier: 4, name: "Zone Commander", minPoints: 1500, maxPoints: 3999, icon: "👑", color: "text-purple-400" },
  { tier: 5, name: "City Champion", minPoints: 4000, maxPoints: 9999, icon: "🌟", color: "text-yellow-400" },
  { tier: 6, name: "Chennai Legend", minPoints: 10000, maxPoints: Infinity, icon: "🔱", color: "text-red-400" },
];

export function getLevelFromPoints(points: number): Level {
  return LEVELS.findLast((l) => points >= l.minPoints) || LEVELS[0];
}

export function getProgressToNextLevel(points: number): {
  current: number;
  required: number;
  percentage: number;
} {
  const level = getLevelFromPoints(points);
  const nextLevel = LEVELS.find((l) => l.tier === level.tier + 1);
  if (!nextLevel)
    return { current: points - level.minPoints, required: 1, percentage: 100 };
  const current = points - level.minPoints;
  const required = nextLevel.minPoints - level.minPoints;
  return {
    current,
    required,
    percentage: Math.min((current / required) * 100, 100),
  };
}
