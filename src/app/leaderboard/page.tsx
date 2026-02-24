"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Star, TrendingUp, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { motion } from "framer-motion";
import LeaderboardFilters from "@/components/LeaderboardFilters";
import ZoneMayorCard from "@/components/ZoneMayorCard";
import { CHENNAI_ZONES } from "@/lib/zones";
import { type TimeFrame, type LeaderboardScope } from "@/lib/rankings";

const leaderboardData: Record<TimeFrame, { rank: number; handle: string; points: number; zone: string; level: number; trend: "up" | "down" | "same" }[]> = {
  daily: [
    { rank: 1, handle: "@MylaporeMani", points: 180, zone: "Mylapore", level: 4, trend: "up" },
    { rank: 2, handle: "@ChennaiSuperUser", points: 150, zone: "T. Nagar", level: 5, trend: "down" },
    { rank: 3, handle: "@VelacheryVibe", points: 125, zone: "Velachery", level: 3, trend: "up" },
    { rank: 4, handle: "@AdyarWarrior", points: 100, zone: "Adyar", level: 4, trend: "same" },
    { rank: 5, handle: "@AnnaNagarAce", points: 85, zone: "Anna Nagar", level: 3, trend: "up" },
    { rank: 6, handle: "@TambaramTiger", points: 60, zone: "Tambaram", level: 2, trend: "down" },
    { rank: 7, handle: "@PorurPatrol", points: 45, zone: "Porur", level: 2, trend: "same" },
    { rank: 8, handle: "@ChromepetChamp", points: 30, zone: "Chromepet", level: 2, trend: "up" },
  ],
  weekly: [
    { rank: 1, handle: "@ChennaiSuperUser", points: 850, zone: "T. Nagar", level: 5, trend: "same" },
    { rank: 2, handle: "@AdyarWarrior", points: 720, zone: "Adyar", level: 4, trend: "up" },
    { rank: 3, handle: "@MylaporeMani", points: 680, zone: "Mylapore", level: 4, trend: "down" },
    { rank: 4, handle: "@AnnaNagarAce", points: 540, zone: "Anna Nagar", level: 3, trend: "up" },
    { rank: 5, handle: "@VelacheryVibe", points: 460, zone: "Velachery", level: 3, trend: "same" },
    { rank: 6, handle: "@TambaramTiger", points: 380, zone: "Tambaram", level: 2, trend: "up" },
    { rank: 7, handle: "@PorurPatrol", points: 310, zone: "Porur", level: 2, trend: "down" },
    { rank: 8, handle: "@ChromepetChamp", points: 250, zone: "Chromepet", level: 2, trend: "same" },
  ],
  monthly: [
    { rank: 1, handle: "@ChennaiSuperUser", points: 2800, zone: "T. Nagar", level: 5, trend: "same" },
    { rank: 2, handle: "@AdyarWarrior", points: 2400, zone: "Adyar", level: 4, trend: "same" },
    { rank: 3, handle: "@MylaporeMani", points: 2100, zone: "Mylapore", level: 4, trend: "up" },
    { rank: 4, handle: "@AnnaNagarAce", points: 1900, zone: "Anna Nagar", level: 3, trend: "same" },
    { rank: 5, handle: "@VelacheryVibe", points: 1600, zone: "Velachery", level: 3, trend: "up" },
    { rank: 6, handle: "@TambaramTiger", points: 1350, zone: "Tambaram", level: 2, trend: "up" },
    { rank: 7, handle: "@PorurPatrol", points: 1100, zone: "Porur", level: 2, trend: "down" },
    { rank: 8, handle: "@ChromepetChamp", points: 900, zone: "Chromepet", level: 2, trend: "same" },
  ],
  allTime: [
    { rank: 1, handle: "@ChennaiSuperUser", points: 4500, zone: "T. Nagar", level: 5, trend: "same" },
    { rank: 2, handle: "@AdyarWarrior", points: 3850, zone: "Adyar", level: 4, trend: "same" },
    { rank: 3, handle: "@MylaporeMani", points: 3200, zone: "Mylapore", level: 4, trend: "same" },
    { rank: 4, handle: "@AnnaNagarAce", points: 2900, zone: "Anna Nagar", level: 3, trend: "same" },
    { rank: 5, handle: "@VelacheryVibe", points: 2450, zone: "Velachery", level: 3, trend: "same" },
    { rank: 6, handle: "@TambaramTiger", points: 2100, zone: "Tambaram", level: 2, trend: "up" },
    { rank: 7, handle: "@PorurPatrol", points: 1800, zone: "Porur", level: 2, trend: "same" },
    { rank: 8, handle: "@ChromepetChamp", points: 1650, zone: "Chromepet", level: 2, trend: "down" },
  ],
};

const risingStars = [
  { handle: "@NewbieStar", zone: "T. Nagar", pointsGained: 450, period: "This Week" },
  { handle: "@QuickRiser", zone: "Adyar", pointsGained: 380, period: "This Week" },
  { handle: "@FreshFace", zone: "Velachery", pointsGained: 320, period: "This Week" },
];

const TrendIcon = ({ trend }: { trend: "up" | "down" | "same" }) => {
  if (trend === "up") return <ArrowUp className="w-3 h-3 text-green-400" />;
  if (trend === "down") return <ArrowDown className="w-3 h-3 text-red-400" />;
  return <Minus className="w-3 h-3 text-zinc-500" />;
};

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<TimeFrame>("allTime");
  const [scope, setScope] = useState<LeaderboardScope>("city");

  const currentData = leaderboardData[timeframe];
  const topUser = currentData[0];
  const featuredZone = CHENNAI_ZONES[0];

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-24 max-w-md mx-auto">
      <header className="py-8">
        <h1 className="text-2xl font-black tracking-tight uppercase italic">Leaderboard</h1>
        <p className="text-zinc-400 text-sm">Chennai&apos;s Civic Heroes.</p>
      </header>

      {/* Filters */}
      <LeaderboardFilters onFilterChange={(tf, sc) => { setTimeframe(tf); setScope(sc); }} />

      {/* Zone Mayor */}
      <section className="mb-6 mt-6">
        <ZoneMayorCard zone={featuredZone} />
      </section>

      {/* Top Contributors */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Top Contributors</h3>
        {currentData.map((user, i) => (
          <motion.div
            key={user.handle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
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
                <div className="flex items-center space-x-2">
                  <p className="font-bold text-zinc-100">{user.handle}</p>
                  <TrendIcon trend={user.trend} />
                </div>
                <p className="text-xs text-zinc-500">{user.zone} · Lvl {user.level}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-yellow-500">{user.points.toLocaleString()} pts</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Rising Stars */}
      <section className="mt-8">
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4 flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span>Rising Stars</span>
        </h3>
        <div className="space-y-3">
          {risingStars.map((star) => (
            <div key={star.handle} className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800/50 rounded-xl">
              <div>
                <p className="font-medium text-zinc-200 text-sm">{star.handle}</p>
                <p className="text-xs text-zinc-500">{star.zone}</p>
              </div>
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                +{star.pointsGained} pts
              </Badge>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
