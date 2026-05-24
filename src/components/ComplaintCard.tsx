"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageCircle, MapPin, Smile, Meh, Frown, Send } from "lucide-react";
import { useSession } from "next-auth/react";

export type ComplaintItem = {
  id: string;
  imageUrl: string;
  zone: string;
  category: string;
  status: string;
  createdAt: string;
  lat: number;
  lng: number;
  distanceMeters: number | null;
  authorId: string | null;
  counts: {
    upvotes: number;
    downvotes: number;
    comments: number;
    happy: number;
    neutral: number;
    angry: number;
  };
  viewer: {
    upvoted: boolean;
    downvoted: boolean;
    reaction: "happy" | "neutral" | "angry" | null;
  };
};

type CommentItem = {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
};

const STATUS_STYLES: Record<string, string> = {
  approved: "bg-green-500 text-black",
  resolved: "bg-green-500 text-black",
  pending: "bg-yellow-500 text-black",
  rejected: "bg-red-500/80 text-white",
};

function handleFor(id: string | null): string {
  if (!id) return "@anonymous";
  return "@" + id.replace(/[^A-Za-z0-9]/g, "").slice(0, 14);
}

function formatDistance(m: number | null): string | null {
  if (m == null) return null;
  if (m < 1000) return `${Math.round(m)} m away`;
  return `${(m / 1000).toFixed(1)} km away`;
}

export default function ComplaintCard({ item, onChange }: { item: ComplaintItem; onChange: (next: ComplaintItem) => void }) {
  const { data: session } = useSession();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);

  const requireAuth = (): boolean => {
    if (!session) {
      window.location.href = "/login";
      return false;
    }
    return true;
  };

  const toggleVote = async (direction: "up" | "down") => {
    if (!requireAuth()) return;
    const isCurrent = direction === "up" ? item.viewer.upvoted : item.viewer.downvoted;
    const value = isCurrent ? "clear" : direction;

    // Optimistic
    const next = { ...item, counts: { ...item.counts }, viewer: { ...item.viewer } };
    if (item.viewer.upvoted) {
      next.counts.upvotes -= 1;
      next.viewer.upvoted = false;
    }
    if (item.viewer.downvoted) {
      next.counts.downvotes -= 1;
      next.viewer.downvoted = false;
    }
    if (value === "up") {
      next.counts.upvotes += 1;
      next.viewer.upvoted = true;
    } else if (value === "down") {
      next.counts.downvotes += 1;
      next.viewer.downvoted = true;
    }
    onChange(next);

    const res = await fetch(`/api/reports/${item.id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    if (!res.ok) onChange(item);
  };

  const toggleReaction = async (sentiment: "happy" | "neutral" | "angry") => {
    if (!requireAuth()) return;
    const isCurrent = item.viewer.reaction === sentiment;

    // Optimistic
    const next = { ...item, counts: { ...item.counts }, viewer: { ...item.viewer } };
    if (item.viewer.reaction) {
      next.counts[item.viewer.reaction] = Math.max(0, next.counts[item.viewer.reaction] - 1);
    }
    if (!isCurrent) {
      next.counts[sentiment] += 1;
      next.viewer.reaction = sentiment;
    } else {
      next.viewer.reaction = null;
    }
    onChange(next);

    const res = await fetch(`/api/reports/${item.id}/react`, {
      method: isCurrent ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: isCurrent ? undefined : JSON.stringify({ sentiment }),
    });
    if (!res.ok) onChange(item);
  };

  const loadComments = async () => {
    setCommentsOpen((v) => !v);
    if (commentsLoaded) return;
    const res = await fetch(`/api/reports/${item.id}/comments`);
    if (res.ok) {
      setComments(await res.json());
      setCommentsLoaded(true);
    }
  };

  const postComment = async () => {
    if (!requireAuth()) return;
    const body = draft.trim();
    if (!body) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/reports/${item.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      if (res.ok) {
        const c: CommentItem = await res.json();
        setComments((prev) => [...prev, c]);
        onChange({ ...item, counts: { ...item.counts, comments: item.counts.comments + 1 } });
        setDraft("");
      }
    } finally {
      setPosting(false);
    }
  };

  const distance = formatDistance(item.distanceMeters);
  const created = new Date(item.createdAt).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
      <div className="w-full aspect-video bg-zinc-800 relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
              {handleFor(item.authorId).slice(1, 3).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-zinc-300">{handleFor(item.authorId)}</span>
          </div>
          <Badge className={`${STATUS_STYLES[item.status] ?? "bg-zinc-700 text-white"} hover:opacity-90 capitalize`}>
            {item.status}
          </Badge>
        </div>

        <h3 className="text-base font-bold text-white leading-snug">{item.category}</h3>

        <div className="flex flex-col gap-1 text-zinc-500 text-xs">
          <span className="flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1.5" />
            {item.zone}
            {distance && <span className="ml-2 text-zinc-600">· {distance}</span>}
          </span>
          <span className="ml-5">{created}</span>
        </div>

        {/* Vote & comments row */}
        <div className="flex items-center gap-1 pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleVote("up")}
            className={
              item.viewer.upvoted
                ? "text-green-400 hover:text-green-400"
                : "text-zinc-400 hover:text-green-400"
            }
          >
            <ThumbsUp className={`w-4 h-4 mr-1.5 ${item.viewer.upvoted ? "fill-green-400/30" : ""}`} />
            {item.counts.upvotes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleVote("down")}
            className={
              item.viewer.downvoted
                ? "text-red-400 hover:text-red-400"
                : "text-zinc-400 hover:text-red-400"
            }
          >
            <ThumbsDown className={`w-4 h-4 mr-1.5 ${item.viewer.downvoted ? "fill-red-400/30" : ""}`} />
            {item.counts.downvotes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadComments}
            className="text-zinc-400 hover:text-blue-400 ml-auto"
          >
            <MessageCircle className="w-4 h-4 mr-1.5" />
            {item.counts.comments}
          </Button>
        </div>

        {/* Sentiment reactions */}
        <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
          <span className="text-xs text-zinc-600 uppercase tracking-wider">Feedback</span>
          <button
            onClick={() => toggleReaction("happy")}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
              item.viewer.reaction === "happy"
                ? "bg-green-500/20 text-green-400"
                : "text-zinc-500 hover:bg-zinc-800"
            }`}
          >
            <Smile className="w-4 h-4" />
            {item.counts.happy}
          </button>
          <button
            onClick={() => toggleReaction("neutral")}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
              item.viewer.reaction === "neutral"
                ? "bg-blue-500/20 text-blue-400"
                : "text-zinc-500 hover:bg-zinc-800"
            }`}
          >
            <Meh className="w-4 h-4" />
            {item.counts.neutral}
          </button>
          <button
            onClick={() => toggleReaction("angry")}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
              item.viewer.reaction === "angry"
                ? "bg-red-500/20 text-red-400"
                : "text-zinc-500 hover:bg-zinc-800"
            }`}
          >
            <Frown className="w-4 h-4" />
            {item.counts.angry}
          </button>
        </div>

        {/* Comments thread */}
        {commentsOpen && (
          <div className="pt-3 border-t border-zinc-800 space-y-2">
            {comments.length === 0 ? (
              <p className="text-xs text-zinc-600 italic">No comments yet. Be the first to weigh in.</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="text-xs space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-300">{handleFor(c.authorId)}</span>
                    <span className="text-zinc-600">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-zinc-400">{c.body}</p>
                </div>
              ))
            )}
            <div className="flex items-center gap-2 pt-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Add a note..."
                maxLength={500}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                onKeyDown={(e) => {
                  if (e.key === "Enter") postComment();
                }}
              />
              <Button size="sm" variant="ghost" onClick={postComment} disabled={posting || draft.trim().length === 0}>
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
