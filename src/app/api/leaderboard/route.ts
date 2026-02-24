import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const timeframe = searchParams.get('timeframe') || 'allTime';
  const scope = searchParams.get('scope') || 'city';

  const allTimeEntries = [
    { rank: 1, handle: "@ChennaiSuperUser", points: 4500, reports: 156, zone: "T. Nagar", badge: "Mayor", avatar: "/avatars/default.png" },
    { rank: 2, handle: "@AdyarWarrior", points: 3850, reports: 132, zone: "Adyar", badge: "Zone Hero", avatar: "/avatars/default.png" },
    { rank: 3, handle: "@MylaporeMani", points: 3200, reports: 118, zone: "Mylapore", badge: "Heritage Guardian", avatar: "/avatars/default.png" },
    { rank: 4, handle: "@AnnaNagarAnand", points: 2900, reports: 104, zone: "Anna Nagar", badge: "Road Warrior", avatar: "/avatars/default.png" },
    { rank: 5, handle: "@VelacheryVijay", points: 2450, reports: 89, zone: "Velachery", badge: "Flood Fighter", avatar: "/avatars/default.png" },
    { rank: 6, handle: "@TambramTiger", points: 2100, reports: 76, zone: "Tambaram", badge: "Night Owl", avatar: "/avatars/default.png" },
    { rank: 7, handle: "@ShozhaganStar", points: 1800, reports: 64, zone: "Sholinganallur", badge: "Rookie Sentinel", avatar: "/avatars/default.png" },
    { rank: 8, handle: "@KodamPatrol", points: 1550, reports: 52, zone: "Kodambakkam", badge: "Pothole Paladin", avatar: "/avatars/default.png" },
  ];

  const weeklyEntries = [
    { rank: 1, handle: "@AdyarWarrior", points: 620, reports: 22, zone: "Adyar", badge: "Zone Hero", avatar: "/avatars/default.png" },
    { rank: 2, handle: "@ChennaiSuperUser", points: 580, reports: 19, zone: "T. Nagar", badge: "Mayor", avatar: "/avatars/default.png" },
    { rank: 3, handle: "@VelacheryVijay", points: 490, reports: 17, zone: "Velachery", badge: "Flood Fighter", avatar: "/avatars/default.png" },
    { rank: 4, handle: "@NewbieStar", points: 450, reports: 16, zone: "T. Nagar", badge: "Rising Star", avatar: "/avatars/default.png" },
    { rank: 5, handle: "@MylaporeMani", points: 410, reports: 14, zone: "Mylapore", badge: "Heritage Guardian", avatar: "/avatars/default.png" },
    { rank: 6, handle: "@QuickRiser", points: 380, reports: 13, zone: "Adyar", badge: "Rookie Sentinel", avatar: "/avatars/default.png" },
    { rank: 7, handle: "@AnnaNagarAnand", points: 340, reports: 12, zone: "Anna Nagar", badge: "Road Warrior", avatar: "/avatars/default.png" },
    { rank: 8, handle: "@FreshFace", points: 320, reports: 11, zone: "Velachery", badge: "Rookie Sentinel", avatar: "/avatars/default.png" },
  ];

  const monthlyEntries = [
    { rank: 1, handle: "@ChennaiSuperUser", points: 1850, reports: 62, zone: "T. Nagar", badge: "Mayor", avatar: "/avatars/default.png" },
    { rank: 2, handle: "@AdyarWarrior", points: 1720, reports: 58, zone: "Adyar", badge: "Zone Hero", avatar: "/avatars/default.png" },
    { rank: 3, handle: "@MylaporeMani", points: 1480, reports: 49, zone: "Mylapore", badge: "Heritage Guardian", avatar: "/avatars/default.png" },
    { rank: 4, handle: "@VelacheryVijay", points: 1320, reports: 44, zone: "Velachery", badge: "Flood Fighter", avatar: "/avatars/default.png" },
    { rank: 5, handle: "@AnnaNagarAnand", points: 1150, reports: 38, zone: "Anna Nagar", badge: "Road Warrior", avatar: "/avatars/default.png" },
    { rank: 6, handle: "@NewbieStar", points: 980, reports: 33, zone: "T. Nagar", badge: "Rising Star", avatar: "/avatars/default.png" },
    { rank: 7, handle: "@TambramTiger", points: 870, reports: 29, zone: "Tambaram", badge: "Night Owl", avatar: "/avatars/default.png" },
    { rank: 8, handle: "@ShozhaganStar", points: 760, reports: 25, zone: "Sholinganallur", badge: "Rookie Sentinel", avatar: "/avatars/default.png" },
  ];

  const dailyEntries = [
    { rank: 1, handle: "@VelacheryVijay", points: 120, reports: 5, zone: "Velachery", badge: "Flood Fighter", avatar: "/avatars/default.png" },
    { rank: 2, handle: "@AdyarWarrior", points: 105, reports: 4, zone: "Adyar", badge: "Zone Hero", avatar: "/avatars/default.png" },
    { rank: 3, handle: "@NewbieStar", points: 95, reports: 4, zone: "T. Nagar", badge: "Rising Star", avatar: "/avatars/default.png" },
    { rank: 4, handle: "@ChennaiSuperUser", points: 80, reports: 3, zone: "T. Nagar", badge: "Mayor", avatar: "/avatars/default.png" },
    { rank: 5, handle: "@MylaporeMani", points: 70, reports: 3, zone: "Mylapore", badge: "Heritage Guardian", avatar: "/avatars/default.png" },
    { rank: 6, handle: "@QuickRiser", points: 60, reports: 2, zone: "Adyar", badge: "Rookie Sentinel", avatar: "/avatars/default.png" },
    { rank: 7, handle: "@KodamPatrol", points: 45, reports: 2, zone: "Kodambakkam", badge: "Pothole Paladin", avatar: "/avatars/default.png" },
    { rank: 8, handle: "@FreshFace", points: 35, reports: 1, zone: "Velachery", badge: "Rookie Sentinel", avatar: "/avatars/default.png" },
  ];

  const entriesMap: Record<string, typeof allTimeEntries> = {
    allTime: allTimeEntries,
    weekly: weeklyEntries,
    monthly: monthlyEntries,
    daily: dailyEntries,
  };

  const entries = entriesMap[timeframe] || allTimeEntries;

  const data = {
    entries,
    risingStars: [
      { handle: "@NewbieStar", zone: "T. Nagar", pointsGained: 450, period: "This Week" },
      { handle: "@QuickRiser", zone: "Adyar", pointsGained: 380, period: "This Week" },
      { handle: "@FreshFace", zone: "Velachery", pointsGained: 320, period: "This Week" },
    ],
  };

  return NextResponse.json(data);
}
