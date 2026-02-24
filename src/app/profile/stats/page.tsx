"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Calendar, MapPin, Clock, Flame } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const categoryData = [
  { name: "Road Damage", count: 5, color: "bg-red-500" },
  { name: "Garbage", count: 3, color: "bg-orange-500" },
  { name: "Parking", count: 2, color: "bg-yellow-500" },
  { name: "Drainage", count: 1, color: "bg-blue-500" },
  { name: "Other", count: 1, color: "bg-zinc-500" },
];

const weekActivity = [
  { day: "Mon", count: 2 },
  { day: "Tue", count: 0 },
  { day: "Wed", count: 1 },
  { day: "Thu", count: 3 },
  { day: "Fri", count: 1 },
  { day: "Sat", count: 0 },
  { day: "Sun", count: -1 }, // -1 = today (in progress)
];

const topZones = [
  { zone: "T. Nagar", reports: 5 },
  { zone: "Adyar", reports: 4 },
  { zone: "Mylapore", reports: 3 },
];

const maxCategoryCount = Math.max(...categoryData.map((c) => c.count));
const maxWeekCount = Math.max(...weekActivity.filter((d) => d.count >= 0).map((d) => d.count));

export default function StatsPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 pb-24 max-w-md mx-auto">
      {/* Back button */}
      <Link href="/profile" className="inline-flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Profile</span>
      </Link>

      <header className="mb-8">
        <h1 className="text-2xl font-black tracking-tight uppercase italic">Your Stats</h1>
        <p className="text-zinc-400 text-sm">Personal analytics</p>
      </header>

      {/* Summary cards */}
      <motion.div
        className="grid grid-cols-3 gap-3 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-3 text-center">
            <TrendingUp className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
            <span className="text-xl font-bold block">12</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Total</span>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-3 text-center">
            <Calendar className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <span className="text-xl font-bold block">4</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">This Month</span>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-3 text-center">
            <Clock className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <span className="text-xl font-bold block">2.3</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Avg/Week</span>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reports by Category */}
      <motion.section
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Reports by Category</h3>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4 space-y-3">
            {categoryData.map((cat, i) => (
              <motion.div
                key={cat.name}
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + 0.05 * i }}
              >
                <span className="text-xs text-zinc-400 w-20 shrink-0 text-right">{cat.name}</span>
                <div className="flex-1 h-5 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${cat.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(cat.count / maxCategoryCount) * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.2 + 0.05 * i }}
                  />
                </div>
                <span className="text-xs font-bold text-zinc-300 w-6 text-right">{cat.count}</span>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.section>

      {/* Activity This Week */}
      <motion.section
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Activity This Week</h3>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-end justify-between space-x-2">
              {weekActivity.map((day, i) => {
                const isToday = day.count === -1;
                const barHeight = isToday ? 0 : maxWeekCount > 0 ? (day.count / maxWeekCount) * 48 : 0;
                return (
                  <div key={day.day} className="flex flex-col items-center space-y-2 flex-1">
                    <div className="h-12 flex items-end justify-center w-full">
                      {isToday ? (
                        <div className="w-full max-w-[28px] h-6 border-2 border-dashed border-zinc-700 rounded bg-zinc-800/50 flex items-center justify-center">
                          <span className="text-[8px] text-zinc-600">now</span>
                        </div>
                      ) : day.count > 0 ? (
                        <motion.div
                          className="w-full max-w-[28px] bg-yellow-500 rounded"
                          initial={{ height: 0 }}
                          animate={{ height: barHeight }}
                          transition={{ duration: 0.5, delay: 0.3 + 0.05 * i }}
                        />
                      ) : (
                        <div className="w-full max-w-[28px] h-1 bg-zinc-800 rounded" />
                      )}
                    </div>
                    <span className={`text-[10px] font-semibold ${isToday ? "text-yellow-500" : "text-zinc-500"}`}>
                      {day.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Top Zones */}
      <motion.section
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Your Top Zones</h3>
        <div className="space-y-2">
          {topZones.map((zone, i) => (
            <div
              key={zone.zone}
              className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-2xl"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                </div>
                <span className="font-semibold text-zinc-200 text-sm">{zone.zone}</span>
              </div>
              <span className="text-sm text-zinc-400">{zone.reports} reports</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Best Streak */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-orange-900/30 to-zinc-900 border-orange-500/20">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-orange-500/20 rounded-full">
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-orange-300 font-bold uppercase">Best Streak</p>
              <p className="text-2xl font-black text-white">14 days</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
