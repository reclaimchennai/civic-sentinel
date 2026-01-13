"use client";

import React from 'react';
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Gift, ShoppingBag } from 'lucide-react';

const rewards = [
  { id: 1, name: '"Mayor of Chennai" Cap', cost: 500, type: 'merch', brand: 'Chennai Corp', image: '/placeholder_images_coupons/mayor_of_chennai_cap.png' },
  { id: 2, name: '"Civic Sentinel" Badge', cost: 200, type: 'merch', brand: 'Official', image: '/placeholder_images_coupons/civic_sentinel_badge.png' },
  { id: 3, name: 'A2B ₹100 Off Coupon', cost: 300, type: 'coupon', brand: 'A2B', image: '/placeholder_images_coupons/a2b_coupon.png' },
  { id: 4, name: 'Murugan Idli Free Drink', cost: 250, type: 'coupon', brand: 'Murugan Idli', image: '/placeholder_images_coupons/Murugan_idly.jpg' },
  { id: 5, name: 'Saravana Bhavan Coffee', cost: 150, type: 'coupon', brand: 'Saravana Bhavan', image: '/placeholder_images_coupons/saravana_bhavan_coffee.png' },
];

export default function RedeemPage() {
  const { data: session, status } = useSession();
  
  // Dynamic points calculation
  // In a real app, this would come from a DB or the session
  const userPoints = status === "authenticated" && session?.user?.id === "demo-user-001" ? 450 : 0;

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-24 max-w-md mx-auto">
      <header className="py-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase italic">Redeem</h1>
          <p className="text-zinc-400 text-sm">Your rewards for a better city.</p>
        </div>
        {status === "authenticated" && (
          <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-2xl flex items-center space-x-2 animate-in fade-in zoom-in duration-300">
            <span className="text-xl font-bold">🪙 {userPoints}</span>
          </div>
        )}
      </header>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-zinc-900 border-zinc-800 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="merch">Merch</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {rewards.map(reward => <RewardCard key={reward.id} reward={reward} userPoints={userPoints} />)}
        </TabsContent>
        <TabsContent value="merch" className="space-y-4">
          {rewards.filter(r => r.type === 'merch').map(reward => <RewardCard key={reward.id} reward={reward} userPoints={userPoints} />)}
        </TabsContent>
        <TabsContent value="coupons" className="space-y-4">
          {rewards.filter(r => r.type === 'coupon').map(reward => <RewardCard key={reward.id} reward={reward} userPoints={userPoints} />)}
        </TabsContent>
      </Tabs>
    </main>
  );
}

function RewardCard({ reward, userPoints }: { reward: any, userPoints: number }) {
  const canAfford = userPoints >= reward.cost;

  return (
    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
      <div className="h-40 w-full relative">
        <img src={reward.image} alt={reward.name} className="w-full h-full object-cover opacity-80" />
        <Badge className="absolute top-2 right-2 bg-black/60 backdrop-blur-md border-zinc-700">
          {reward.type === 'merch' ? <ShoppingBag className="w-3 h-3 mr-1" /> : <Gift className="w-3 h-3 mr-1" />}
          {reward.type.toUpperCase()}
        </Badge>
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-zinc-100">{reward.name}</CardTitle>
            <p className="text-sm text-zinc-500">{reward.brand}</p>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-zinc-100">🪙 {reward.cost}</span>
          </div>
        </div>
      </CardHeader>
      <CardFooter className="p-4 pt-0">
        <Button 
          className={`w-full ${canAfford ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
          disabled={!canAfford}
        >
          {canAfford ? 'Redeem Now' : 'Need More Points'}
        </Button>
      </CardFooter>
    </Card>
  );
}
