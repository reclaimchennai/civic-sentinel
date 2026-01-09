"use client";

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Github, Twitter, Apple, Facebook, Mail, UserCircle2 } from "lucide-react"

export default function LoginPage() {
  const providers = [
    { name: "Demo User", id: "credentials", icon: UserCircle2, variant: "default" },
    { name: "Google", id: "google", icon: Mail, variant: "outline" },
    { name: "GitHub", id: "github", icon: Github, variant: "outline" },
    { name: "Reddit", id: "reddit", icon: null, variant: "outline" },
    { name: "Twitter", id: "twitter", icon: Twitter, variant: "outline" },
    { name: "Apple", id: "apple", icon: Apple, variant: "outline" },
    { name: "Facebook", id: "facebook", icon: Facebook, variant: "outline" },
  ];

  const handleLogin = (providerId: string) => {
    if (providerId === "credentials") {
      // For credentials, we trigger the signIn flow which might need a dummy input
      // or simply rely on the authorize function returning the user immediately.
      signIn("credentials", { username: "demo", callbackUrl: "/" });
    } else {
      signIn(providerId, { callbackUrl: "/" });
    }
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
                variant={provider.variant as any}
                className={`w-full justify-start space-x-2 ${
                  provider.variant === 'default' 
                    ? 'bg-white text-black hover:bg-zinc-200' 
                    : 'bg-black border-zinc-800 hover:bg-zinc-800 text-white'
                }`}
                onClick={() => handleLogin(provider.id)}
              >
                {Icon && <Icon className="w-5 h-5" />}
                <span className="flex-1 text-center font-bold">
                  {provider.id === 'credentials' ? 'Try Demo Account' : `Continue with ${provider.name}`}
                </span>
              </Button>
            );
          })}
        </CardContent>
      </Card>
    </main>
  );
}
