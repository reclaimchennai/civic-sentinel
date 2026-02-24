export interface HiddenAchievement {
  id: string;
  title: string;
  hint: string;
  description: string;
  icon: string;
  condition: string;
  reward: number;
  unlocked: boolean;
}

export const HIDDEN_ACHIEVEMENTS: HiddenAchievement[] = [
  {
    id: "h1",
    title: "Night Owl",
    hint: "The city never sleeps...",
    description: "Submit a report between midnight and 5 AM",
    icon: "Bird",
    condition: "report_time_0_5",
    reward: 100,
    unlocked: true,
  },
  {
    id: "h2",
    title: "Speed Demon",
    hint: "Lightning fast...",
    description: "Submit 3 reports within 10 minutes",
    icon: "Zap",
    condition: "3_reports_10min",
    reward: 150,
    unlocked: false,
  },
  {
    id: "h3",
    title: "The Perfectionist",
    hint: "Every detail matters...",
    description:
      "Submit a report with photo, notes, severity, and recurring flag",
    icon: "Gem",
    condition: "full_detail_report",
    reward: 200,
    unlocked: false,
  },
  {
    id: "h4",
    title: "Wanderer",
    hint: "Not all who wander are lost...",
    description: "Report in 5 different zones in a single day",
    icon: "Compass",
    condition: "5_zones_1_day",
    reward: 300,
    unlocked: false,
  },
  {
    id: "h5",
    title: "The Founder",
    hint: "From the very beginning...",
    description: "Be among the first 100 users to sign up",
    icon: "Flag",
    condition: "first_100_users",
    reward: 500,
    unlocked: false,
  },
  {
    id: "h6",
    title: "Weekend Warrior",
    hint: "While others rest...",
    description: "Submit reports every weekend for a month",
    icon: "Swords",
    condition: "4_weekends_active",
    reward: 250,
    unlocked: false,
  },
];
