"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Lock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { EXCLUSIVE_BADGES, BADGE_RARITY_CONFIG } from "@/lib/exclusiveBadges";
import Link from "next/link";

interface AvatarFrame {
  id: string;
  name: string;
  style: string;
  unlocked: boolean;
  requiredLevel?: number;
}

interface Title {
  id: string;
  label: string;
  unlocked: boolean;
  requiredLevel?: number;
}

const AVATAR_FRAMES: AvatarFrame[] = [
  { id: "af1", name: "Default", style: "border-zinc-600", unlocked: true },
  { id: "af2", name: "Gold Ring", style: "border-yellow-500", unlocked: true },
  { id: "af3", name: "Sentinel Shield", style: "border-blue-500", unlocked: true },
  { id: "af4", name: "Emerald Glow", style: "border-green-500", unlocked: false, requiredLevel: 3 },
  { id: "af5", name: "Purple Aura", style: "border-purple-500", unlocked: false, requiredLevel: 5 },
  { id: "af6", name: "Legendary Flame", style: "border-orange-500", unlocked: false, requiredLevel: 6 },
];

const TITLES: Title[] = [
  { id: "t1", label: "Civic Guardian", unlocked: true },
  { id: "t2", label: "Street Guardian", unlocked: true },
  { id: "t3", label: "Pothole Paladin", unlocked: true },
  { id: "t4", label: "Report Ranger", unlocked: true },
  { id: "t5", label: "Zone Commander", unlocked: false, requiredLevel: 4 },
  { id: "t6", label: "Chennai Legend", unlocked: false, requiredLevel: 7 },
];

// Mock: user has earned first 4 badges
const earnedBadgeIds = new Set(["b1", "b2", "b3", "b4"]);

export default function CustomizePage() {
  const [selectedFrame, setSelectedFrame] = useState("af1");
  const [selectedTitle, setSelectedTitle] = useState("t1");
  const [showcaseBadges, setShowcaseBadges] = useState<string[]>(["b1", "b2", "b3"]);

  const handleFrameSelect = (frame: AvatarFrame) => {
    if (!frame.unlocked) return;
    setSelectedFrame(frame.id);
    alert("Customization saved!");
  };

  const handleTitleSelect = (title: Title) => {
    if (!title.unlocked) return;
    setSelectedTitle(title.id);
    alert("Customization saved!");
  };

  const handleBadgeToggle = (badgeId: string) => {
    if (!earnedBadgeIds.has(badgeId)) return;

    setShowcaseBadges((prev) => {
      if (prev.includes(badgeId)) {
        return prev.filter((id) => id !== badgeId);
      }
      if (prev.length >= 3) {
        // Replace the last slot
        return [...prev.slice(0, 2), badgeId];
      }
      return [...prev, badgeId];
    });
    alert("Customization saved!");
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-24 max-w-md mx-auto">
      {/* Back button */}
      <Link href="/profile" className="inline-flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Profile</span>
      </Link>

      <header className="mb-8">
        <div className="flex items-center space-x-2 mb-1">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          <h1 className="text-2xl font-black tracking-tight uppercase italic">Customize</h1>
        </div>
        <p className="text-zinc-400 text-sm">Make it yours.</p>
      </header>

      {/* Avatar Frames */}
      <motion.section
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Avatar Frames</h3>
        <div className="grid grid-cols-3 gap-3">
          {AVATAR_FRAMES.map((frame) => {
            const isSelected = selectedFrame === frame.id;
            return (
              <button
                key={frame.id}
                onClick={() => handleFrameSelect(frame)}
                className={`relative p-4 rounded-2xl border transition-all ${
                  frame.unlocked
                    ? isSelected
                      ? "bg-zinc-800 border-yellow-500"
                      : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                    : "bg-zinc-900/50 border-zinc-800/50 cursor-not-allowed opacity-60"
                }`}
              >
                {/* Frame preview circle */}
                <div className={`w-14 h-14 rounded-full border-[3px] ${frame.style} mx-auto mb-2 flex items-center justify-center bg-zinc-800`}>
                  {!frame.unlocked ? (
                    <Lock className="w-4 h-4 text-zinc-600" />
                  ) : isSelected ? (
                    <Check className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <span className="text-xs font-bold text-zinc-500">You</span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 text-center font-semibold">{frame.name}</p>
                {!frame.unlocked && (
                  <p className="text-[9px] text-zinc-600 text-center mt-0.5">Level {frame.requiredLevel}</p>
                )}
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-3.5 h-3.5 text-yellow-500" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* Titles */}
      <motion.section
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Title</h3>
        <div className="space-y-2">
          {TITLES.map((title) => {
            const isSelected = selectedTitle === title.id;
            return (
              <button
                key={title.id}
                onClick={() => handleTitleSelect(title)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  title.unlocked
                    ? isSelected
                      ? "bg-zinc-800 border-yellow-500"
                      : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                    : "bg-zinc-900/50 border-zinc-800/50 cursor-not-allowed opacity-60"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {!title.unlocked && <Lock className="w-4 h-4 text-zinc-600" />}
                  <span className={`text-sm font-semibold ${title.unlocked ? "text-zinc-200" : "text-zinc-600"}`}>
                    {title.label}
                  </span>
                  {!title.unlocked && (
                    <span className="text-[10px] text-zinc-600">Level {title.requiredLevel}</span>
                  )}
                </div>
                {isSelected && <Check className="w-4 h-4 text-yellow-500" />}
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* Badge Showcase */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Badge Showcase</h3>
        <p className="text-xs text-zinc-600 mb-4">Select up to 3 badges to feature on your profile.</p>

        {/* Current showcase slots */}
        <div className="flex space-x-3 mb-6">
          {[0, 1, 2].map((slot) => {
            const badgeId = showcaseBadges[slot];
            const badge = badgeId ? EXCLUSIVE_BADGES.find((b) => b.id === badgeId) : null;
            const rarityConfig = badge ? BADGE_RARITY_CONFIG[badge.rarity] : null;
            return (
              <div
                key={slot}
                className={`w-20 h-20 rounded-2xl border-2 border-dashed flex items-center justify-center ${
                  badge && rarityConfig
                    ? `${rarityConfig.bgColor} ${rarityConfig.borderColor}`
                    : "border-zinc-800 bg-zinc-900/50"
                }`}
              >
                {badge ? (
                  <div className="text-center">
                    <div className="text-2xl mb-0.5">
                      {badge.rarity === "legendary" ? "⭐" : badge.rarity === "epic" ? "💎" : badge.rarity === "rare" ? "💠" : badge.rarity === "uncommon" ? "🟢" : "⚪"}
                    </div>
                    <p className={`text-[8px] font-bold ${rarityConfig?.color}`}>{badge.name}</p>
                  </div>
                ) : (
                  <span className="text-xs text-zinc-700">Empty</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Badge list */}
        <div className="space-y-2">
          {EXCLUSIVE_BADGES.map((badge) => {
            const isEarned = earnedBadgeIds.has(badge.id);
            const isShowcased = showcaseBadges.includes(badge.id);
            const rarityConfig = BADGE_RARITY_CONFIG[badge.rarity];
            return (
              <button
                key={badge.id}
                onClick={() => handleBadgeToggle(badge.id)}
                disabled={!isEarned}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  isEarned
                    ? isShowcased
                      ? `${rarityConfig.bgColor} ${rarityConfig.borderColor}`
                      : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                    : "bg-zinc-900/30 border-zinc-800/50 cursor-not-allowed opacity-40"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {!isEarned && <Lock className="w-3.5 h-3.5 text-zinc-600" />}
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${isEarned ? "text-zinc-200" : "text-zinc-600"}`}>
                      {badge.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <Badge className={`text-[9px] ${rarityConfig.bgColor} ${rarityConfig.color} ${rarityConfig.borderColor}`}>
                        {rarityConfig.label}
                      </Badge>
                      {!isEarned && (
                        <span className="text-[10px] text-zinc-600">{badge.condition}</span>
                      )}
                    </div>
                  </div>
                </div>
                {isShowcased && <Check className="w-4 h-4 text-yellow-500" />}
              </button>
            );
          })}
        </div>
      </motion.section>
    </main>
  );
}
