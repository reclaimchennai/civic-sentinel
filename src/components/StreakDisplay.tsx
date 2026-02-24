"use client";

import { Flame, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { type StreakData, getStreakStatus } from "@/lib/streaks";

interface StreakDisplayProps {
  streak: StreakData;
  compact?: boolean;
}

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export default function StreakDisplay({ streak, compact = false }: StreakDisplayProps) {
  const status = getStreakStatus(streak);

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <motion.div
          animate={
            streak.currentStreak > 0
              ? { scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }
              : {}
          }
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Flame
            className={`w-4 h-4 ${
              streak.currentStreak > 0 ? "text-orange-400" : "text-zinc-600"
            }`}
          />
        </motion.div>
        <span
          className={`text-sm font-bold ${
            streak.currentStreak > 0 ? "text-orange-400" : "text-zinc-600"
          }`}
        >
          {streak.currentStreak}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* Streak header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={
              streak.currentStreak > 0
                ? { scale: [1, 1.3, 1], rotate: [0, -5, 5, 0] }
                : {}
            }
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Flame
              className={`w-6 h-6 ${
                streak.currentStreak > 0 ? "text-orange-400" : "text-zinc-600"
              }`}
            />
          </motion.div>
          <div>
            <span className="text-2xl font-black text-white">
              {streak.currentStreak}
            </span>
            <span className="text-sm text-zinc-400 ml-1">day streak</span>
          </div>
        </div>

        {/* Streak shields */}
        {streak.streakShields > 0 && (
          <div className="flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded-full">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-bold text-blue-400">
              {streak.streakShields}
            </span>
          </div>
        )}
      </div>

      {/* Status label */}
      {streak.isAtRisk && (
        <motion.div
          className="flex items-center gap-1.5 text-red-400 bg-red-900/20 px-3 py-1.5 rounded-lg border border-red-900/30"
          animate={{ opacity: [1, 0.6, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <Flame className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">
            Streak at risk! Report today to keep it alive.
          </span>
        </motion.div>
      )}

      {!streak.isAtRisk && streak.currentStreak > 0 && (
        <p className={`text-xs font-medium ${status.color}`}>{status.label}</p>
      )}

      {/* Weekly activity dots */}
      <div className="flex items-center justify-between gap-1">
        {streak.weeklyActivity.map((active, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <motion.div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                active
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                  : "bg-zinc-800 text-zinc-600 border border-zinc-700"
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              {active ? "✓" : DAY_LABELS[i]}
            </motion.div>
            <span className="text-[9px] text-zinc-600 uppercase">
              {DAY_LABELS[i]}
            </span>
          </div>
        ))}
      </div>

      {/* Longest streak */}
      <p className="text-xs text-zinc-500">
        Longest streak:{" "}
        <span className="text-zinc-300 font-semibold">
          {streak.longestStreak} days
        </span>
      </p>
    </div>
  );
}
