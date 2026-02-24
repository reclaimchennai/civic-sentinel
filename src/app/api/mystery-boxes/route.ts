import { NextResponse } from 'next/server';

export async function GET() {
  const boxes = [
    { id: "box1", rarity: "bronze", earnedAt: new Date(Date.now() - 86400000).toISOString(), opened: false },
    { id: "box2", rarity: "silver", earnedAt: new Date(Date.now() - 172800000).toISOString(), opened: false },
    { id: "box3", rarity: "gold", earnedAt: new Date(Date.now() - 259200000).toISOString(), opened: true, reward: { type: "points", value: 250, label: "250 Points", rarity: "rare" } },
  ];
  return NextResponse.json(boxes);
}
