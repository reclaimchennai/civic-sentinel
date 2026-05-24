"use client";

import React, { useState, useEffect } from 'react';
import SmartUploader from '@/components/SmartUploader';
import CategoryGrid from '@/components/CategoryGrid';
import { Button } from '@/components/ui/button';
import { Send, CheckCircle } from 'lucide-react';
import UserHeader from '@/components/UserHeader';
import MissionBanner from '@/components/MissionBanner';
import EventBanner from '@/components/EventBanner';
import ReportEnhancer from '@/components/ReportEnhancer';
import OnboardingFlow from '@/components/OnboardingFlow';
import EncounterPopup from '@/components/EncounterPopup';
import MilestoneCelebration from '@/components/MilestoneCelebration';
import { rollEncounter, type RandomEncounter } from '@/lib/randomEncounters';
import { MILESTONES, type Milestone } from '@/lib/milestones';

type ReportLocation = {
  lat: number;
  lng: number;
  zone?: string;
  ward?: string;
  zone_number?: number;
  zone_name?: string;
};

const MOCK_MISSION = {
  id: "m1",
  title: "Clean Streets Week",
  description: "Help Chennai achieve 500 street cleanliness reports this week",
  icon: "Brush",
  progress: 342,
  target: 500,
  participants: 89,
  endsAt: new Date(Date.now() + 2 * 86400000).toISOString(),
  reward: "2x Points + Clean City Badge"
};

const MOCK_EVENT = {
  id: "ev1",
  title: "Monsoon Readiness Drive",
  description: "Report drainage issues before monsoon season",
  icon: "CloudRain",
  endDate: new Date(Date.now() + 3 * 86400000).toISOString(),
  multiplier: 2,
  targetReports: 1000,
  currentReports: 634,
};

export default function Home() {
  const [reportData, setReportData] = useState<{
    image: File | null;
    location: ReportLocation | null;
    category: string;
    subCategory: string;
    severity: number;
    recurring: boolean;
    notes: string;
  }>({
    image: null,
    location: null,
    category: '',
    subCategory: '',
    severity: 3,
    recurring: false,
    notes: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [encounter, setEncounter] = useState<RandomEncounter | null>(null);
  const [milestone, setMilestone] = useState<Milestone | null>(null);

  const handleSubmit = () => {
    console.log("Submitting Report:", reportData);
    setIsSubmitted(true);

    // Roll for random encounter
    const enc = rollEncounter();
    if (enc) {
      setTimeout(() => setEncounter(enc), 1500);
    }

    // Mock milestone on 1st submit (check localStorage)
    const submitCount = parseInt(localStorage.getItem('cs_submit_count') || '0') + 1;
    localStorage.setItem('cs_submit_count', String(submitCount));
    if (submitCount === 1) {
      const firstStep = MILESTONES.find((m) => m.id === "m1") ?? null;
      if (firstStep) setTimeout(() => setMilestone(firstStep), 2500);
    }

    setTimeout(() => setIsSubmitted(false), 3000);
    setReportData({ image: null, location: null, category: '', subCategory: '', severity: 3, recurring: false, notes: '' });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-green-900/20 rounded-full flex items-center justify-center mb-6 border border-green-500/50">
          <CheckCircle className="w-12 h-12 text-green-500 animate-bounce" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Report Sent!</h1>
        <p className="text-zinc-400">Your contribution is making Chennai better. Points added to your profile.</p>
        <p className="text-yellow-500 font-bold mt-2">+25 XP</p>
        <EncounterPopup encounter={encounter} onDismiss={() => setEncounter(null)} />
        <MilestoneCelebration milestone={milestone} onClose={() => setMilestone(null)} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-40 max-w-md mx-auto">
      <OnboardingFlow />
      <UserHeader />

      <div className="space-y-8">
        {/* Active Mission */}
        <MissionBanner mission={MOCK_MISSION} />

        {/* Active Event */}
        <EventBanner event={MOCK_EVENT} />

        <section>
          <SmartUploader
            onUpload={(data) => setReportData(prev => ({ ...prev, ...data }))}
          />
        </section>

        {reportData.image && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Select Category</h2>
            <CategoryGrid
              onSelect={(cat, sub) => setReportData(prev => ({ ...prev, category: cat, subCategory: sub }))}
            />
          </section>
        )}

        {reportData.image && reportData.subCategory && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ReportEnhancer
              onEnhance={(data) => setReportData(prev => ({ ...prev, ...data }))}
            />
          </section>
        )}

        {reportData.subCategory && (
          <div className="fixed bottom-24 left-6 right-6 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500 z-40">
            <Button
              className="w-full h-16 bg-white text-black hover:bg-zinc-200 text-lg font-bold rounded-2xl shadow-2xl shadow-white/10"
              onClick={handleSubmit}
            >
              <Send className="w-5 h-5 mr-2" />
              File {reportData.subCategory}
            </Button>
          </div>
        )}
      </div>

      <EncounterPopup encounter={encounter} onDismiss={() => setEncounter(null)} />
      <MilestoneCelebration milestone={milestone} onClose={() => setMilestone(null)} />
    </main>
  );
}
