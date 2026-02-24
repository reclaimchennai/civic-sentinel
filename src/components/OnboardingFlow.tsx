"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Camera, Trophy, Shield } from "lucide-react";

const STORAGE_KEY = "onboarding_complete";

interface Slide {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const slides: Slide[] = [
  {
    icon: <Camera className="w-12 h-12" />,
    title: "Protect Your City",
    description: "Snap violations, earn points, level up",
    color: "text-yellow-400",
  },
  {
    icon: <Trophy className="w-12 h-12" />,
    title: "Rise Through Ranks",
    description: "Complete challenges, climb leaderboards",
    color: "text-indigo-400",
  },
  {
    icon: <Shield className="w-12 h-12" />,
    title: "Join the Movement",
    description: "Join guilds, earn badges, make impact",
    color: "text-green-400",
  },
];

export default function OnboardingFlow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const slide = slides[currentSlide];
  const isLast = currentSlide === slides.length - 1;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black">
      <div className="w-full max-w-sm px-8 flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="flex flex-col items-center"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            {/* Icon */}
            <motion.div
              className={`mb-6 ${slide.color}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              {slide.icon}
            </motion.div>

            {/* Title */}
            <h2 className="text-2xl font-black text-white mb-2">
              {slide.title}
            </h2>

            {/* Description */}
            <p className="text-zinc-400 text-sm">{slide.description}</p>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="flex items-center gap-2 mt-10 mb-8">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              className={`h-2 rounded-full transition-colors ${
                i === currentSlide ? "bg-white w-6" : "bg-zinc-700 w-2"
              }`}
              layout
            />
          ))}
        </div>

        {/* Action buttons */}
        <div className="w-full space-y-3">
          <Button
            onClick={handleNext}
            className="w-full bg-white text-black hover:bg-zinc-200 font-bold rounded-full h-11"
          >
            {isLast ? "Get Started" : "Next"}
          </Button>

          {!isLast && (
            <Button
              variant="ghost"
              onClick={handleComplete}
              className="w-full text-zinc-500 hover:text-zinc-300 hover:bg-transparent text-sm"
            >
              Skip
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
