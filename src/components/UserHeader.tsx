"use client";

import React from 'react';
import Link from 'next/link';
import { useSession, signOut, signIn } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { User, LogOut, Settings, PlayCircle } from 'lucide-react';

export default function UserHeader() {
  const { data: session, status } = useSession();

  return (
    <header className="py-8 flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white uppercase italic">
          Chennai <span className="text-zinc-500">Sentinel</span>
        </h1>
        <p className="text-zinc-400 text-sm">Snap. Click. Done.</p>
      </div>

      <div>
        {status === "authenticated" ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer border-2 border-zinc-800 hover:border-white transition-colors">
                <AvatarImage src={session.user?.image || ''} />
                <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold">
                  {session.user?.name?.slice(0, 2).toUpperCase() || 'CS'}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800 text-white" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                  <p className="text-xs leading-none text-zinc-500">{session.user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem asChild className="focus:bg-zinc-800 focus:text-white cursor-pointer">
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem 
                className="focus:bg-red-900/50 focus:text-red-400 text-red-500 cursor-pointer"
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white hidden sm:flex"
              onClick={() => signIn("credentials", { username: "demo", callbackUrl: "/profile" })}
            >
              <PlayCircle className="w-4 h-4 mr-2 text-yellow-500" />
              Try Demo
            </Button>
            <Button asChild variant="secondary" size="sm" className="rounded-full">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
