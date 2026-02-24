export interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  threshold: number;
  type: "reports" | "points" | "streak" | "endorsements" | "zones";
  reward: number;
  badgeName?: string;
  celebrated: boolean;
}

export const MILESTONES: Milestone[] = [
  {
    id: "m1",
    title: "First Steps",
    description: "Submit your first report",
    icon: "👣",
    threshold: 1,
    type: "reports",
    reward: 50,
    badgeName: "Rookie Sentinel",
    celebrated: true,
  },
  {
    id: "m2",
    title: "Getting Serious",
    description: "Submit 10 reports",
    icon: "💪",
    threshold: 10,
    type: "reports",
    reward: 100,
    badgeName: "Dedicated Reporter",
    celebrated: true,
  },
  {
    id: "m3",
    title: "Centurion",
    description: "Submit 100 reports",
    icon: "🏛️",
    threshold: 100,
    type: "reports",
    reward: 500,
    badgeName: "Centurion",
    celebrated: false,
  },
  {
    id: "m4",
    title: "Point Collector",
    description: "Earn 1,000 points",
    icon: "💰",
    threshold: 1000,
    type: "points",
    reward: 200,
    celebrated: false,
  },
  {
    id: "m5",
    title: "Streak Master",
    description: "Maintain a 30-day streak",
    icon: "🔥",
    threshold: 30,
    type: "streak",
    reward: 300,
    badgeName: "Streak Master",
    celebrated: false,
  },
  {
    id: "m6",
    title: "Community Voice",
    description: "Receive 50 endorsements",
    icon: "📢",
    threshold: 50,
    type: "endorsements",
    reward: 250,
    celebrated: false,
  },
  {
    id: "m7",
    title: "City Explorer",
    description: "Report in all 15 zones",
    icon: "🗺️",
    threshold: 15,
    type: "zones",
    reward: 500,
    badgeName: "Chennai Explorer",
    celebrated: false,
  },
  {
    id: "m8",
    title: "Legend Status",
    description: "Earn 10,000 points",
    icon: "🔱",
    threshold: 10000,
    type: "points",
    reward: 1000,
    badgeName: "Chennai Legend",
    celebrated: false,
  },
];
