"use client";

import { useState } from "react";
import { type TimeFrame, type LeaderboardScope } from "@/lib/rankings";

interface LeaderboardFiltersProps {
  onFilterChange: (timeframe: TimeFrame, scope: LeaderboardScope) => void;
}

const TIMEFRAMES: { key: TimeFrame; label: string }[] = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "allTime", label: "All Time" },
];

const SCOPES: { key: LeaderboardScope; label: string }[] = [
  { key: "city", label: "City" },
  { key: "zone", label: "Zone" },
];

export default function LeaderboardFilters({
  onFilterChange,
}: LeaderboardFiltersProps) {
  const [activeTimeframe, setActiveTimeframe] = useState<TimeFrame>("weekly");
  const [activeScope, setActiveScope] = useState<LeaderboardScope>("city");

  const handleTimeframeChange = (tf: TimeFrame) => {
    setActiveTimeframe(tf);
    onFilterChange(tf, activeScope);
  };

  const handleScopeChange = (scope: LeaderboardScope) => {
    setActiveScope(scope);
    onFilterChange(activeTimeframe, scope);
  };

  return (
    <div className="space-y-2">
      {/* Timeframe pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {TIMEFRAMES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleTimeframeChange(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTimeframe === key
                ? "bg-white text-black"
                : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-zinc-200 hover:border-zinc-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Scope pills */}
      <div className="flex items-center gap-1.5">
        {SCOPES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleScopeChange(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeScope === key
                ? "bg-white text-black"
                : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-zinc-200 hover:border-zinc-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
