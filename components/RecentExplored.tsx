"use client";

import { useSyncExternalStore } from "react";
import type { MediaResult } from "@/lib/types";
import MediaCard from "@/components/MediaCard";

const SERVER_ITEMS: MediaResult[] = [];
let recentSnapshot: MediaResult[] | undefined;

export default function RecentExplored() {
  const items = useSyncExternalStore(subscribeToStorage, getRecentItems, getServerItems);

  if (!items.length) return null;

  return (
    <section className="mt-14">
      <div className="mb-4 flex items-end justify-between"><div><p className="eyebrow">Your trail</p><h2 className="section-title">Continue Exploring</h2></div><span className="text-xs text-foreground-muted">{items.length} saved</span></div>
      <div className="poster-grid">{items.slice(0, 6).map((item) => <MediaCard key={`${item.media_type}-${item.id}`} media={item} />)}</div>
    </section>
  );
}

function getRecentItems(): MediaResult[] {
  if (recentSnapshot) return recentSnapshot;
  try {
    const cookie = document.cookie.split("; ").find((item) => item.startsWith("watchlog-recent="));
    recentSnapshot = cookie ? JSON.parse(decodeURIComponent(cookie.split("=")[1])) as MediaResult[] : [];
  } catch {
    recentSnapshot = [];
  }
  return recentSnapshot;
}

function getServerItems(): MediaResult[] {
  return SERVER_ITEMS;
}

function subscribeToStorage(onStoreChange: () => void) {
  const handleChange = () => {
    recentSnapshot = undefined;
    onStoreChange();
  };
  window.addEventListener("watchlog-recent-change", handleChange);
  return () => window.removeEventListener("watchlog-recent-change", handleChange);
}