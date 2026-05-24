"use client";

import React from 'react';
import * as Icons from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';

const categories = [
  { id: 1, name: 'Traffic Violations', icon: 'TrafficCone', color: 'text-orange-500' },
  { id: 2, name: 'Garbage & Debris', icon: 'Trash2', color: 'text-green-500' },
  { id: 3, name: 'Street Light', icon: 'Lightbulb', color: 'text-yellow-500' },
  { id: 4, name: 'Roads & Footpath', icon: 'Footprints', color: 'text-blue-500' },
  { id: 5, name: 'Water & Drainage', icon: 'Droplets', color: 'text-cyan-500' },
  { id: 6, name: 'Public Health', icon: 'Activity', color: 'text-red-500' },
];

const subCategories: Record<number, string[]> = {
  1: ['No Parking', 'One Way Violation', 'Riding on Footpath', 'Triple Riding', 'Using Mobile Phone', 'Jumping Traffic Signal', 'Without Helmet'],
  2: ['Overflowing Bin', 'Burning Garbage', 'Non-removal of Debris', 'Construction Waste Dumping'],
  3: ['Non burning Street Light', 'Burning in daytime', 'Damaged Pole', 'Low Hanging Wires'],
  4: ['Potholes', 'Damaged Road Surface', 'Illegal Parking on Footpath', 'Shop Encroachment'],
  5: ['Water Stagnation', 'Sewage Overflow', 'Open Manhole', 'Illegal Sewage Discharge'],
  6: ['Mosquito Menace', 'Street Dog Menace', 'Open Defecation', 'Illegal Slaughtering'],
};

export default function CategoryGrid({ onSelect }: { onSelect: (category: string, subCategory: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {categories.map((cat) => {
        const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[cat.icon];
        return (
          <Drawer key={cat.id}>
            <DrawerTrigger asChild>
              <Card className="p-4 bg-zinc-900 border-zinc-800 hover:border-zinc-600 transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 aspect-square">
                <Icon className={`w-8 h-8 ${cat.color}`} />
                <span className="text-zinc-200 text-sm font-medium text-center">{cat.name}</span>
              </Card>
            </DrawerTrigger>
            <DrawerContent className="bg-zinc-900 border-zinc-800">
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle className="text-zinc-100">{cat.name}</DrawerTitle>
                  <DrawerDescription className="text-zinc-400">Select the specific violation</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 grid grid-cols-1 gap-2">
                  {subCategories[cat.id]?.map((sub) => (
                    <DrawerClose key={sub} asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800"
                        onClick={() => onSelect(cat.name, sub)}
                      >
                        {sub}
                      </Button>
                    </DrawerClose>
                  ))}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        );
      })}
    </div>
  );
}
