"use client";

import { useSyncExternalStore } from "react";
import { getById, upsert, updateRating, updateWatchlist, JOURNAL_CHANGED_EVENT, type MediaEntry } from "@/lib/journal";
import type { MediaResult } from "@/lib/types";
import { getTitle, getYear } from "@/lib/types";

const EMPTY_STATE = { saved: false, rating: 0 };
const snapshots = new Map<number, { saved: boolean; rating: number }>();

export default function DetailActions({ media, title }: { media: MediaResult; title: string }) {
  const state = useSyncExternalStore((onChange) => subscribe(media.id, onChange), () => getState(media.id), () => EMPTY_STATE);

  function saveForLater() {
    const existing = getById(media.id);
    const entry = toEntry(media, existing);
    if (existing) updateWatchlist(media.id, !existing.isOnWatchlist);
    else upsert({ ...entry, isOnWatchlist: true });
  }

  function saveRating(value: number) {
    const existing = getById(media.id);
    if (existing) updateRating(media.id, value, existing.reviewText);
    else upsert({ ...toEntry(media), rating: value });
  }

  return <div className="detail-actions"><button type="button" className={`action-button ${state.saved ? "action-button-active" : ""}`} onClick={saveForLater}>{state.saved ? "Remove from My List" : "Save to watch later"}</button><label className="rating-control">Rate <select aria-label={`Rate ${title}`} value={state.rating} onChange={(event) => saveRating(Number(event.target.value))}><option value={0}>—</option>{Array.from({ length: 10 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}/10</option>)}</select></label></div>;
}

function toEntry(media: MediaResult, existing?: MediaEntry): MediaEntry {
  return { id: media.id, mediaType: media.media_type === "tv" ? "tv" : "movie", title: getTitle(media), posterPath: media.poster_path ?? null, backdropPath: media.backdrop_path ?? null, genre: "", year: getYear(media), rating: existing?.rating ?? 0, reviewText: existing?.reviewText ?? "", isOnWatchlist: existing?.isOnWatchlist ?? false, dateAdded: existing?.dateAdded ?? new Date().toISOString() };
}

function getState(id: number) {
  const cached = snapshots.get(id);
  if (cached) return cached;
  const entry = getById(id);
  const state = { saved: entry?.isOnWatchlist ?? false, rating: entry?.rating ?? 0 };
  snapshots.set(id, state);
  return state;
}

function subscribe(id: number, onChange: () => void) {
  const handleChange = () => { snapshots.delete(id); onChange(); };
  window.addEventListener(JOURNAL_CHANGED_EVENT, handleChange);
  return () => window.removeEventListener(JOURNAL_CHANGED_EVENT, handleChange);
}