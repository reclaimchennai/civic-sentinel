"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, Check, Gift } from "lucide-react";
import { type Challenge } from "@/lib/challenges";
import { formatDistanceToNow } from "date-fns";

interface ChallengeCardProps {
  challenge: Challenge;
  onClaim?: (id: string) => void;
}

export default function ChallengeCard({
  challenge,
  onClaim,
}: ChallengeCardProps) {
  const percentage = Math.min(
    (challenge.progress / challenge.target) * 100,
    100
  );
  const timeLeft = formatDistanceToNow(new Date(challenge.expiresAt), {
    addSuffix: true,
  });

  const handleClaim = () => {
    if (onClaim && challenge.status === "completed") {
      onClaim(challenge.id);
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">{challenge.icon}</span>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white">{challenge.title}</h4>
            <p className="text-xs text-zinc-500 mt-0.5">
              {challenge.description}
            </p>
          </div>
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider flex-shrink-0">
            {challenge.type}
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="relative h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
            <motion.div
              className={`absolute inset-y-0 left-0 rounded-full ${
                challenge.status === "claimed"
                  ? "bg-zinc-600"
                  : challenge.status === "completed"
                    ? "bg-green-500"
                    : "bg-indigo-500"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">
              {challenge.progress} / {challenge.target}
            </span>
            <div className="flex items-center gap-1 text-zinc-500">
              <Clock className="w-3 h-3" />
              <span>{timeLeft}</span>
            </div>
          </div>
        </div>

        {/* Reward + action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs">
              <Gift className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-yellow-400 font-bold">
                +{challenge.reward}
              </span>
              <span className="text-zinc-500">pts</span>
            </div>
            {challenge.bonusReward && (
              <span className="text-[10px] bg-indigo-900/40 text-indigo-300 border border-indigo-800/50 rounded-full px-2 py-0.5 font-medium">
                + {challenge.bonusReward}
              </span>
            )}
          </div>

          {challenge.status === "active" && (
            <span className="text-xs text-zinc-500 font-medium">
              {Math.round(percentage)}% done
            </span>
          )}

          {challenge.status === "completed" && (
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                onClick={handleClaim}
                className="bg-green-600 hover:bg-green-500 text-white text-xs h-7 px-3 rounded-full"
              >
                <Gift className="w-3 h-3 mr-1" />
                Claim Reward
              </Button>
            </motion.div>
          )}

          {challenge.status === "claimed" && (
            <div className="flex items-center gap-1 text-zinc-600 text-xs">
              <Check className="w-3.5 h-3.5" />
              <span className="font-medium">Claimed</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
