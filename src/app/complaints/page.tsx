"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import ComplaintCard, { type ComplaintItem } from "@/components/ComplaintCard";
import { ArrowLeft, MapPinOff, Loader2 } from "lucide-react";
import Link from "next/link";

type Scope = "nearby" | "city" | "mine";

export default function ComplaintsPage() {
  const { status } = useSession();
  const [scope, setScope] = useState<Scope>("city");
  const [items, setItems] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locError, setLocError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocError("Your browser does not support geolocation.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocError(null);
      },
      (err) => setLocError(err.message || "Could not get your location."),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  // Trigger location request when nearby tab is selected without coords.
  useEffect(() => {
    if (scope === "nearby" && !coords && !locError) requestLocation();
  }, [scope, coords, locError, requestLocation]);

  const load = useCallback(
    async (targetScope: Scope) => {
      let url = `/api/reports?scope=${targetScope}&limit=50`;
      if (targetScope === "nearby") {
        if (!coords) return; // wait for geolocation
        url += `&lat=${coords.lat}&lng=${coords.lng}&radius=2000`;
      }
      setLoading(true);
      try {
        const res = await fetch(url);
        if (res.ok) setItems(await res.json());
        else if (res.status === 401) setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [coords]
  );

  useEffect(() => {
    load(scope);
  }, [load, scope]);

  const updateOne = (next: ComplaintItem) => {
    setItems((prev) => prev.map((p) => (p.id === next.id ? next : p)));
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-24 max-w-md mx-auto">
      <header className="flex items-center mb-6">
        <Link href="/profile" className="text-zinc-400 hover:text-white mr-3">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold">View All Complaints</h1>
      </header>

      <Tabs value={scope} onValueChange={(v) => setScope(v as Scope)} className="w-full">
        <TabsList className="grid grid-cols-3 bg-zinc-900 border border-zinc-800 mb-6">
          <TabsTrigger value="nearby">Nearby</TabsTrigger>
          <TabsTrigger value="city">City</TabsTrigger>
          <TabsTrigger value="mine">Yours</TabsTrigger>
        </TabsList>

        <TabsContent value="nearby" className="space-y-4">
          {!coords && !locError && (
            <div className="flex items-center justify-center py-12 text-zinc-500 text-sm">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Getting your location...
            </div>
          )}
          {locError && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MapPinOff className="w-8 h-8 text-zinc-600 mb-3" />
              <p className="text-zinc-500 text-sm mb-1">Location unavailable</p>
              <p className="text-zinc-600 text-xs mb-4">{locError}</p>
              <button
                onClick={requestLocation}
                className="text-xs text-blue-400 hover:text-blue-300 underline"
              >
                Try again
              </button>
            </div>
          )}
          {coords && <ComplaintList loading={loading} items={items} onChange={updateOne} emptyText="No reports within 2 km of you yet." />}
        </TabsContent>

        <TabsContent value="city">
          <ComplaintList loading={loading} items={items} onChange={updateOne} emptyText="No approved reports in Chennai yet." />
        </TabsContent>

        <TabsContent value="mine">
          {status === "unauthenticated" ? (
            <div className="text-center py-12">
              <p className="text-zinc-500 text-sm mb-3">Log in to see your reports.</p>
              <Link href="/login" className="text-blue-400 hover:text-blue-300 underline text-sm">
                Log in
              </Link>
            </div>
          ) : (
            <ComplaintList loading={loading} items={items} onChange={updateOne} emptyText="You have not filed any reports yet." />
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}

function ComplaintList({
  loading,
  items,
  onChange,
  emptyText,
}: {
  loading: boolean;
  items: ComplaintItem[];
  onChange: (next: ComplaintItem) => void;
  emptyText: string;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-zinc-500 text-sm">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading...
      </div>
    );
  }
  if (items.length === 0) {
    return <p className="text-center text-zinc-500 text-sm py-12">{emptyText}</p>;
  }
  return (
    <div className="space-y-4">
      {items.map((it) => (
        <ComplaintCard key={it.id} item={it} onChange={onChange} />
      ))}
    </div>
  );
}
