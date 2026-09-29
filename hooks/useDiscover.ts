"use client";

/* --------------------------------------------------------------------------
   Discover screen — state + behavior
   --------------------------------------------------------------------------
   All TMDB fetching for the Discover screen lives here; components only
   render what the hook returns.

   Lists the hook produces:
   - trending (local): the day's trending titles minus the "Watch Next" row,
     so the two never show the same item twice.
   - watch next: trending titles rated >= 7, deterministically shuffled with
     the current calendar date as the seed (stable for the whole day).
   - search / category: remote lists that replace the local trending filter
     while active, and are restored when the query is cleared.
   -------------------------------------------------------------------------- */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  discoverByGenre,
  discoverByKeyword,
  getPersonCredits,
  getTrending,
  searchMedia,
} from "@/lib/tmdb";
import { getMediaType, type MediaResult, type PersonCombinedCredits } from "@/lib/types";

/** Debounce applied to the search box before hitting TMDB. */
const SEARCH_DEBOUNCE_MS = 300;

/** Watch Next picks: highly rated titles, reshuffled once per calendar day. */
const WATCH_NEXT_MIN_RATING = 7;
const WATCH_NEXT_COUNT = 10;

/* Categories ---------------------------------------------------------------- */

export const GENRE_IDS = {
  Action: 28,
  Drama: 18,
  Comedy: 35,
  Science: 878,
  Horror: 27,
} as const;

export type CategoryName = "All" | keyof typeof GENRE_IDS;

/** Chip order on the Discover screen: `All` first, then the genre-backed ones. */
export const CATEGORIES: CategoryName[] = [
  "All",
  "Action",
  "Drama",
  "Comedy",
  "Science",
  "Horror",
];

/* Which list currently owns the results -------------------------------------- */

/**
 * `trending` — the local trending filter (initial load, cleared query, "All").
 * `remote`   — a search / genre / credits fetch that should win over trending.
 */
type ListSource = "trending" | "remote";

/* Hook ----------------------------------------------------------------------- */

export function useDiscover() {
  const [results, setResults] = useState<MediaResult[]>([]);
  const [watchNextResults, setWatchNextResults] = useState<MediaResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQueryState] = useState("");
  const [selectedCategory, setSelectedCategoryState] = useState<CategoryName>("All");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  /** Ticked by every new list request so stale responses can be dropped. */
  const sequenceRef = useRef(0);
  const listSourceRef = useRef<ListSource>("trending");
  const trendingRef = useRef<{ main: MediaResult[] } | null>(null);
  const selectedCategoryRef = useRef<CategoryName>("All");

  /** Fetch a list and publish it unless a newer request has taken over. */
  const runRemote = useCallback(async (task: () => Promise<MediaResult[]>) => {
    listSourceRef.current = "remote";
    const sequence = ++sequenceRef.current;
    setIsLoading(true);

    try {
      const items = await task();
      if (sequence === sequenceRef.current && listSourceRef.current === "remote") {
        setResults(items);
        setIsLoading(false);
      }
    } catch (error) {
      if (sequence === sequenceRef.current && listSourceRef.current === "remote") {
        console.error(error);
        setResults([]);
        setIsLoading(false);
      }
    }
  }, []);

  /** Hand the list back to the local trending filter (query cleared / "All"). */
  const restoreTrendingList = useCallback(() => {
    listSourceRef.current = "trending";
    sequenceRef.current += 1;

    const trending = trendingRef.current;
    if (trending) {
      setResults(trending.main);
      setIsLoading(false);
    } else {
      // Initial trending fetch still running — let it fill the list.
      setIsLoading(true);
    }
  }, []);

  /**
   * Controlled input handler: stores the raw query and drops straight back to
   * the "All" category — a query always wins over a selected genre.
   */
  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);
    if (query.trim()) {
      selectedCategoryRef.current = "All";
      setSelectedCategoryState("All");
    }
  }, []);

  /* 1. Initial load: trending + the day's "Watch Next" row. */
  useEffect(() => {
    void (async () => {
      try {
        const trending = await getTrending();
        const media = normalizeMedia(trending.results);
        const watchNext = pickWatchNext(media, todayKey());
        const watchNextKeys = new Set(watchNext.map(listKey));
        const main = media.filter((item) => !watchNextKeys.has(listKey(item)));

        trendingRef.current = { main };
        setWatchNextResults(watchNext);

        if (listSourceRef.current === "trending") {
          setResults(main);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
        if (listSourceRef.current === "trending") {
          setResults([]);
          setIsLoading(false);
        }
      }
    })();
  }, []);

  /* 2. Debounce the raw input. */
  useEffect(() => {
    const nextQuery = searchQuery.trim();
    const timer = window.setTimeout(
      () => setDebouncedQuery(nextQuery),
      SEARCH_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  /* 3. Run the search, or restore trending when the query goes blank. */
  useEffect(() => {
    const query = debouncedQuery;

    if (!query) {
      // A selected category keeps owning the list while the input clears.
      if (selectedCategoryRef.current !== "All") return;
      restoreTrendingList();
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    searchMedia(query).then(
      (response) => {
        const first = response.results[0];

        // Searching an actor name: show their filmography instead of the list.
        if (first?.media_type === "person") {
          void searchByPerson(first.id, first.name ?? "").then(
            (credits) => {
              setResults(credits);
              setIsLoading(false);
            },
          );
          return;
        }

        setResults(normalizeMedia(response.results));
        setIsLoading(false);
      },
      (error) => {
        console.error(error);
        setResults([]);
        setIsLoading(false);
      },
    );
  }, [debouncedQuery, restoreTrendingList, setIsLoading]);

  /** Chip click: pick a genre (or back to "All") and clear any active search. */
  const selectCategory = useCallback(
    (category: CategoryName) => {
      selectedCategoryRef.current = category;
      setSelectedCategoryState(category);
      setSearchQueryState("");

      if (category === "All") {
        restoreTrendingList();
        return;
      }

      const genreId = GENRE_IDS[category];
      void runRemote(async () => {
        const response = await discoverByGenre(genreId);
        return normalizeMedia(response.results);
      });
    },
    [restoreTrendingList, runRemote],
  );

  return {
    results,
    watchNextResults,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    selectCategory,
    searchByPerson,
    searchByTag,
  };
}

/* Exported for the actor / tag screens (later stages) ------------------------- */

/**
 * The full filmography of one person: combined credits, de-duplicated by
 * media type + id. `personName` only appears in the sanity-check message.
 */
export async function searchByPerson(
  personId: number,
  personName: string,
): Promise<MediaResult[]> {
  const credits = await getPersonCredits(personId);

  if (credits.id !== personId) {
    throw new Error(
      `TMDB returned credits for person ${credits.id} instead of ${personId} ("${personName}").`,
    );
  }

  return mergePersonCredits(credits);
}

/**
 * Titles matching one keyword ("tag"): movies and TV shows fetched separately
 * by the same keyword id, then concatenated. `tagName` only appears in the
 * sanity-check message.
 */
export async function searchByTag(
  tagId: number,
  tagName: string,
): Promise<MediaResult[]> {
  if (!Number.isInteger(tagId)) {
    throw new Error(`searchByTag: "${tagName}" has no valid keyword id (${tagId}).`);
  }

  const [movies, tv] = await Promise.all([
    discoverByKeyword("movie", tagId),
    discoverByKeyword("tv", tagId),
  ]);

  return normalizeMedia([...movies.results, ...tv.results]);
}

/* Helpers ---------------------------------------------------------------------- */

/** Drop people and stamp an explicit `media_type` (discover results omit it). */
function normalizeMedia(items: MediaResult[]): MediaResult[] {
  return items
    .filter((item) => item.media_type !== "person")
    .map((item) => ({ ...item, media_type: getMediaType(item) }));
}

/** Stable identity for list items: movie 123 and tv 123 are different titles. */
function listKey(item: MediaResult): string {
  return `${getMediaType(item)}-${item.id}`;
}

/** Cast + crew of a person, de-duplicated by media type + id. */
function mergePersonCredits(credits: PersonCombinedCredits): MediaResult[] {
  return normalizeMedia([...(credits.cast ?? []), ...(credits.crew ?? [])]).filter(
    (item, index, items) =>
      items.findIndex((other) => listKey(other) === listKey(item)) === index,
  );
}

/** Watch Next: rated titles, shuffled with the date as seed, first 10. */
function pickWatchNext(items: MediaResult[], seedDate: string): MediaResult[] {
  const eligible = items.filter((item) => (item.vote_average ?? 0) >= WATCH_NEXT_MIN_RATING);
  return shuffleBySeed(eligible, hashSeed(seedDate)).slice(0, WATCH_NEXT_COUNT);
}

/** Local calendar date, e.g. "2026-09-29" — the shuffle seed for the day. */
function todayKey(date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** FNV-1a: turn the date key into a 32-bit integer seed. */
function hashSeed(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** mulberry32: tiny deterministic PRNG. */
function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates shuffle driven by a seeded PRNG (same seed → same order). */
function shuffleBySeed<T>(items: T[], seed: number): T[] {
  const random = mulberry32(seed);
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapWith]] = [shuffled[swapWith], shuffled[index]];
  }

  return shuffled;
}
