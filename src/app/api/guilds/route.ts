import { NextResponse } from 'next/server';

export async function GET() {
  const guilds = [
    {
      id: "g1",
      name: "T. Nagar Tigers",
      description: "Keeping T. Nagar clean and safe since 2024",
      icon: "🐯",
      memberCount: 24,
      maxMembers: 30,
      totalPoints: 45200,
      level: 5,
      zone: "T. Nagar",
      tags: ["Active", "Top Ranked"],
      currentChallenge: { title: "Report 50 violations this week", progress: 38, target: 50 }
    },
    {
      id: "g2",
      name: "Adyar Avengers",
      description: "Defending Adyar's streets one report at a time",
      icon: "⚡",
      memberCount: 18,
      maxMembers: 25,
      totalPoints: 32100,
      level: 4,
      zone: "Adyar",
      tags: ["Competitive", "Rising"],
      currentChallenge: { title: "Cover all Adyar wards", progress: 7, target: 12 }
    },
    {
      id: "g3",
      name: "Mylapore Monitors",
      description: "Heritage area guardians preserving Mylapore",
      icon: "🏛️",
      memberCount: 15,
      maxMembers: 20,
      totalPoints: 28500,
      level: 3,
      zone: "Mylapore",
      tags: ["Heritage Focus"],
      currentChallenge: { title: "Document 30 encroachment issues", progress: 22, target: 30 }
    },
    {
      id: "g4",
      name: "Anna Nagar Alliance",
      description: "United for better infrastructure in Anna Nagar",
      icon: "🤝",
      memberCount: 21,
      maxMembers: 30,
      totalPoints: 38900,
      level: 4,
      zone: "Anna Nagar",
      tags: ["Friendly", "Active"],
      currentChallenge: { title: "Report 40 streetlight issues", progress: 15, target: 40 }
    },
    {
      id: "g5",
      name: "Velachery Vigilantes",
      description: "Fighting flooding and civic issues in Velachery",
      icon: "🛡️",
      memberCount: 12,
      maxMembers: 20,
      totalPoints: 19800,
      level: 2,
      zone: "Velachery",
      tags: ["New", "Drainage Focus"],
      currentChallenge: { title: "Map all drainage blocks", progress: 8, target: 25 }
    }
  ];
  return NextResponse.json(guilds);
}
