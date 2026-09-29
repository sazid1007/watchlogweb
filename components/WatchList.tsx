"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { getRated, getWatchlist, JOURNAL_CHANGED_EVENT, type MediaEntry } from "@/lib/journal";
import { imageUrl } from "@/lib/tmdb";

const EMPTY: MediaEntry[] = [];
let snapshot: { wishlist: MediaEntry[]; rated: MediaEntry[] } | undefined;

export default function WatchList() {
  const [active, setActive] = useState<"wishlist" | "rated">("wishlist");
  const entries = useSyncExternalStore(subscribe, getEntries, () => ({ wishlist: EMPTY, rated: EMPTY }));
  const items = active === "wishlist" ? entries.wishlist : entries.rated;

  return <div className="space-y-6"><div className="journal-tabs" role="tablist" aria-label="My List sections"><button type="button" role="tab" aria-selected={active === "wishlist"} className={active === "wishlist" ? "journal-tab-active" : ""} onClick={() => setActive("wishlist")}>Wishlist <span>{entries.wishlist.length}</span></button><button type="button" role="tab" aria-selected={active === "rated"} className={active === "rated" ? "journal-tab-active" : ""} onClick={() => setActive("rated")}>Rated <span>{entries.rated.length}</span></button></div>{items.length ? <div className="poster-grid">{items.map((entry) => <JournalCard key={`${entry.mediaType}-${entry.id}`} entry={entry} />)}</div> : <div className="empty-state"><p className="eyebrow">{active === "wishlist" ? "Your wishlist is quiet" : "Nothing rated yet"}</p><h2 className="section-title">{active === "wishlist" ? "Save a title from Home to see it here." : "Rate a title to build your rated shelf."}</h2></div>}</div>;
}

function getEntries() {
  if (snapshot) return snapshot;
  snapshot = { wishlist: getWatchlist(), rated: getRated() };
  return snapshot;
}

function subscribe(onChange: () => void) {
  const handleChange = () => { snapshot = undefined; onChange(); };
  window.addEventListener(JOURNAL_CHANGED_EVENT, handleChange);
  return () => window.removeEventListener(JOURNAL_CHANGED_EVENT, handleChange);
}

function JournalCard({ entry }: { entry: MediaEntry }) {
  const poster = imageUrl(entry.posterPath, "w342");
  return <Link href={`/detail/${entry.mediaType}/${entry.id}`} className="group block min-w-0"><div className="relative aspect-[2/3] overflow-hidden rounded-[4px] bg-surface">{poster ? <Image src={poster} alt={entry.title} fill sizes="(max-width: 700px) 42vw, 16vw" className="object-cover transition duration-500 group-hover:scale-105" /> : null}</div><div className="mt-2 flex items-center justify-between gap-2 text-xs text-foreground-muted"><span className="truncate">{entry.title}</span>{entry.rating > 0 ? <span className="rating-star">★ {entry.rating}</span> : null}</div></Link>;
}