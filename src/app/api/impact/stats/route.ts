import { NextResponse } from 'next/server';

export async function GET() {
  const stats = {
    totalReports: 12847,
    issuesResolved: 3421,
    activeCitizens: 1847,
    zonesCovered: 15,
    resolutionRate: 89,
    topCategories: [
      { name: "Road Damage", count: 3245, icon: "Construction" },
      { name: "Garbage Dumping", count: 2891, icon: "Trash2" },
      { name: "Drainage Issues", count: 2103, icon: "Droplet" },
      { name: "Parking Violations", count: 1876, icon: "ParkingCircle" },
      { name: "Street Lights", count: 1432, icon: "Lightbulb" },
      { name: "Encroachment", count: 1300, icon: "Ban" },
    ],
    recentMilestone: {
      title: "10,000 Reports Milestone",
      reachedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    weeklyTrend: [1234, 1456, 1289, 1567, 1345, 1678, 1890],
  };
  return NextResponse.json(stats);
}
