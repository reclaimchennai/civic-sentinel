"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Shield, Star, ChevronRight } from "lucide-react";
import GameIcon from "@/components/GameIcon";
import { motion } from "framer-motion";
import { MOCK_GUILDS } from "@/lib/guilds";
import Link from "next/link";

export default function GuildsPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 pb-24 max-w-md mx-auto">
      <header className="py-8 flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Shield className="w-6 h-6 text-yellow-500" />
            <h1 className="text-2xl font-black tracking-tight uppercase italic">Guilds</h1>
          </div>
          <p className="text-zinc-400 text-sm">Stronger together.</p>
        </div>
        <Button className="bg-white text-black hover:bg-zinc-200 font-bold text-sm">
          Create Guild
        </Button>
      </header>

      <div className="space-y-4">
        {MOCK_GUILDS.map((guild, i) => (
          <motion.div
            key={guild.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 * i }}
          >
            <Link href={`/guilds/${guild.id}`}>
              <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <GameIcon name={guild.icon} size="xl" variant="badge" color="yellow" />
                      <div>
                        <h3 className="font-bold text-zinc-100">{guild.name}</h3>
                        <p className="text-xs text-zinc-500 line-clamp-1">{guild.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-600 shrink-0 mt-1" />
                  </div>

                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center space-x-1 text-xs text-zinc-400">
                      <Users className="w-3 h-3" />
                      <span>{guild.memberCount}/{guild.maxMembers}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-zinc-400">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>Level {guild.level}</span>
                    </div>
                    <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700 text-[10px]">
                      {guild.zone}
                    </Badge>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {guild.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-zinc-800/50 text-zinc-500 border-zinc-700/50 text-[10px]"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Current challenge progress */}
                  {guild.currentChallenge && (
                    <div className="pt-3 border-t border-zinc-800">
                      <div className="flex justify-between text-xs text-zinc-500 mb-1">
                        <span>{guild.currentChallenge.title}</span>
                        <span>{guild.currentChallenge.progress}/{guild.currentChallenge.target}</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500 rounded-full transition-all"
                          style={{
                            width: `${(guild.currentChallenge.progress / guild.currentChallenge.target) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
