"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Clock, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface EventBannerProps {
  event: {
    id: string;
    title: string;
    description: string;
    icon: string;
    endDate: string;
    multiplier: number;
    targetReports: number;
    currentReports: number;
  };
}

function formatCountdown(endDate: string): string {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return "00:00:00";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (days > 0) {
    return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`;
  }
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function EventBanner({ event }: EventBannerProps) {
  const [countdown, setCountdown] = useState(formatCountdown(event.endDate));
  const percentage = Math.min(
    (event.currentReports / event.targetReports) * 100,
    100
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(formatCountdown(event.endDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [event.endDate]);

  return (
    <motion.div
      animate={{
        boxShadow: [
          "0 0 0px rgba(251, 146, 60, 0)",
          "0 0 12px rgba(251, 146, 60, 0.3)",
          "0 0 0px rgba(251, 146, 60, 0)",
        ],
      }}
      transition={{ duration: 2.5, repeat: Infinity }}
      className="rounded-xl"
    >
      <Card className="overflow-hidden border-amber-900/50 bg-gradient-to-br from-amber-950 via-orange-950 to-zinc-900">
        <CardContent className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{event.icon}</span>
              <h3 className="text-sm font-bold text-white">{event.title}</h3>
            </div>
            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/40 hover:bg-orange-500/20">
              <Zap className="w-3 h-3" />
              {event.multiplier}x Points
            </Badge>
          </div>

          {/* Description */}
          <p className="text-xs text-zinc-400 leading-snug">
            {event.description}
          </p>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="relative h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-orange-600 to-amber-400"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>
                <span className="text-amber-300 font-semibold">
                  {event.currentReports}
                </span>{" "}
                / {event.targetReports} reports
              </span>
              <span className="text-amber-300 font-semibold">
                {Math.round(percentage)}%
              </span>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Ends in </span>
            <span className="text-amber-300 font-mono font-bold">
              {countdown}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
