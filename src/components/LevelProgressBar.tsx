"use client";

import { motion } from "framer-motion";
import { getLevelFromPoints, getProgressToNextLevel, LEVELS } from "@/lib/levels";

interface LevelProgressBarProps {
  points: number;
}

export default function LevelProgressBar({ points }: LevelProgressBarProps) {
  const level = getLevelFromPoints(points);
  const progress = getProgressToNextLevel(points);
  const nextLevel = LEVELS.find((l) => l.tier === level.tier + 1);
  const pointsToNext = nextLevel
    ? nextLevel.minPoints - points
    : 0;

  return (
    <div className="w-full space-y-2">
      {/* Level info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{level.icon}</span>
          <span className={`text-sm font-bold ${level.color}`}>
            {level.name}
          </span>
        </div>
        <span className="text-xs text-zinc-500 font-mono">
          {points.toLocaleString()} XP
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 w-full rounded-full bg-zinc-800 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-300"
          initial={{ width: 0 }}
          animate={{ width: `${progress.percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            boxShadow: "0 0 12px rgba(234, 179, 8, 0.5), 0 0 4px rgba(234, 179, 8, 0.3)",
          }}
        />

        {/* Shine sweep effect */}
        <motion.div
          className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ left: "-2rem" }}
          animate={{ left: "100%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Points to next level */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500">
          {progress.current.toLocaleString()} / {progress.required.toLocaleString()}
        </span>
        {nextLevel ? (
          <span className="text-xs text-zinc-400">
            <span className="text-yellow-500 font-semibold">
              {pointsToNext.toLocaleString()}
            </span>{" "}
            points to{" "}
            <span className={nextLevel.color}>{nextLevel.name}</span>
          </span>
        ) : (
          <span className="text-xs text-yellow-400 font-semibold">
            Max Level
          </span>
        )}
      </div>
    </div>
  );
}
