export type TimeFrame = "daily" | "weekly" | "monthly" | "allTime";
export type LeaderboardScope = "city" | "zone";

export interface LeaderboardEntry {
  rank: number;
  handle: string;
  points: number;
  zone: string;
  level: number;
  reportsThisPeriod: number;
  trend: "up" | "down" | "same";
  avatar?: string;
}

export interface RisingStarEntry {
  handle: string;
  zone: string;
  pointsGained: number;
  period: string;
}

export const MOCK_LEADERBOARD: Record<TimeFrame, LeaderboardEntry[]> = {
  daily: [
    { rank: 1, handle: "@MylaporeMani", points: 180, zone: "Mylapore", level: 4, reportsThisPeriod: 6, trend: "up" },
    { rank: 2, handle: "@AnnaNagarAce", points: 155, zone: "Anna Nagar", level: 4, reportsThisPeriod: 5, trend: "up" },
    { rank: 3, handle: "@ChennaiSuperUser", points: 140, zone: "T. Nagar", level: 5, reportsThisPeriod: 4, trend: "down" },
    { rank: 4, handle: "@VelacheryVibe", points: 120, zone: "Velachery", level: 3, reportsThisPeriod: 4, trend: "up" },
    { rank: 5, handle: "@AdyarWarrior", points: 95, zone: "Adyar", level: 4, reportsThisPeriod: 3, trend: "down" },
    { rank: 6, handle: "@TambaramTiger", points: 80, zone: "Tambaram", level: 3, reportsThisPeriod: 3, trend: "same" },
    { rank: 7, handle: "@PorurPatrol", points: 65, zone: "Porur", level: 2, reportsThisPeriod: 2, trend: "up" },
    { rank: 8, handle: "@ChromepetChamp", points: 50, zone: "Chromepet", level: 2, reportsThisPeriod: 2, trend: "same" },
  ],
  weekly: [
    { rank: 1, handle: "@ChennaiSuperUser", points: 820, zone: "T. Nagar", level: 5, reportsThisPeriod: 22, trend: "same" },
    { rank: 2, handle: "@AdyarWarrior", points: 710, zone: "Adyar", level: 4, reportsThisPeriod: 19, trend: "up" },
    { rank: 3, handle: "@MylaporeMani", points: 650, zone: "Mylapore", level: 4, reportsThisPeriod: 17, trend: "up" },
    { rank: 4, handle: "@AnnaNagarAce", points: 580, zone: "Anna Nagar", level: 4, reportsThisPeriod: 15, trend: "down" },
    { rank: 5, handle: "@VelacheryVibe", points: 490, zone: "Velachery", level: 3, reportsThisPeriod: 13, trend: "up" },
    { rank: 6, handle: "@TambaramTiger", points: 420, zone: "Tambaram", level: 3, reportsThisPeriod: 11, trend: "same" },
    { rank: 7, handle: "@KilpaukKing", points: 380, zone: "Kilpauk", level: 3, reportsThisPeriod: 10, trend: "up" },
    { rank: 8, handle: "@PorurPatrol", points: 310, zone: "Porur", level: 2, reportsThisPeriod: 8, trend: "down" },
  ],
  monthly: [
    { rank: 1, handle: "@ChennaiSuperUser", points: 3200, zone: "T. Nagar", level: 5, reportsThisPeriod: 89, trend: "same" },
    { rank: 2, handle: "@AdyarWarrior", points: 2850, zone: "Adyar", level: 4, reportsThisPeriod: 72, trend: "same" },
    { rank: 3, handle: "@MylaporeMani", points: 2400, zone: "Mylapore", level: 4, reportsThisPeriod: 61, trend: "up" },
    { rank: 4, handle: "@AnnaNagarAce", points: 2100, zone: "Anna Nagar", level: 4, reportsThisPeriod: 55, trend: "down" },
    { rank: 5, handle: "@VelacheryVibe", points: 1800, zone: "Velachery", level: 3, reportsThisPeriod: 48, trend: "up" },
    { rank: 6, handle: "@TambaramTiger", points: 1550, zone: "Tambaram", level: 3, reportsThisPeriod: 42, trend: "same" },
    { rank: 7, handle: "@PorurPatrol", points: 1300, zone: "Porur", level: 2, reportsThisPeriod: 35, trend: "up" },
    { rank: 8, handle: "@ChromepetChamp", points: 1100, zone: "Chromepet", level: 2, reportsThisPeriod: 31, trend: "down" },
  ],
  allTime: [
    { rank: 1, handle: "@ChennaiSuperUser", points: 4500, zone: "T. Nagar", level: 5, reportsThisPeriod: 342, trend: "same" },
    { rank: 2, handle: "@AdyarWarrior", points: 3850, zone: "Adyar", level: 4, reportsThisPeriod: 289, trend: "same" },
    { rank: 3, handle: "@MylaporeMani", points: 3200, zone: "Mylapore", level: 4, reportsThisPeriod: 256, trend: "same" },
    { rank: 4, handle: "@AnnaNagarAce", points: 2900, zone: "Anna Nagar", level: 4, reportsThisPeriod: 231, trend: "same" },
    { rank: 5, handle: "@VelacheryVibe", points: 2450, zone: "Velachery", level: 3, reportsThisPeriod: 198, trend: "same" },
    { rank: 6, handle: "@TambaramTiger", points: 2100, zone: "Tambaram", level: 3, reportsThisPeriod: 176, trend: "same" },
    { rank: 7, handle: "@PorurPatrol", points: 1800, zone: "Porur", level: 2, reportsThisPeriod: 154, trend: "same" },
    { rank: 8, handle: "@ChromepetChamp", points: 1650, zone: "Chromepet", level: 2, reportsThisPeriod: 132, trend: "same" },
  ],
};

export const MOCK_RISING_STARS: RisingStarEntry[] = [
  { handle: "@NewbieStar", zone: "T. Nagar", pointsGained: 450, period: "This Week" },
  { handle: "@QuickRiser", zone: "Adyar", pointsGained: 380, period: "This Week" },
  { handle: "@FreshFace", zone: "Velachery", pointsGained: 320, period: "This Week" },
];
