"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChallengeCard from "@/components/ChallengeCard";
import { MOCK_CHALLENGES, type Challenge } from "@/lib/challenges";
import { Swords, Gift } from "lucide-react";

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
  const userPoints = 450;

  const handleClaim = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "claimed" as const } : c))
    );
    alert("Reward claimed!");
  };

  const daily = challenges.filter((c) => c.type === "daily");
  const weekly = challenges.filter((c) => c.type === "weekly");
  const seasonal = challenges.filter((c) => c.type === "seasonal");

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-24 max-w-md mx-auto">
      <header className="py-8 flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Swords className="w-6 h-6 text-yellow-500" />
            <h1 className="text-2xl font-black tracking-tight uppercase italic">Challenges</h1>
          </div>
          <p className="text-zinc-400 text-sm">Complete tasks, earn rewards.</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-2xl flex items-center space-x-2">
          <Gift className="w-4 h-4 text-yellow-500" />
          <span className="text-lg font-bold">{userPoints}</span>
        </div>
      </header>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-zinc-900 border-zinc-800 mb-6">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          {daily.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} onClaim={handleClaim} />
          ))}
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          {weekly.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} onClaim={handleClaim} />
          ))}
        </TabsContent>

        <TabsContent value="seasonal" className="space-y-4">
          {seasonal.length > 0 ? (
            seasonal.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} onClaim={handleClaim} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-zinc-500 text-sm">No seasonal challenges right now.</p>
              <p className="text-zinc-600 text-xs mt-1">Check back during the next season!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
