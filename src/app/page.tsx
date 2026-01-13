"use client";

import React, { useState } from 'react';
import SmartUploader from '@/components/SmartUploader';
import CategoryGrid from '@/components/CategoryGrid';
import { Button } from '@/components/ui/button';
import { Send, CheckCircle } from 'lucide-react';
import UserHeader from '@/components/UserHeader';

export default function Home() {
  const [reportData, setReportData] = useState<{
    image: File | null;
    location: any;
    category: string;
    subCategory: string;
  }>({
    image: null,
    location: null,
    category: '',
    subCategory: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    // Mock Submission
    console.log("Submitting Report:", reportData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    // Reset after some time
    setReportData({ image: null, location: null, category: '', subCategory: '' });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-green-900/20 rounded-full flex items-center justify-center mb-6 border border-green-500/50">
          <CheckCircle className="w-12 h-12 text-green-500 animate-bounce" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Report Sent!</h1>
        <p className="text-zinc-400">Your contribution is making Chennai better. Points added to your profile.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-40 max-w-md mx-auto">
      <UserHeader />

      <div className="space-y-8">
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

            </main>

          );

        }

        