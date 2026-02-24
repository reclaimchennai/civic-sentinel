"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import confetti from "canvas-confetti";
import { BOX_CONFIG, rollReward, type BoxRarity, type MysteryReward } from "@/lib/mysteryBox";
import { Button } from "@/components/ui/button";
import GameIcon from "@/components/GameIcon";

interface MysteryBoxRevealProps {
  rarity: BoxRarity;
  onOpen: (reward: MysteryReward) => void;
  onClose: () => void;
}

const RARITY_CONFETTI: Record<BoxRarity, string[]> = {
  bronze: ["#b45309", "#d97706", "#92400e"],
  silver: ["#9ca3af", "#d1d5db", "#6b7280", "#e5e7eb"],
  gold: ["#facc15", "#fbbf24", "#f59e0b", "#fde68a", "#eab308"],
};

const RARITY_ICONS: Record<BoxRarity, string> = {
  bronze: "Package",
  silver: "Gift",
  gold: "Sparkles",
};

const REWARD_ICONS: Record<string, string> = {
  points: "Coins",
  badge: "Medal",
  multiplier: "Zap",
  shield: "Shield",
};

export default function MysteryBoxReveal({
  rarity,
  onOpen,
  onClose,
}: MysteryBoxRevealProps) {
  const [phase, setPhase] = useState<"shake" | "reveal">("shake");
  const [reward, setReward] = useState<MysteryReward | null>(null);
  const config = BOX_CONFIG[rarity];

  const handleTap = () => {
    if (phase !== "shake") return;

    const result = rollReward(rarity);
    setReward(result);
    setPhase("reveal");

    confetti({
      particleCount: rarity === "gold" ? 80 : rarity === "silver" ? 50 : 30,
      spread: 70,
      origin: { y: 0.5 },
      colors: RARITY_CONFETTI[rarity],
    });

    onOpen(result);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-sm">
          {phase === "shake" && (
            <motion.div
              className="flex flex-col items-center"
              animate={{
                rotate: [0, -3, 3, -3, 3, 0],
                scale: [1, 1.02, 0.98, 1.02, 0.98, 1],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 1.5,
              }}
            >
              {/* Box */}
              <motion.div
                className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${config.bgGradient} flex items-center justify-center mb-6`}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(0,0,0,0.3)",
                    "0 0 40px rgba(0,0,0,0.5)",
                    "0 0 20px rgba(0,0,0,0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ cursor: "pointer" }}
                onClick={handleTap}
              >
                <GameIcon name={RARITY_ICONS[rarity]} size="2xl" variant="plain" color="amber" />
              </motion.div>

              <motion.p
                className="text-zinc-300 text-sm font-medium"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Tap to Open
              </motion.p>

              <p className={`text-xs mt-1 ${config.color}`}>
                {config.label}
              </p>
            </motion.div>
          )}

          {phase === "reveal" && reward && (
            <motion.div
              className="flex flex-col items-center"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
            >
              {/* Reward glow */}
              <motion.div
                className={`w-28 h-28 rounded-full bg-gradient-to-br ${config.bgGradient} flex items-center justify-center mb-4`}
                animate={{
                  boxShadow: [
                    "0 0 30px rgba(0,0,0,0.2)",
                    "0 0 60px rgba(0,0,0,0.4)",
                    "0 0 30px rgba(0,0,0,0.2)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <GameIcon name={REWARD_ICONS[reward.type] || "Sparkles"} size="2xl" variant="plain" color="yellow" />
              </motion.div>

              <motion.h2
                className="text-xl font-black text-white mb-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {reward.label}
              </motion.h2>

              <motion.p
                className="text-sm text-zinc-400 mb-6 capitalize"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {reward.rarity} reward from {config.label}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  onClick={onClose}
                  className="bg-white text-black hover:bg-zinc-200 font-bold px-8 rounded-full"
                >
                  Claim
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
