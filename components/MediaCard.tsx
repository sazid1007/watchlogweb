"use client";

import Image from "next/image";
import Link from "next/link";
import type { MediaResult } from "@/lib/types";
import { getMediaType, getTitle, getYear, mediaHref } from "@/lib/types";
import { imageUrl } from "@/lib/tmdb";

export default function MediaCard({ media, featured = false }: { media: MediaResult; featured?: boolean }) {
  const type = getMediaType(media);
  const title = getTitle(media);
  const poster = imageUrl(media.poster_path, "w342");

  function rememberExploration() {
    if (!title) return;
    const existing = JSON.parse(localStorage.getItem("watchlog-recent") ?? "[]") as MediaResult[];
    const next = [{ ...media, media_type: type }, ...existing.filter((item) => item.id !== media.id)].slice(0, 8);
    localStorage.setItem("watchlog-recent", JSON.stringify(next));
    // Browsing history is intentionally persisted as a first-party cookie.
    // eslint-disable-next-line react-hooks/immutability
    window.document.cookie = `watchlog-recent=${encodeURIComponent(JSON.stringify(next))}; path=/; max-age=2592000; SameSite=Lax`;
    window.dispatchEvent(new Event("watchlog-recent-change"));
  }

  return (
    <Link href={mediaHref({ ...media, media_type: type })} onClick={rememberExploration} className={`group block min-w-0 ${featured ? "col-span-2" : ""}`}>
      <div className={`relative overflow-hidden rounded-[4px] bg-surface ${featured ? "aspect-[16/9]" : "aspect-[2/3]"}`}>
        {poster ? <Image src={poster} alt={title} fill sizes={featured ? "(max-width: 700px) 100vw, 66vw" : "(max-width: 700px) 42vw, 16vw"} className="object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-end p-3 text-sm text-foreground-muted">{title}</div>}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3 pt-12 opacity-0 transition group-hover:opacity-100">
          <p className="truncate text-sm font-semibold text-white">{title}</p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 text-xs text-foreground-muted">
        <span className="truncate">{title}</span>
        <span>{getYear(media)}</span>
      </div>
    </Link>
  );
}