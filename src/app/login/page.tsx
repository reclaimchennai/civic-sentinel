"use client";

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Github, Twitter, Apple, Facebook, Mail } from "lucide-react"

export default function LoginPage() {
  const providers = [
    { name: "Google", id: "google", icon: Mail }, // Using Mail as placeholder for Google
    { name: "GitHub", id: "github", icon: Github },
    { name: "Reddit", id: "reddit", icon: null }, // No Reddit icon in standard Lucide set yet?
    { name: "Twitter", id: "twitter", icon: Twitter },
    { name: "Apple", id: "apple", icon: Apple },
    { name: "Facebook", id: "facebook", icon: Facebook },
  ];

  const handleLogin = (providerId: string) => {
    signIn(providerId, { callbackUrl: "/" });
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
          <CardDescription className="text-zinc-400">Sign in to report violations and earn rewards</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {providers.map((provider) => {
            const Icon = provider.icon;
            return (
              <Button
                key={provider.id}
                variant="outline"
                className="w-full justify-start space-x-2 bg-black border-zinc-800 hover:bg-zinc-800 text-white"
                onClick={() => handleLogin(provider.id)}
              >
                {Icon && <Icon className="w-5 h-5" />}
                <span className="flex-1 text-center">Continue with {provider.name}</span>
              </Button>
            );
          })}
        </CardContent>
      </Card>
    </main>
  );
}
