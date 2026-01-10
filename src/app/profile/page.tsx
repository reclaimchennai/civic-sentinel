"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, MapPin, Award, Star } from 'lucide-react';
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userStats, setUserStats] = useState<any>(null);

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
            <XPProgressBar current={userStats.points} total={userStats.nextLevelPoints} />
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
          <div className="flex flex-wrap gap-4">
            {userStats.badges.map((badge: any) => (
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

function XPProgressBar({ current, total }: { current: number, total: number }) {
  const percentage = Math.min((current / total) * 100, 100);
  
  return (
    <div className="relative w-full h-4 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
      {/* Background Pulse Glow */}
      <motion.div 
        className="absolute inset-0 bg-[#FFD700]/20 blur-md"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* The Bar Itself */}
      <motion.div 
        className="h-full bg-[#FFD700] relative overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Shine Effect */}
        <motion.div 
          className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg]"
          animate={{ left: ["-100%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Sparks */}
        <div className="absolute inset-0 w-full h-full">
           {[...Array(5)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute w-1 h-1 bg-yellow-100 rounded-full"
               initial={{ y: 16, x: Math.random() * 100 + "%", opacity: 0 }}
               animate={{ y: -10, opacity: [0, 1, 0] }}
               transition={{ 
                 duration: 0.8 + Math.random() * 0.5, 
                 repeat: Infinity, 
                 delay: Math.random() * 2,
                 ease: "easeOut" 
               }}
             />
           ))}
        </div>
      </motion.div>
    </div>
  );
}
