"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, Trophy, Gift, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminButton from './AdminButton';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Report', href: '/', icon: Camera },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Redeem', href: '/redeem', icon: Gift },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-zinc-800 px-6 py-4 flex justify-between items-center z-50 max-w-md mx-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link 
            key={item.name} 
            href={item.href}
            className={cn(
              "flex flex-col items-center space-y-1 transition-colors",
              isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <Icon className={cn("w-6 h-6", isActive && "animate-pulse")} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
          </Link>
        );
      })}
      <AdminButton />
    </nav>
  );
}
