"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Award, MapPin, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

type ActionType = "report" | "badge" | "level" | "mayor";

interface FeedItem {
  id: string;
  username: string;
  initials: string;
  avatarColor: string;
  action: string;
  actionType: ActionType;
  category?: string;
  timestamp: Date;
  likes: number;
  liked: boolean;
}

const MOCK_FEED: FeedItem[] = [
  {
    id: "f1",
    username: "Ravi Kumar",
    initials: "RK",
    avatarColor: "bg-red-600",
    action: "filed a report in T. Nagar",
    actionType: "report",
    category: "Road Damage",
    timestamp: new Date(Date.now() - 12 * 60000),
    likes: 8,
    liked: false,
  },
  {
    id: "f2",
    username: "Priya Sharma",
    initials: "PS",
    avatarColor: "bg-purple-600",
    action: "earned Night Owl badge",
    actionType: "badge",
    timestamp: new Date(Date.now() - 45 * 60000),
    likes: 15,
    liked: true,
  },
  {
    id: "f3",
    username: "Arun Raj",
    initials: "AR",
    avatarColor: "bg-blue-600",
    action: "reached Level 5",
    actionType: "level",
    timestamp: new Date(Date.now() - 2 * 3600000),
    likes: 23,
    liked: false,
  },
  {
    id: "f4",
    username: "Deepa Nair",
    initials: "DN",
    avatarColor: "bg-green-600",
    action: "became Mayor of Adyar",
    actionType: "mayor",
    timestamp: new Date(Date.now() - 3 * 3600000),
    likes: 42,
    liked: false,
  },
  {
    id: "f5",
    username: "Karthik V",
    initials: "KV",
    avatarColor: "bg-orange-600",
    action: "filed a report in Mylapore",
    actionType: "report",
    category: "Garbage Dumping",
    timestamp: new Date(Date.now() - 5 * 3600000),
    likes: 6,
    liked: false,
  },
  {
    id: "f6",
    username: "Meena Sundar",
    initials: "MS",
    avatarColor: "bg-pink-600",
    action: "earned Pothole Paladin badge",
    actionType: "badge",
    timestamp: new Date(Date.now() - 8 * 3600000),
    likes: 19,
    liked: true,
  },
  {
    id: "f7",
    username: "Suresh M",
    initials: "SM",
    avatarColor: "bg-teal-600",
    action: "filed a report in Velachery",
    actionType: "report",
    category: "Drainage Issues",
    timestamp: new Date(Date.now() - 12 * 3600000),
    likes: 11,
    liked: false,
  },
  {
    id: "f8",
    username: "Lakshmi R",
    initials: "LR",
    avatarColor: "bg-indigo-600",
    action: "reached Level 3",
    actionType: "level",
    timestamp: new Date(Date.now() - 18 * 3600000),
    likes: 9,
    liked: false,
  },
  {
    id: "f9",
    username: "Vijay K",
    initials: "VK",
    avatarColor: "bg-yellow-600",
    action: "became Mayor of Anna Nagar",
    actionType: "mayor",
    timestamp: new Date(Date.now() - 24 * 3600000),
    likes: 37,
    liked: false,
  },
  {
    id: "f10",
    username: "Anita P",
    initials: "AP",
    avatarColor: "bg-cyan-600",
    action: "filed a report in Adyar",
    actionType: "report",
    category: "Parking Violation",
    timestamp: new Date(Date.now() - 30 * 3600000),
    likes: 4,
    liked: false,
  },
];

function getActionIcon(type: ActionType) {
  switch (type) {
    case "report":
      return <MapPin className="w-4 h-4 text-blue-400" />;
    case "badge":
      return <Award className="w-4 h-4 text-purple-400" />;
    case "level":
      return <Trophy className="w-4 h-4 text-yellow-400" />;
    case "mayor":
      return <Trophy className="w-4 h-4 text-indigo-400" />;
  }
}

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState<"following" | "trending" | "nearby">("trending");
  const [feed, setFeed] = useState(MOCK_FEED);

  const handleLike = (id: string) => {
    setFeed((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, liked: !item.liked, likes: item.liked ? item.likes - 1 : item.likes + 1 }
          : item
      )
    );
  };

  const tabs = [
    { key: "following" as const, label: "Following" },
    { key: "trending" as const, label: "Trending" },
    { key: "nearby" as const, label: "Nearby" },
  ];

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-24 max-w-md mx-auto">
      <header className="py-8">
        <h1 className="text-2xl font-black tracking-tight uppercase italic">Activity</h1>
        <p className="text-zinc-400 text-sm">See what others are doing.</p>
      </header>

      {/* Filter tabs */}
      <div className="flex space-x-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeTab === tab.key
                ? "bg-white text-black"
                : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {feed.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * i }}
          >
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full ${item.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                  >
                    {item.initials}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {getActionIcon(item.actionType)}
                      <p className="text-sm text-zinc-200">
                        <span className="font-bold text-white">{item.username}</span>{" "}
                        {item.action}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 mt-2">
                      <span className="text-xs text-zinc-600">
                        {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                      </span>
                      {item.category && (
                        <Badge className="bg-zinc-800 text-zinc-400 border-zinc-700 text-[10px]">
                          {item.category}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Like button */}
                  <button
                    onClick={() => handleLike(item.id)}
                    className="flex flex-col items-center space-y-1 shrink-0"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        item.liked ? "fill-red-500 text-red-500" : "text-zinc-600"
                      }`}
                    />
                    <span className="text-xs text-zinc-500">{item.likes}</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
