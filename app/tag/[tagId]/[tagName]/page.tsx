"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MediaCard from "@/components/discover/MediaCard";
import { searchByTag } from "@/hooks/useDiscover";
import type { MediaResult } from "@/lib/types";

export default function TagPage() {
  const { tagId, tagName } = useParams<{ tagId?: string; tagName?: string }>();
  const [results, setResults] = useState<MediaResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const decodedName = decodeURIComponent(tagName ?? "");

  useEffect(() => {
    const id = Number(tagId ?? "0");
    if (!Number.isFinite(id) || id <= 0) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    void searchByTag(id, decodedName || "Tag")
      .then((items) => {
        setResults(items);
      })
      .catch((error) => {
        console.error(error);
        setResults([]);
      })
      .finally(() => setIsLoading(false));
  }, [decodedName, tagId]);

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground-muted">
          Tag
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">#{decodedName || "Tag"}</h1>
      </header>

      {isLoading ? (
        <p className="text-sm text-foreground-muted">Loading tagged titles…</p>
      ) : results.length === 0 ? (
        <p className="text-sm text-foreground-muted">No matching titles were found.</p>
      ) : (
        <ul className="space-y-2">
          {results.map((item) => (
            <li key={`${item.media_type ?? "movie"}-${item.id}`}>
              <MediaCard media={item} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
