"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import GameIcon from "@/components/GameIcon";

interface MilestoneCelebrationProps {
  milestone: {
    title: string;
    description: string;
    icon: string;
    badgeName?: string;
    reward: number;
  } | null;
  onClose: () => void;
}

export default function MilestoneCelebration({
  milestone,
  onClose,
}: MilestoneCelebrationProps) {
  const fireConfetti = useCallback(() => {
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0.6,
      decay: 0.94,
      startVelocity: 30,
      colors: ["#facc15", "#f59e0b", "#eab308", "#fbbf24", "#fde68a"],
    };

    confetti({ ...defaults, particleCount: 60, origin: { x: 0.3, y: 0.5 } });
    confetti({ ...defaults, particleCount: 60, origin: { x: 0.7, y: 0.5 } });

    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 40,
        origin: { x: 0.5, y: 0.4 },
      });
    }, 300);
  }, []);

  useEffect(() => {
    if (!milestone) return;

    fireConfetti();

    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [milestone, fireConfetti, onClose]);

  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 flex flex-col items-center text-center px-8 max-w-sm"
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
          >
            {/* Icon */}
            <motion.div
              className="mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ duration: 0.6, times: [0, 0.6, 1] }}
            >
              <GameIcon name={milestone.icon} size="2xl" variant="glow" color="yellow" />
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-2xl font-black text-white mb-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {milestone.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-sm text-zinc-400 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {milestone.description}
            </motion.p>

            {/* Badge reveal */}
            {milestone.badgeName && (
              <motion.div
                className="bg-zinc-800 border border-zinc-700 rounded-full px-4 py-1.5 mb-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <span className="text-xs font-bold text-yellow-400 flex items-center gap-1">
                  <GameIcon name="Medal" size="xs" variant="plain" color="yellow" />
                  {milestone.badgeName}
                </span>
              </motion.div>
            )}

            {/* Points earned */}
            <motion.div
              className="flex items-center gap-1.5 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span className="text-yellow-400 font-black text-lg">
                +{milestone.reward}
              </span>
              <span className="text-zinc-400 text-sm">points earned</span>
            </motion.div>

            {/* Dismiss button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                onClick={onClose}
                className="bg-white text-black hover:bg-zinc-200 font-bold px-8 rounded-full"
              >
                Continue
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
