"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingUp, Users, MapPin, CheckCircle, AlertTriangle, Droplets } from "lucide-react";

const stats = [
  { label: "Issues Resolved", value: "3,421", icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
  { label: "Active Citizens", value: "1,847", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Zones Covered", value: "15", icon: MapPin, color: "text-purple-500", bg: "bg-purple-500/10" },
  { label: "Resolution Rate", value: "89%", icon: TrendingUp, color: "text-yellow-500", bg: "bg-yellow-500/10" },
];

const impactAreas = [
  { category: "Road Damage", reports: 3245, icon: AlertTriangle, color: "bg-red-500", maxReports: 3245 },
  { category: "Garbage Dumping", reports: 2891, icon: AlertTriangle, color: "bg-orange-500", maxReports: 3245 },
  { category: "Drainage Issues", reports: 2103, icon: Droplets, color: "bg-blue-500", maxReports: 3245 },
  { category: "Parking Violations", reports: 1876, icon: AlertTriangle, color: "bg-yellow-500", maxReports: 3245 },
];

export default function ImpactPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 pb-24 max-w-md mx-auto">
      <header className="py-8">
        <h1 className="text-2xl font-black tracking-tight uppercase italic">City Impact</h1>
        <p className="text-zinc-400 text-sm">Your collective difference.</p>
      </header>

      {/* Hero stat */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700 mb-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <TrendingUp className="w-32 h-32" />
          </div>
          <CardContent className="p-6 text-center">
            <p className="text-zinc-400 text-sm uppercase tracking-wider mb-2">Total Reports Filed</p>
            <motion.span
              className="text-5xl font-black text-white block"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              12,847
            </motion.span>
            <p className="text-zinc-500 text-xs mt-2">and counting...</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
            >
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className={`p-2 rounded-full ${stat.bg} mb-2`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <span className="text-2xl font-bold text-zinc-100">{stat.value}</span>
                  <span className="text-[11px] text-zinc-500 uppercase tracking-wider">{stat.label}</span>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Top Impact Areas */}
      <section>
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Top Impact Areas</h3>
        <div className="space-y-4">
          {impactAreas.map((area, i) => {
            const Icon = area.icon;
            const widthPercent = (area.reports / area.maxReports) * 100;
            return (
              <motion.div
                key={area.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
              >
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4 text-zinc-400" />
                        <span className="font-semibold text-zinc-200 text-sm">{area.category}</span>
                      </div>
                      <span className="text-sm font-bold text-zinc-300">{area.reports.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${area.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPercent}%` }}
                        transition={{ duration: 0.8, delay: 0.2 + 0.1 * i }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
