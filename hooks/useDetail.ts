"use client";

import { useEffect, useState } from "react";
import { getMediaDetail, getSimilarMedia } from "@/lib/tmdb";
import {
  getMediaType,
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
    // STAGE 4 HOOK: replace this local state with persisted journal data later.
    setLocalEntry((current) => ({
      ...current,
      watchlist: !current.watchlist,
    }));
  };

  const saveRating = (nextRating: number) => {
    // STAGE 4 HOOK: store this value in the journal layer once persistence lands.
    setLocalEntry((current) => ({
      ...current,
      rating: nextRating,
    }));
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
