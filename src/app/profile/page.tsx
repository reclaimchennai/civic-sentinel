"use client";

import React from 'react';
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, MapPin, Award, Star } from 'lucide-react';
import { redirect } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    redirect("/login");
  }

  if (status === "loading") {
    return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">Loading...</div>;
  }

  // Mock User Stats
  const userStats = {
    level: 5,
    points: 450,
    nextLevelPoints: 1000,
    reports: 12,
    approved: 10,
    badges: ['Early Adopter', 'Pothole Patrol', 'Night Owl'],
    mayorship: 'T. Nagar'
  };

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
          <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full border-2 border-black">
            Lvl {userStats.level}
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{session?.user?.name}</h1>
          <p className="text-zinc-500 text-sm">Civic Guardian</p>
        </div>
      </header>

      <div className="space-y-6">
        {/* Points & Progress */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Experience</span>
              <span className="font-bold text-yellow-500">{userStats.points} / {userStats.nextLevelPoints} XP</span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={(userStats.points / userStats.nextLevelPoints) * 100} className="h-2 bg-zinc-800" />
            <p className="text-xs text-zinc-500 mt-2 text-center">550 XP to Level {userStats.level + 1}</p>
          </CardContent>
        </Card>

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

        {/* Badges */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Badges</h3>
          <div className="flex flex-wrap gap-2">
            {userStats.badges.map(badge => (
              <Badge key={badge} variant="outline" className="border-zinc-700 bg-zinc-900/50 py-2 px-3">
                <Award className="w-3 h-3 mr-2 text-yellow-500" />
                {badge}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
