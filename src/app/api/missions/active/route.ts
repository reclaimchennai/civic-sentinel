import { NextResponse } from 'next/server';

export async function GET() {
  const missions = [
    {
      id: "m1",
      title: "Clean Streets Week",
      description: "Help Chennai achieve 500 street cleanliness reports this week",
      icon: "🧹",
      progress: 342,
      target: 500,
      participants: 89,
      endsAt: new Date(Date.now() + 2 * 86400000).toISOString(),
      reward: "2x Points + Clean City Badge"
    },
    {
      id: "m2",
      title: "Pothole Patrol",
      description: "Document 200 road damage issues across the city",
      icon: "🕳️",
      progress: 156,
      target: 200,
      participants: 45,
      endsAt: new Date(Date.now() + 4 * 86400000).toISOString(),
      reward: "500 Bonus Points + Road Warrior Badge"
    }
  ];
  return NextResponse.json(missions);
}
