"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, MapPin, Award, Star, Flame, BarChart3, Palette, ChevronRight, Users } from 'lucide-react';
import GameIcon from "@/components/GameIcon";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import LevelProgressBar from "@/components/LevelProgressBar";
import StreakDisplay from "@/components/StreakDisplay";
import { getLevelFromPoints } from "@/lib/levels";

type UserStats = {
  name: string | null;
  email: string | null;
  level: number;
  points: number;
  nextLevelPoints: number;
  reports: number;
  approved: number;
  badges: Array<{ name: string; image: string }>;
  mayorship: string;
  bio: string;
  joinedAt: string;
  streak: {
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string;
    isAtRisk: boolean;
    streakShields: number;
    weeklyActivity: boolean[];
  };
  title: string;
  activeChallenges: number;
  guildName: string | null;
  endorsements: number;
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => setUserStats(data));
    }
  }, [status, router]);

  if (status === "loading" || !userStats) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">Loading...</div>;
  }

  const level = getLevelFromPoints(userStats.points);

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-24 max-w-md mx-auto">
      <header className="mb-8 flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <Avatar className="w-24 h-24 border-4 border-zinc-900 ring-2 ring-yellow-500">
            <AvatarImage src={session?.user?.image || ''} />
            <AvatarFallback className="bg-zinc-800 text-2xl font-bold">
              {session?.user?.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full border-2 border-black flex items-center gap-0.5">
            <GameIcon name={level.icon} size="xs" variant="plain" color="text-black" />
            {level.tier}
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{session?.user?.name}</h1>
          <p className={`text-sm font-medium ${level.color}`}>{userStats.title || level.name}</p>
        </div>
        {userStats.guildName && (
          <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
            <Users className="w-3 h-3 mr-1" />
            {userStats.guildName}
          </Badge>
        )}
      </header>

      <div className="space-y-6">
        {/* Streak Display */}
        {userStats.streak && (
          <StreakDisplay streak={userStats.streak} />
        )}

        {/* Level Progress */}
        <LevelProgressBar points={userStats.points} />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-zinc-900 border-zinc-800 flex flex-col items-center justify-center p-4">
            <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
            <span className="text-2xl font-bold">{userStats.reports}</span>
            <span className="text-xs text-zinc-500 uppercase tracking-widest">Reports</span>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800 flex flex-col items-center justify-center p-4">
            <Star className="w-8 h-8 text-green-500 mb-2" />
            <span className="text-2xl font-bold">{userStats.approved}</span>
            <span className="text-xs text-zinc-500 uppercase tracking-widest">Approved</span>
          </Card>
        </div>

        {/* Mayorship */}
        {userStats.mayorship !== 'None' && (
          <Card className="bg-gradient-to-br from-indigo-900 to-zinc-900 border-indigo-500/30">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-500/20 rounded-full">
                  <MapPin className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-indigo-300 font-bold uppercase">Current Mayor of</p>
                  <h3 className="text-xl font-bold text-white">{userStats.mayorship}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <div className="space-y-2">
          <Link href="/profile/stats" className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <span className="font-medium">Your Stats</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </Link>
          <Link href="/profile/customize" className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors">
            <div className="flex items-center space-x-3">
              <Palette className="w-5 h-5 text-purple-400" />
              <span className="font-medium">Customize Profile</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </Link>
        </div>

        {/* Badges */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Badges</h3>
          <div className="flex flex-wrap gap-4">
            {userStats.badges.map((badge) => (
              <div key={badge.name} className="flex flex-col items-center space-y-1">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 p-2 flex items-center justify-center hover:border-zinc-500 transition-all cursor-help" title={badge.name}>
                  <img src={badge.image} alt={badge.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
