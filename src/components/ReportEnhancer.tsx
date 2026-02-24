"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Repeat, FileText, ChevronDown, ChevronUp } from "lucide-react";

interface ReportEnhancerProps {
  onEnhance: (data: { severity: number; recurring: boolean; notes: string }) => void;
}

const SEVERITY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "Minor", color: "text-green-400" },
  2: { label: "Low", color: "text-lime-400" },
  3: { label: "Moderate", color: "text-yellow-400" },
  4: { label: "High", color: "text-orange-400" },
  5: { label: "Critical", color: "text-red-400" },
};

const SEVERITY_BG: Record<number, string> = {
  1: "bg-green-500",
  2: "bg-lime-500",
  3: "bg-yellow-500",
  4: "bg-orange-500",
  5: "bg-red-500",
};

export default function ReportEnhancer({ onEnhance }: ReportEnhancerProps) {
  const [expanded, setExpanded] = useState(true);
  const [severity, setSeverity] = useState(3);
  const [recurring, setRecurring] = useState(false);
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    onEnhance({ severity, recurring, notes });
  };

  const severityInfo = SEVERITY_LABELS[severity];

  return (
    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
      {/* Toggle header */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-zinc-400" />
          <span className="text-sm font-semibold text-white">
            Enhance Your Report
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-zinc-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-500" />
        )}
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <CardContent className="px-4 pb-4 pt-0 space-y-4">
            {/* Severity slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-xs font-medium text-zinc-300">
                    Severity
                  </span>
                </div>
                <span className={`text-xs font-bold ${severityInfo.color}`}>
                  {severityInfo.label}
                </span>
              </div>

              {/* Custom severity track */}
              <div className="relative">
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-zinc-600
                    [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-zinc-600"
                />
                {/* Severity dots */}
                <div className="flex justify-between mt-1 px-0.5">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-1.5 h-1.5 rounded-full ${
                        level <= severity ? SEVERITY_BG[level] : "bg-zinc-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Recurring toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-xs font-medium text-zinc-300">
                  Recurring Issue
                </span>
              </div>
              <button
                onClick={() => setRecurring(!recurring)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  recurring ? "bg-indigo-600" : "bg-zinc-700"
                }`}
              >
                <motion.div
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                  animate={{ left: recurring ? "1.375rem" : "0.125rem" }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              </button>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">
                Additional Notes{" "}
                <span className="text-zinc-600">(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe the issue in more detail..."
                rows={2}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 resize-none focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>

            {/* Hint + submit */}
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-zinc-600 italic">
                Earn bonus points for detailed reports
              </p>
              <Button
                size="sm"
                onClick={handleSubmit}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-7 px-3 rounded-full"
              >
                Save Details
              </Button>
            </div>
          </CardContent>
        </motion.div>
      )}
    </Card>
  );
}
