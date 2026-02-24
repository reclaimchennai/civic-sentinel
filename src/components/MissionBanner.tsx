"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface Mission {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  participants: number;
  endsAt: string;
  reward: string;
}

interface MissionBannerProps {
  mission: Mission;
}

function formatTimeRemaining(endsAt: string): string {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `${days}d ${hours}h remaining`;
  const minutes = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${minutes}m remaining`;
}

export const MOCK_MISSION: Mission = {
  id: "cm1",
  title: "Clean Streets Week",
  description:
    "Report garbage, debris, and sanitation violations across Chennai. Let's make our streets spotless!",
  icon: "🧹",
  progress: 342,
  target: 500,
  participants: 89,
  endsAt: new Date(Date.now() + 2 * 86400000).toISOString(),
  reward: "2x Points + Exclusive Badge",
};

export default function MissionBanner({ mission }: MissionBannerProps) {
  const [timeLeft, setTimeLeft] = useState(formatTimeRemaining(mission.endsAt));
  const percentage = Math.min(
    (mission.progress / mission.target) * 100,
    100
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(formatTimeRemaining(mission.endsAt));
    }, 60000);
    return () => clearInterval(interval);
  }, [mission.endsAt]);

  return (
    <Card className="overflow-hidden border-indigo-900/50 bg-gradient-to-br from-indigo-950 via-zinc-900 to-zinc-900">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{mission.icon}</span>
            <div>
              <h3 className="text-sm font-bold text-white">{mission.title}</h3>
              <p className="text-xs text-zinc-400 leading-snug mt-0.5">
                {mission.description}
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="relative h-2.5 w-full rounded-full bg-zinc-800 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">
              <span className="text-indigo-300 font-bold">
                {mission.progress.toLocaleString()}
              </span>{" "}
              / {mission.target.toLocaleString()} reports
            </span>
            <span className="text-xs text-indigo-300 font-semibold">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-zinc-400">
              <Users className="w-3.5 h-3.5" />
              <span>
                <span className="text-white font-semibold">
                  {mission.participants}
                </span>{" "}
                joined
              </span>
            </div>
            <div className="flex items-center gap-1 text-zinc-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLeft}</span>
            </div>
          </div>
        </div>

        {/* Reward */}
        <div className="bg-indigo-900/30 border border-indigo-800/50 rounded-lg px-3 py-2 flex items-center gap-2">
          <span className="text-sm">🎁</span>
          <span className="text-xs text-indigo-200 font-medium">
            Reward: {mission.reward}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
