import type { MediaType } from "@/lib/types";

export interface MediaEntry {
  id: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  genre: string;
  year: string;
  rating: number;
  reviewText: string;
  isOnWatchlist: boolean;
  dateAdded: string;
}

export const JOURNAL_CHANGED_EVENT = "watchlog:changed";

const STORAGE_KEY = "watchlog:journal";

function readEntries(): MediaEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const entries: unknown = JSON.parse(stored);
    return Array.isArray(entries) ? (entries as MediaEntry[]) : [];
  } catch {
    return [];
  }
}

function writeEntries(entries: MediaEntry[]): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event(JOURNAL_CHANGED_EVENT));
}

function sortByDateAdded(entries: MediaEntry[]): MediaEntry[] {
  return entries.sort((left, right) => right.dateAdded.localeCompare(left.dateAdded));
}

export function getAll(): MediaEntry[] {
  return readEntries();
}

export function getById(id: number): MediaEntry | undefined {
  return readEntries().find((entry) => entry.id === id);
}

export function upsert(entry: MediaEntry): void {
  const entries = readEntries();
  const existingIndex = entries.findIndex((existing) => existing.id === entry.id);

  if (existingIndex === -1) {
    writeEntries([...entries, entry]);
    return;
  }

  entries[existingIndex] = entry;
  writeEntries(entries);
}

export function updateRating(id: number, rating: number, reviewText: string): void {
  const entries = readEntries();
  const entry = entries.find((item) => item.id === id);
  if (!entry) return;

  entry.rating = rating;
  entry.reviewText = reviewText;
  writeEntries(entries.filter((item) => item.isOnWatchlist || item.rating > 0));
}

export function updateWatchlist(id: number, isOnWatchlist: boolean): void {
  const entries = readEntries();
  const entry = entries.find((item) => item.id === id);
  if (!entry) return;

  entry.isOnWatchlist = isOnWatchlist;
  writeEntries(entries.filter((item) => item.isOnWatchlist || item.rating > 0));
}

export function getWatchlist(): MediaEntry[] {
  return sortByDateAdded(readEntries().filter((entry) => entry.isOnWatchlist));
}

export function getRated(): MediaEntry[] {
  return sortByDateAdded(readEntries().filter((entry) => entry.rating > 0));
}

export function clearWatchlist(): void {
  const entries = readEntries();
  if (!entries.some((entry) => entry.isOnWatchlist)) return;

  writeEntries(
    entries
      .map((entry) => ({ ...entry, isOnWatchlist: false }))
      .filter((entry) => entry.rating > 0),
  );
}

export function clearRatings(): void {
  const entries = readEntries();
  if (!entries.some((entry) => entry.rating > 0)) return;

  writeEntries(
    entries
      .map((entry) => ({ ...entry, rating: 0, reviewText: "" }))
      .filter((entry) => entry.isOnWatchlist),
  );
}

export function cleanup(): void {
  const entries = readEntries();
  const retainedEntries = entries.filter(
    (entry) => entry.isOnWatchlist || entry.rating > 0,
  );
  if (retainedEntries.length !== entries.length) writeEntries(retainedEntries);
}