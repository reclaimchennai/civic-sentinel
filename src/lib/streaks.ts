export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  isAtRisk: boolean;
  streakShields: number;
  weeklyActivity: boolean[];
}

export const MOCK_STREAK: StreakData = {
  currentStreak: 7,
  longestStreak: 14,
  lastActiveDate: new Date().toISOString(),
  isAtRisk: false,
  streakShields: 2,
  weeklyActivity: [true, true, false, true, true, true, true],
};

export function getStreakStatus(streak: StreakData): {
  label: string;
  color: string;
  urgency: "safe" | "warning" | "danger";
} {
  if (streak.currentStreak === 0)
    return { label: "Start a streak!", color: "text-zinc-500", urgency: "safe" };
  if (streak.isAtRisk)
    return { label: "Streak at risk!", color: "text-red-400", urgency: "danger" };
  if (streak.currentStreak >= 30)
    return { label: "On fire!", color: "text-orange-400", urgency: "safe" };
  if (streak.currentStreak >= 7)
    return { label: "Great streak!", color: "text-yellow-400", urgency: "safe" };
  return { label: "Building momentum", color: "text-blue-400", urgency: "safe" };
}

export function getStreakMultiplier(streak: number): number {
  if (streak >= 30) return 2.0;
  if (streak >= 14) return 1.5;
  if (streak >= 7) return 1.25;
  if (streak >= 3) return 1.1;
  return 1.0;
}
