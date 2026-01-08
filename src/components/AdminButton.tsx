"use client";

import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminButton() {
  // In a real app, check auth/role here.
  // For prototype, we'll just show it or maybe toggle it.
  const isAdmin = true; 

  if (!isAdmin) return null;

  return (
    <Link href="/admin">
      <div className="flex flex-col items-center space-y-1 text-zinc-500 hover:text-zinc-300 transition-colors">
        <Shield className="w-6 h-6" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Admin</span>
      </div>
    </Link>
  );
}
