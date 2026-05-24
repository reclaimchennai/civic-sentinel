"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin } from "lucide-react";
import { useSession } from "next-auth/react";

type ReportItem = {
  id: string;
  imageUrl: string;
  zone: string;
  category: string;
  createdAt: string;
  endorsements: number;
  userEndorsed: boolean;
};

export default function ReportsBrowsePage() {
  const { data: session } = useSession();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reports?status=approved&limit=50");
      if (res.ok) setReports(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleEndorse = async (report: ReportItem) => {
    if (!session) {
      window.location.href = "/login";
      return;
    }

    // optimistic update
    const optimistic = {
      ...report,
      userEndorsed: !report.userEndorsed,
      endorsements: report.endorsements + (report.userEndorsed ? -1 : 1),
    };
    setReports((prev) => prev.map((r) => (r.id === report.id ? optimistic : r)));

    const method = report.userEndorsed ? "DELETE" : "POST";
    const res = await fetch(`/api/reports/${report.id}/endorse`, { method });
    if (!res.ok) {
      // rollback
      setReports((prev) => prev.map((r) => (r.id === report.id ? report : r)));
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-24 max-w-md mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-black">Community Reports</h1>
        <p className="text-zinc-500 text-sm mt-1">Approved reports across Chennai. Endorse the ones that matter.</p>
      </header>

      {loading ? (
        <p className="text-zinc-500 text-sm">Loading...</p>
      ) : reports.length === 0 ? (
        <p className="text-zinc-500 text-sm">No approved reports yet. Be the first to submit one!</p>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <Card key={r.id} className="bg-zinc-900 border-zinc-800 overflow-hidden">
              <div className="w-full aspect-video bg-zinc-800 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-blue-600 hover:bg-blue-700">{r.category}</Badge>
                  <span className="text-xs text-zinc-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-zinc-400 text-sm mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  {r.zone}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleEndorse(r)}
                  className={
                    r.userEndorsed
                      ? "border-pink-500/40 text-pink-400 hover:bg-pink-500/10"
                      : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  }
                >
                  <Heart className={`w-4 h-4 mr-2 ${r.userEndorsed ? "fill-pink-400" : ""}`} />
                  {r.endorsements} {r.endorsements === 1 ? "endorsement" : "endorsements"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
