import { NextResponse } from 'next/server';

export async function GET() {
  const events = [
    {
      id: "ev1",
      title: "Monsoon Readiness Drive",
      description: "Help prepare Chennai for monsoon season by reporting drainage issues",
      icon: "CloudRain",
      startDate: new Date(Date.now() - 3 * 86400000).toISOString(),
      endDate: new Date(Date.now() + 3 * 86400000).toISOString(),
      multiplier: 2,
      targetReports: 1000,
      currentReports: 634,
      rewards: [
        { threshold: 250, reward: "Monsoon Scout Badge" },
        { threshold: 500, reward: "2x Point Multiplier (24hr)" },
        { threshold: 1000, reward: "Monsoon Warrior Badge + 500 Points" }
      ],
      isActive: true
    }
  ];
  return NextResponse.json(events);
}
