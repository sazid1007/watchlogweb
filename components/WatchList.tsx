"use client";

import { useSyncExternalStore } from "react";
import type { MediaResult } from "@/lib/types";
import MediaCard from "@/components/MediaCard";

const EMPTY_LIST: MediaResult[] = [];
let cachedList: MediaResult[] | undefined;

export default function WatchList() {
  const items = useSyncExternalStore(subscribe, getList, () => EMPTY_LIST);
  return items.length ? <div className="poster-grid">{items.map((item) => <MediaCard key={`${item.media_type}-${item.id}`} media={item} />)}</div> : <div className="empty-state"><p className="eyebrow">Your list is quiet</p><h2 className="section-title">Save a title from Home to see it here.</h2></div>;
}

function getList() {
  if (cachedList) return cachedList;
  try {
    cachedList = JSON.parse(localStorage.getItem("watchlog-list") ?? "[]") as MediaResult[];
  } catch {
    cachedList = [];
  }
  return cachedList;
}

function subscribe(onChange: () => void) {
  const handleChange = () => { cachedList = undefined; onChange(); };
  window.addEventListener("watchlog-list-change", handleChange);
  return () => window.removeEventListener("watchlog-list-change", handleChange);
}