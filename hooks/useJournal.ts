"use client";

import { useEffect, useState } from "react";
import {
  getRated,
  getWatchlist,
  JOURNAL_CHANGED_EVENT,
  type MediaEntry,
} from "@/lib/journal";

export function useJournal() {
  const [watchlist, setWatchlist] = useState<MediaEntry[]>([]);
  const [rated, setRated] = useState<MediaEntry[]>([]);

  useEffect(() => {
    const refresh = () => {
      setWatchlist(getWatchlist());
      setRated(getRated());
    };

    window.addEventListener(JOURNAL_CHANGED_EVENT, refresh);
    refresh();

    return () => window.removeEventListener(JOURNAL_CHANGED_EVENT, refresh);
  }, []);

  return { watchlist, rated };
}