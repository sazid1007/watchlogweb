"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MediaCard from "@/components/discover/MediaCard";
import { searchByPerson } from "@/hooks/useDiscover";
import type { MediaResult } from "@/lib/types";

export default function ActorPage() {
  const { personId, personName } = useParams<{ personId?: string; personName?: string }>();
  const [results, setResults] = useState<MediaResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const decodedName = decodeURIComponent(personName ?? "");

  useEffect(() => {
    const id = Number(personId ?? "0");
    if (!Number.isFinite(id) || id <= 0) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    void searchByPerson(id, decodedName || "Person")
      .then((items) => {
        setResults(items);
      })
      .catch((error) => {
        console.error(error);
        setResults([]);
      })
      .finally(() => setIsLoading(false));
  }, [decodedName, personId]);

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground-muted">
          Actor
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{decodedName || "Actor"}</h1>
      </header>

      {isLoading ? (
        <p className="text-sm text-foreground-muted">Loading filmography…</p>
      ) : results.length === 0 ? (
        <p className="text-sm text-foreground-muted">No credits found for this person.</p>
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
