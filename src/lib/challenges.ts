export type ChallengeType = "daily" | "weekly" | "seasonal";
export type ChallengeStatus = "active" | "completed" | "claimed" | "expired";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  target: number;
  progress: number;
  reward: number;
  bonusReward?: string;
  expiresAt: string;
  status: ChallengeStatus;
  icon: string;
}

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: "d1",
    title: "Early Bird",
    description: "Submit a report before 8 AM",
    type: "daily",
    target: 1,
    progress: 0,
    reward: 50,
    expiresAt: new Date(Date.now() + 8 * 3600000).toISOString(),
    status: "active",
    icon: "Sunrise",
  },
  {
    id: "d2",
    title: "Double Trouble",
    description: "Report 2 different violation types",
    type: "daily",
    target: 2,
    progress: 1,
    reward: 75,
    expiresAt: new Date(Date.now() + 8 * 3600000).toISOString(),
    status: "active",
    icon: "CheckCheck",
  },
  {
    id: "d3",
    title: "Zone Explorer",
    description: "File a report in a new zone",
    type: "daily",
    target: 1,
    progress: 1,
    reward: 60,
    expiresAt: new Date(Date.now() + 8 * 3600000).toISOString(),
    status: "completed",
    icon: "Map",
  },
  {
    id: "w1",
    title: "Chennai Sweep",
    description: "File reports in 3 different zones",
    type: "weekly",
    target: 3,
    progress: 2,
    reward: 200,
    bonusReward: "Zone Explorer Badge",
    expiresAt: new Date(Date.now() + 5 * 86400000).toISOString(),
    status: "active",
    icon: "Brush",
  },
  {
    id: "w2",
    title: "Pothole Hunter",
    description: "Report 5 road-related violations",
    type: "weekly",
    target: 5,
    progress: 3,
    reward: 250,
    expiresAt: new Date(Date.now() + 5 * 86400000).toISOString(),
    status: "active",
    icon: "CircleAlert",
  },
  {
    id: "w3",
    title: "Community Pillar",
    description: "Get 10 endorsements on your reports",
    type: "weekly",
    target: 10,
    progress: 4,
    reward: 300,
    bonusReward: "Community Star Badge",
    expiresAt: new Date(Date.now() + 5 * 86400000).toISOString(),
    status: "active",
    icon: "Handshake",
  },
  {
    id: "s1",
    title: "Monsoon Watch",
    description: "Report 15 drainage/flooding issues this season",
    type: "seasonal",
    target: 15,
    progress: 7,
    reward: 1000,
    bonusReward: "Monsoon Warrior Badge",
    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    status: "active",
    icon: "CloudRain",
  },
];
