"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Trophy, Target, Crown, Shield, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { MOCK_GUILDS } from "@/lib/guilds";
import Link from "next/link";

export default function GuildDetailPage() {
  const params = useParams();
  const guildId = params.id as string;
  const guild = MOCK_GUILDS.find((g) => g.id === guildId);

  if (!guild) {
    return (
      <main className="min-h-screen bg-black text-white p-6 pb-24 max-w-md mx-auto">
        <Link href="/guilds" className="inline-flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Guilds</span>
        </Link>
        <div className="text-center py-20">
          <p className="text-zinc-500 text-lg font-bold">Guild not found</p>
          <p className="text-zinc-600 text-sm mt-1">This guild may have been disbanded.</p>
        </div>
      </main>
    );
  }

  // Mock: first guild is one you are a member of
  const isMember = guild.id === "g1";

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "leader":
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case "officer":
        return <Shield className="w-4 h-4 text-blue-400" />;
      default:
        return <Users className="w-4 h-4 text-zinc-500" />;
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "leader":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "officer":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-24 max-w-md mx-auto">
      {/* Back button */}
      <Link href="/guilds" className="inline-flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Guilds</span>
      </Link>

      {/* Guild header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700 mb-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Shield className="w-32 h-32" />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-3">
              <span className="text-5xl">{guild.icon}</span>
              <div>
                <h1 className="text-2xl font-black text-white">{guild.name}</h1>
                <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700 mt-1">
                  {guild.zone}
                </Badge>
              </div>
            </div>
            <p className="text-zinc-400 text-sm">{guild.description}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats row */}
      <motion.div
        className="grid grid-cols-3 gap-3 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-3 text-center">
            <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <span className="text-lg font-bold block">{guild.memberCount}</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Members</span>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-3 text-center">
            <Trophy className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
            <span className="text-lg font-bold block">{guild.level}</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Level</span>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-3 text-center">
            <Target className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <span className="text-lg font-bold block">{guild.totalPoints.toLocaleString()}</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Points</span>
          </CardContent>
        </Card>
      </motion.div>

      {/* Join / Member button */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        {isMember ? (
          <Button className="w-full bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-default hover:bg-zinc-800" disabled>
            <Shield className="w-4 h-4 mr-2" />
            Member
          </Button>
        ) : (
          <Button className="w-full bg-white text-black hover:bg-zinc-200 font-bold">
            Join Guild
          </Button>
        )}
      </motion.div>

      {/* Current Challenge */}
      {guild.currentChallenge && (
        <motion.section
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Current Challenge</h3>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Target className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold text-zinc-200 text-sm">{guild.currentChallenge.title}</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-500 mb-2">
                <span>Progress</span>
                <span>{guild.currentChallenge.progress}/{guild.currentChallenge.target}</span>
              </div>
              <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-yellow-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(guild.currentChallenge.progress / guild.currentChallenge.target) * 100}%`,
                  }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.section>
      )}

      {/* Members list */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Members</h3>
        <div className="space-y-2">
          {guild.members.map((member, i) => {
            const initials = member.handle.replace("@", "").slice(0, 2).toUpperCase();
            return (
              <motion.div
                key={member.handle}
                className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-2xl"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + 0.05 * i }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-200 text-sm">{member.handle}</p>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      {getRoleIcon(member.role)}
                      <Badge className={`text-[10px] ${getRoleBadgeStyle(member.role)}`}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <span className="text-sm font-bold text-zinc-400">{member.points.toLocaleString()} pts</span>
              </motion.div>
            );
          })}
        </div>
      </motion.section>
    </main>
  );
}
