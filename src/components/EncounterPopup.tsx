"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { type RandomEncounter } from "@/lib/randomEncounters";

interface EncounterPopupProps {
  encounter: RandomEncounter | null;
  onDismiss: () => void;
}

const GLOW_COLORS: Record<string, string> = {
  points: "shadow-green-500/30",
  badge: "shadow-yellow-500/30",
  box: "shadow-amber-500/30",
};

export default function EncounterPopup({
  encounter,
  onDismiss,
}: EncounterPopupProps) {
  useEffect(() => {
    if (!encounter) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [encounter, onDismiss]);

  return (
    <AnimatePresence>
      {encounter && (
        <motion.div
          className="fixed top-4 left-1/2 z-[90] w-full max-w-sm px-4"
          style={{ x: "-50%" }}
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          <div
            className={`bg-zinc-900 border border-zinc-700 rounded-xl p-3 flex items-center gap-3 cursor-pointer shadow-lg ${
              GLOW_COLORS[encounter.reward.type] || "shadow-zinc-500/20"
            }`}
            onClick={onDismiss}
          >
            {/* Icon */}
            <motion.span
              className="text-2xl flex-shrink-0"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
            >
              {encounter.icon}
            </motion.span>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {encounter.title}
              </p>
              <p className="text-xs text-zinc-400 truncate">
                {encounter.description}
              </p>
            </div>

            {/* Reward label */}
            <div className="flex-shrink-0 bg-zinc-800 border border-zinc-700 rounded-full px-2.5 py-1">
              <span className="text-xs font-bold text-yellow-400 whitespace-nowrap">
                {encounter.reward.label}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
