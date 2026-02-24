"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Swords } from "lucide-react";
import { type ZoneData } from "@/lib/zones";

interface ZoneMayorCardProps {
  zone: ZoneData;
}

export default function ZoneMayorCard({ zone }: ZoneMayorCardProps) {
  const handleChallenge = () => {
    alert(
      `Challenge issued to ${zone.mayor.handle}! Earn more points in ${zone.name} to dethrone the mayor.`
    );
  };

  return (
    <Card className="overflow-hidden border-indigo-900/40 bg-gradient-to-br from-indigo-950/60 via-zinc-900 to-zinc-900">
      <CardContent className="p-4 space-y-3">
        {/* Zone name */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">{zone.name}</h3>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            {zone.topCategory}
          </span>
        </div>

        {/* Mayor */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-900/50 border border-indigo-700/50 flex items-center justify-center">
            <Crown className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">
              {zone.mayor.handle}
            </p>
            <p className="text-xs text-zinc-500">
              <span className="text-yellow-400 font-semibold">
                {zone.mayor.points.toLocaleString()}
              </span>{" "}
              points
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-indigo-700/50 bg-indigo-900/30 text-indigo-300 hover:bg-indigo-900/50 hover:text-white text-xs h-8"
            onClick={handleChallenge}
          >
            <Swords className="w-3.5 h-3.5 mr-1" />
            Challenge
          </Button>
        </div>

        {/* Zone stats */}
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <span>
            <span className="text-zinc-300 font-semibold">
              {zone.totalReports}
            </span>{" "}
            reports
          </span>
          <span>
            <span className="text-zinc-300 font-semibold">
              {zone.activeReporters}
            </span>{" "}
            active reporters
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
