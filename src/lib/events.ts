export interface GameEvent {
  id: string;
  title: string;
  description: string;
  icon: string;
  startDate: string;
  endDate: string;
  multiplier: number;
  targetReports: number;
  currentReports: number;
  rewards: { threshold: number; reward: string }[];
  isActive: boolean;
}

export const MOCK_EVENTS: GameEvent[] = [
  {
    id: "ev1",
    title: "Monsoon Watch",
    description:
      "Chennai monsoon season is here! Report drainage issues, waterlogging, and flood hazards to help the city prepare. All drainage-related reports earn bonus points.",
    icon: "🌧️",
    startDate: new Date(Date.now() - 7 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    multiplier: 2.0,
    targetReports: 500,
    currentReports: 347,
    rewards: [
      { threshold: 100, reward: "Community Bronze Badge" },
      { threshold: 250, reward: "Monsoon Warrior Badge" },
      { threshold: 500, reward: "Legendary Flood Fighter Badge + 1000 Points" },
    ],
    isActive: true,
  },
  {
    id: "ev2",
    title: "Republic Day Cleanup",
    description:
      "Celebrate Republic Day by keeping Chennai clean! Report sanitation violations, illegal dumping, and public space encroachments. Special 3x multiplier on all sanitation reports.",
    icon: "🇮🇳",
    startDate: new Date(Date.now() + 10 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 17 * 86400000).toISOString(),
    multiplier: 3.0,
    targetReports: 750,
    currentReports: 0,
    rewards: [
      { threshold: 150, reward: "Patriot Reporter Badge" },
      { threshold: 400, reward: "Clean Chennai Champion Badge" },
      { threshold: 750, reward: "Republic Hero Badge + 2000 Points" },
    ],
    isActive: false,
  },
];
