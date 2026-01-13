"use client";

import Link from 'next/link';
import { Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function AdminButton() {
  const { data: session } = useSession();
  
  // RBAC Check: Only show if user has 'admin' role
  const isAdmin = session?.user?.role === 'admin';

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
