"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Check, X, Menu, MapPin, Undo2 } from 'lucide-react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Mock Data Type
interface Report {
  id: string;
  imageUrl: string;
  zone: string;
  category: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Initial Mock Data
const initialReports: Report[] = [
  { id: '1', imageUrl: '/placeholder_images_violations/car_parked_xing.jpg', zone: 'T. Nagar', category: 'No Parking', description: 'Car parked on zebra crossing.', status: 'pending' },
  { id: '2', imageUrl: '/placeholder_images_violations/overflowing_garbage.png', zone: 'Adyar', category: 'Garbage', description: 'Overflowing bin near bus stop.', status: 'pending' },
  { id: '3', imageUrl: '/placeholder_images_violations/deep_pothole.png', zone: 'Anna Nagar', category: 'Pothole', description: 'Deep pothole in main road.', status: 'pending' },
  { id: '4', imageUrl: '/placeholder_images_violations/water_stangant.jpg', zone: 'Velachery', category: 'Water', description: 'Stagnant water near school.', status: 'pending' },
];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [history, setHistory] = useState<Report[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading" || status === "unauthenticated" || (session?.user?.role !== "admin")) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">Loading...</div>;
  }

  // We only care about the first pending report for the swipe card
  const pendingReports = reports.filter(r => r.status === 'pending');
  const currentReport = pendingReports[0];

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    // Remove from main list
    setReports(prev => prev.filter(r => r.id !== id));
    
    // Add to history
    const processedReport = reports.find(r => r.id === id);
    if (processedReport) {
      setHistory(prev => [{ ...processedReport, status: action }, ...prev]);
    }
  };

  const handleUndo = (id: string) => {
    const reportToUndo = history.find(r => r.id === id);
    if (reportToUndo) {
      setHistory(prev => prev.filter(r => r.id !== id));
      // Add back to pending
      setReports(prev => [...prev, { ...reportToUndo, status: 'pending' }]);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-24 max-w-md mx-auto flex flex-col overflow-hidden">
      <header className="flex justify-between items-center mb-6 z-10">
        <h1 className="text-xl font-bold uppercase tracking-widest text-zinc-400">Moderation</h1>
        
        {/* History / Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-zinc-900 border-zinc-800 text-white w-full max-w-sm z-50">
            <SheetHeader>
              <SheetTitle className="text-white">Moderation History</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              {history.length === 0 ? (
                <p className="text-zinc-500 text-sm">No actions taken yet.</p>
              ) : (
                history.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 border border-zinc-800 rounded-lg bg-black/40">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${item.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="font-medium text-sm">{item.category}</p>
                        <p className="text-xs text-zinc-500">{item.zone}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleUndo(item.id)}>
                      <Undo2 className="w-4 h-4 text-zinc-400" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Card Stack */}
      <div className="flex-1 flex flex-col justify-center relative">
        {currentReport ? (
          <div className="relative w-full h-[600px] flex items-center justify-center">
             {/* Background Cards (Visual Stack Effect) */}
             {pendingReports.length > 1 && (
               <div className="absolute top-4 scale-95 opacity-50 w-full h-full z-0">
                 <Card className="bg-zinc-800 border-zinc-700 w-full h-full rounded-3xl" />
               </div>
             )}
             
            <SwipeCard 
              key={currentReport.id} 
              report={currentReport} 
              onSwipe={(dir) => handleAction(currentReport.id, dir === 'right' ? 'approved' : 'rejected')} 
            />
          </div>
        ) : (
          <div className="text-center space-y-4 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto border border-zinc-800">
              <Check className="w-10 h-10 text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold">All Caught Up!</h3>
            <p className="text-zinc-500">No pending reports to review.</p>
          </div>
        )}
      </div>
      
      {/* Instructional Hint */}
      {currentReport && (
        <div className="flex justify-between px-12 text-zinc-600 text-xs uppercase tracking-widest font-bold mt-8">
          <span>Reject</span>
          <span>Approve</span>
        </div>
      )}
    </main>
  );
}

function SwipeCard({ report, onSwipe }: { report: Report, onSwipe: (direction: 'left' | 'right') => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // Dynamic Background Color based on drag
  const bg = useTransform(x, [-150, 0, 150], ["rgba(239, 68, 68, 0.2)", "rgba(24, 24, 27, 1)", "rgba(34, 197, 94, 0.2)"]);
  const borderColor = useTransform(x, [-150, 0, 150], ["rgba(239, 68, 68, 0.5)", "rgba(39, 39, 42, 1)", "rgba(34, 197, 94, 0.5)"]);

  // Overlay Icons
  const checkOpacity = useTransform(x, [50, 150], [0, 1]);
  const crossOpacity = useTransform(x, [-50, -150], [0, 1]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute w-full h-full z-10 cursor-grab active:cursor-grabbing"
      whileTap={{ scale: 1.05 }}
    >
      <motion.div style={{ backgroundColor: bg, borderColor: borderColor }} className="w-full h-full rounded-3xl overflow-hidden border-2 relative flex flex-col">
        {/* Overlay Icons for visual feedback */}
        <motion.div style={{ opacity: checkOpacity }} className="absolute top-8 left-8 z-20 bg-green-500 rounded-full p-2">
            <Check className="w-8 h-8 text-black" />
        </motion.div>
        <motion.div style={{ opacity: crossOpacity }} className="absolute top-8 right-8 z-20 bg-red-500 rounded-full p-2">
            <X className="w-8 h-8 text-black" />
        </motion.div>

        {/* Image */}
        <div className="h-3/4 relative">
          <img src={report.imageUrl} alt="Report" className="w-full h-full object-cover pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none" />
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col justify-end bg-zinc-900/50 backdrop-blur-sm">
           <Badge className="self-start mb-2 bg-blue-600 hover:bg-blue-700 pointer-events-none">{report.category}</Badge>
           <h2 className="text-2xl font-bold text-white mb-1 pointer-events-none">{report.description}</h2>
           <div className="flex items-center text-zinc-400 text-sm pointer-events-none">
             <MapPin className="w-4 h-4 mr-1" />
             {report.zone}
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
}