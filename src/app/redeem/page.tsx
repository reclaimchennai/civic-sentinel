"use client";

import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Gift, ShoppingBag, Lock, Clock, AlertTriangle, Sparkles, Package } from 'lucide-react';
import GameIcon from "@/components/GameIcon";
import { motion } from "framer-motion";
import MysteryBoxReveal from "@/components/MysteryBoxReveal";
import { MOCK_BOXES, type BoxRarity, type MysteryReward, BOX_CONFIG } from "@/lib/mysteryBox";

const rewards = [
  { id: 1, name: '"Mayor of Chennai" Cap', cost: 500, type: 'merch', brand: 'Chennai Corp', image: '/placeholder_images_coupons/mayor_of_chennai_cap.png', stock: 5, minLevel: 3, isLimited: false, expiresAt: null },
  { id: 2, name: '"Civic Sentinel" Badge', cost: 200, type: 'merch', brand: 'Official', image: '/placeholder_images_coupons/civic_sentinel_badge.png', stock: null, minLevel: 1, isLimited: false, expiresAt: null },
  { id: 3, name: 'A2B ₹100 Off Coupon', cost: 300, type: 'coupon', brand: 'A2B', image: '/placeholder_images_coupons/a2b_coupon.png', stock: 12, minLevel: 1, isLimited: false, expiresAt: null },
  { id: 4, name: 'Murugan Idli Free Drink', cost: 250, type: 'coupon', brand: 'Murugan Idli', image: '/placeholder_images_coupons/Murugan_idly.jpg', stock: 8, minLevel: 1, isLimited: false, expiresAt: null },
  { id: 5, name: 'Saravana Bhavan Coffee', cost: 150, type: 'coupon', brand: 'Saravana Bhavan', image: '/placeholder_images_coupons/saravana_bhavan_coffee.png', stock: null, minLevel: 1, isLimited: false, expiresAt: null },
  { id: 6, name: '"Chennai Legend" Gold Frame', cost: 2000, type: 'merch', brand: 'Exclusive', image: '/placeholder_images_coupons/civic_sentinel_badge.png', stock: 3, minLevel: 5, isLimited: true, expiresAt: new Date(Date.now() + 5 * 86400000).toISOString() },
  { id: 7, name: 'Limited Monsoon Badge', cost: 400, type: 'merch', brand: 'Seasonal', image: '/placeholder_images_coupons/civic_sentinel_badge.png', stock: 10, minLevel: 2, isLimited: true, expiresAt: new Date(Date.now() + 3 * 86400000).toISOString() },
];

export default function RedeemPage() {
  const { data: session, status } = useSession();
  const [openingBox, setOpeningBox] = useState<BoxRarity | null>(null);

  const userPoints = status === "authenticated" && session?.user?.id === "demo-user-001" ? 450 : 0;
  const userLevel = status === "authenticated" && session?.user?.id === "demo-user-001" ? 5 : 1;
  const unopenedBoxes = MOCK_BOXES.filter(b => !b.opened);

  const handleBoxOpen = (reward: MysteryReward) => {
    console.log("Box opened, reward:", reward);
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-24 max-w-md mx-auto">
      <header className="py-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase italic">Redeem</h1>
          <p className="text-zinc-400 text-sm">Your rewards for a better city.</p>
        </div>
        {status === "authenticated" && (
          <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-2xl flex items-center space-x-2 animate-in fade-in zoom-in duration-300">
            <span className="text-xl font-bold text-yellow-500">{userPoints} pts</span>
          </div>
        )}
      </header>

      {/* Mystery Boxes */}
      {unopenedBoxes.length > 0 && (
        <section className="mb-8">
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>Mystery Boxes ({unopenedBoxes.length})</span>
          </h3>
          <div className="flex gap-3">
            {unopenedBoxes.map((box) => {
              const config = BOX_CONFIG[box.rarity];
              return (
                <motion.button
                  key={box.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setOpeningBox(box.rarity)}
                  className={`flex-1 p-4 rounded-2xl border border-zinc-800 bg-gradient-to-br ${config.bgGradient} text-center`}
                >
                  <div className="mb-1 flex justify-center"><GameIcon name="Package" size="xl" variant="plain" color="amber" /></div>
                  <p className={`text-xs font-bold ${config.color}`}>{config.label}</p>
                  <p className="text-[10px] text-zinc-500 mt-1">Tap to open</p>
                </motion.button>
              );
            })}
          </div>
        </section>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-zinc-900 border-zinc-800 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="merch">Merch</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {rewards.map(reward => <RewardCard key={reward.id} reward={reward} userPoints={userPoints} userLevel={userLevel} />)}
        </TabsContent>
        <TabsContent value="merch" className="space-y-4">
          {rewards.filter(r => r.type === 'merch').map(reward => <RewardCard key={reward.id} reward={reward} userPoints={userPoints} userLevel={userLevel} />)}
        </TabsContent>
        <TabsContent value="coupons" className="space-y-4">
          {rewards.filter(r => r.type === 'coupon').map(reward => <RewardCard key={reward.id} reward={reward} userPoints={userPoints} userLevel={userLevel} />)}
        </TabsContent>
      </Tabs>

      {/* Mystery Box Reveal Overlay */}
      {openingBox && (
        <MysteryBoxReveal
          rarity={openingBox}
          onOpen={handleBoxOpen}
          onClose={() => setOpeningBox(null)}
        />
      )}
    </main>
  );
}

function RewardCard({ reward, userPoints, userLevel }: { reward: any, userPoints: number, userLevel: number }) {
  const canAfford = userPoints >= reward.cost;
  const meetsLevel = userLevel >= reward.minLevel;
  const isAvailable = canAfford && meetsLevel;

  const getTimeLeft = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
      <div className="h-40 w-full relative">
        <img src={reward.image} alt={reward.name} className="w-full h-full object-cover opacity-80" />
        <div className="absolute top-2 right-2 flex gap-1">
          <Badge className="bg-black/60 backdrop-blur-md border-zinc-700">
            {reward.type === 'merch' ? <ShoppingBag className="w-3 h-3 mr-1" /> : <Gift className="w-3 h-3 mr-1" />}
            {reward.type.toUpperCase()}
          </Badge>
          {reward.isLimited && (
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 backdrop-blur-md">
              <Sparkles className="w-3 h-3 mr-1" />
              LIMITED
            </Badge>
          )}
        </div>
        {reward.expiresAt && (
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 backdrop-blur-md">
              <Clock className="w-3 h-3 mr-1" />
              {getTimeLeft(reward.expiresAt)}
            </Badge>
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-zinc-100">{reward.name}</CardTitle>
            <p className="text-sm text-zinc-500">{reward.brand}</p>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-yellow-500">{reward.cost} pts</span>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2">
          {reward.stock !== null && (
            <span className={`text-xs font-medium ${reward.stock <= 5 ? 'text-red-400' : 'text-zinc-500'}`}>
              {reward.stock <= 5 && <AlertTriangle className="w-3 h-3 inline mr-1" />}
              Only {reward.stock} left!
            </span>
          )}
          {reward.minLevel > 1 && (
            <span className={`text-xs font-medium ${meetsLevel ? 'text-zinc-500' : 'text-orange-400'}`}>
              {!meetsLevel && <Lock className="w-3 h-3 inline mr-1" />}
              Level {reward.minLevel}+
            </span>
          )}
        </div>
      </CardHeader>
      <CardFooter className="p-4 pt-0">
        <Button
          className={`w-full ${isAvailable ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
          disabled={!isAvailable}
        >
          {!meetsLevel ? (
            <><Lock className="w-4 h-4 mr-2" />Level {reward.minLevel} Required</>
          ) : canAfford ? (
            'Redeem Now'
          ) : (
            'Need More Points'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
