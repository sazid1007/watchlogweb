"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useJournal } from "@/hooks/useJournal";
import { tmdbImageUrl } from "@/lib/tmdb";
import type { MediaEntry } from "@/lib/journal";

type JournalTab = "wishlist" | "watched";

export default function JournalPage() {
  const [activeTab, setActiveTab] = useState<JournalTab>("wishlist");
  const { watchlist, rated } = useJournal();

  return (
    <main className="space-y-5">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Journal</h1>
        <div role="tablist" aria-label="Journal sections" className="mt-4 grid grid-cols-2 border-b border-glass-border">
          <button
            id="wishlist-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "wishlist"}
            aria-controls="wishlist-panel"
            onClick={() => setActiveTab("wishlist")}
            className={`border-b-2 px-3 py-3 text-sm font-semibold transition-colors ${
              activeTab === "wishlist"
                ? "border-accent text-accent"
                : "border-transparent text-foreground-muted"
            }`}
          >
            Wishlist
          </button>
          <button
            id="watched-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "watched"}
            aria-controls="watched-panel"
            onClick={() => setActiveTab("watched")}
            className={`border-b-2 px-3 py-3 text-sm font-semibold transition-colors ${
              activeTab === "watched"
                ? "border-accent text-accent"
                : "border-transparent text-foreground-muted"
            }`}
          >
            Watched
          </button>
        </div>
      </header>

      {activeTab === "wishlist" ? (
        <section id="wishlist-panel" role="tabpanel" aria-labelledby="wishlist-tab">
          {watchlist.length > 0 ? (
            <ul className="space-y-3">
              {watchlist.map((entry) => (
                <li key={`${entry.mediaType}-${entry.id}`}>
                  <JournalWishlistCard entry={entry} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-sm text-foreground-muted">Your wishlist is empty</p>
          )}
        </section>
      ) : (
        <section id="watched-panel" role="tabpanel" aria-labelledby="watched-tab">
          {rated.length > 0 ? (
            <ul className="space-y-3">
              {rated.map((entry) => (
                <li key={`${entry.mediaType}-${entry.id}`}>
                  <JournalRatedCard entry={entry} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-sm text-foreground-muted">
              You haven&apos;t rated anything yet
            </p>
          )}
        </section>
      )}
    </main>
  );
}

function JournalWishlistCard({ entry }: { entry: MediaEntry }) {
  const poster = tmdbImageUrl(entry.posterPath);

  return (
    <Link
      href={`/detail/${entry.mediaType}/${entry.id}`}
      className="flex gap-4 rounded-xl border border-glass-border bg-surface p-3 transition-colors hover:border-accent/60"
    >
      <div className="relative h-[120px] w-[80px] shrink-0 overflow-hidden rounded-md bg-background">
        {poster ? (
          <Image src={poster} alt={entry.title} fill sizes="80px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-foreground-muted">No image</div>
        )}
      </div>
      <div className="min-w-0 flex-1 self-center">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h2 className="min-w-0 text-base font-semibold text-foreground">{entry.title}</h2>
          <span className="rounded border border-glass-border px-1.5 py-0.5 text-[10px] font-medium uppercase text-foreground-muted">
            {entry.mediaType}
          </span>
        </div>
        <p className="text-sm text-foreground-muted">{entry.year || "Year unavailable"}</p>
        <p className="mt-1 line-clamp-2 text-xs text-foreground-muted">
          {entry.genre || "Genre unavailable"}
        </p>
      </div>
    </Link>
  );
}

function JournalRatedCard({ entry }: { entry: MediaEntry }) {
  const poster = tmdbImageUrl(entry.posterPath);

  return (
    <Link
      href={`/detail/${entry.mediaType}/${entry.id}`}
      className="flex items-center gap-4 rounded-xl border border-glass-border bg-surface p-3 transition-colors hover:border-accent/60"
    >
      <div className="relative h-[96px] w-16 shrink-0 overflow-hidden rounded-md bg-background">
        {poster ? (
          <Image src={poster} alt={entry.title} fill sizes="64px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-foreground-muted">No image</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-base font-semibold text-foreground">{entry.title}</h2>
        <p className="mt-2 flex items-center gap-1 text-sm font-semibold text-foreground">
          <span className="text-accent" aria-hidden="true">★</span>
          <span>{entry.rating}/10</span>
        </p>
      </div>
    </Link>
  );
}
