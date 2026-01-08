"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Star } from 'lucide-react';

const topUsers = [
  { id: 1, handle: '@ChennaiSuperUser', points: 4500, zone: 'T. Nagar', rank: 1 },
  { id: 2, handle: '@AdyarWarrior', points: 3850, zone: 'Adyar', rank: 2 },
  { id: 3, handle: '@MylaporeMani', points: 3200, zone: 'Mylapore', rank: 3 },
  { id: 4, handle: '@AnnaNagarAce', points: 2900, zone: 'Anna Nagar', rank: 4 },
  { id: 5, handle: '@VelacheryVibe', points: 2450, zone: 'Velachery', rank: 5 },
];

export default function LeaderboardPage() {
  const currentZone = "T. Nagar";

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-24 max-w-md mx-auto">
      <header className="py-8">
        <h1 className="text-2xl font-black tracking-tight uppercase italic">Leaderboard</h1>
        <p className="text-zinc-400 text-sm">Chennai's Civic Heroes.</p>
      </header>

      <section className="mb-8">
        <Card className="bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trophy className="w-24 h-24" />
          </div>
          <CardContent className="p-6">
            <Badge className="bg-yellow-500 text-black font-bold mb-2">MAYOR OF {currentZone.toUpperCase()}</Badge>
            <h2 className="text-3xl font-black italic">@ChennaiSuperUser</h2>
            <p className="text-zinc-400 mt-2">🪙 4,500 Total Points Earned</p>
          </CardContent>
        </Card>
      </section>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Top Contributors</h3>
        {topUsers.map((user) => (
          <div 
            key={user.id} 
            className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl"
          >
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 flex items-center justify-center font-bold text-zinc-500">
                {user.rank === 1 ? <Trophy className="w-5 h-5 text-yellow-500" /> : 
                 user.rank === 2 ? <Medal className="w-5 h-5 text-zinc-400" /> :
                 user.rank === 3 ? <Medal className="w-5 h-5 text-orange-600" /> :
                 user.rank}
              </div>
              <div>
                <p className="font-bold text-zinc-100">{user.handle}</p>
                <p className="text-xs text-zinc-500">{user.zone}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">🪙 {user.points.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
