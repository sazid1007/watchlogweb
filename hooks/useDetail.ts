"use client";

import { useEffect, useState } from "react";
import {
  getById,
  upsert,
  updateRating,
  updateWatchlist,
  JOURNAL_CHANGED_EVENT,
  type MediaEntry,
} from "@/lib/journal";
import { getMediaDetail, getSimilarMedia } from "@/lib/tmdb";
import {
  getMediaType,
  getTitle,
  getYear,
  type MediaDetailResponse,
  type MediaResult,
  type MediaType,
} from "@/lib/types";

export interface DetailLocalEntry {
  watchlist: boolean;
  rating: number;
}

const EMPTY_ENTRY: DetailLocalEntry = {
  watchlist: false,
  rating: 0,
};

export function useDetail(mediaType: MediaType, mediaId: number) {
  const [detail, setDetail] = useState<MediaDetailResponse | null>(null);
  const [similar, setSimilar] = useState<MediaResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [localEntry, setLocalEntry] = useState<DetailLocalEntry>(EMPTY_ENTRY);

  useEffect(() => {
    const syncLocalEntry = () => {
      const entry = getById(mediaId);
      setLocalEntry({
        watchlist: entry?.isOnWatchlist ?? false,
        rating: entry?.rating ?? 0,
      });
    };

    window.addEventListener(JOURNAL_CHANGED_EVENT, syncLocalEntry);
    syncLocalEntry();

    return () => window.removeEventListener(JOURNAL_CHANGED_EVENT, syncLocalEntry);
  }, [mediaId]);

  useEffect(() => {
    let isActive = true;

    setIsLoading(true);

    void (async () => {
      try {
        const [detailResponse, similarResponse] = await Promise.all([
          getMediaDetail(mediaType, mediaId),
          getSimilarMedia(mediaType, mediaId),
        ]);

        if (!isActive) return;

        const normalizedSimilar = (similarResponse.results ?? [])
          .filter((item) => item && item.media_type !== "person")
          .map((item) => ({
            ...item,
            media_type: getMediaType(item),
          }));

        setDetail(detailResponse);
        setSimilar(normalizedSimilar);
      } catch (error) {
        console.error(error);
        if (isActive) {
          setDetail(null);
          setSimilar([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isActive = false;
    };
  }, [mediaId, mediaType]);

  const toggleWatchlist = () => {
    if (!detail) return;

    const existing = getById(mediaId);
    const isOnWatchlist = !(existing?.isOnWatchlist ?? localEntry.watchlist);
    const entry: MediaEntry = {
      id: mediaId,
      mediaType,
      title: getTitle(detail) || "Untitled",
      posterPath: detail.poster_path ?? null,
      backdropPath: detail.backdrop_path ?? null,
      genre: (detail.genres ?? []).map((genre) => genre.name).join(", "),
      year: getYear(detail),
      rating: existing?.rating ?? localEntry.rating,
      reviewText: existing?.reviewText ?? "",
      isOnWatchlist,
      dateAdded: existing?.dateAdded ?? new Date().toISOString(),
    };

    if (existing) updateWatchlist(mediaId, isOnWatchlist);
    else upsert(entry);
  };

  const saveRating = (nextRating: number, reviewText?: string) => {
    if (!detail) return;

    const existing = getById(mediaId);
    const entry: MediaEntry = {
      id: mediaId,
      mediaType,
      title: getTitle(detail) || "Untitled",
      posterPath: detail.poster_path ?? null,
      backdropPath: detail.backdrop_path ?? null,
      genre: (detail.genres ?? []).map((genre) => genre.name).join(", "),
      year: getYear(detail),
      rating: existing?.rating ?? 0,
      reviewText: existing?.reviewText ?? "",
      isOnWatchlist: existing?.isOnWatchlist ?? localEntry.watchlist,
      dateAdded: existing?.dateAdded ?? new Date().toISOString(),
    };

    if (existing) {
      updateRating(mediaId, nextRating, reviewText ?? entry.reviewText);
    } else {
      upsert({ ...entry, rating: nextRating, reviewText: reviewText ?? "" });
    }
  };

  return {
    detail,
    similar,
    isLoading,
    localEntry,
    toggleWatchlist,
    saveRating,
  };
}
