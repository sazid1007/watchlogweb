/* --------------------------------------------------------------------------
   MediaCard — 80x120 poster + title / year / media-type badge. Used by the
   vertical result list on Discover (and later, by any result list).
   -------------------------------------------------------------------------- */

import Image from "next/image";
import Link from "next/link";
import { tmdbImageUrl } from "@/lib/tmdb";
import { getMediaType, getTitle, getYear, mediaHref, type MediaResult } from "@/lib/types";

interface MediaCardProps {
  media: MediaResult;
}

export default function MediaCard({ media }: MediaCardProps) {
  const poster = tmdbImageUrl(media.poster_path ?? media.backdrop_path);
  const mediaType = getMediaType(media);

  return (
    <Link
      href={mediaHref(media)}
      className="group -mx-2 flex items-center gap-4 rounded-2xl border border-transparent p-2 transition-colors hover:border-glass-border focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="relative h-[120px] w-20 shrink-0 overflow-hidden rounded-lg bg-surface">
        {poster ? (
          <Image
            src={poster}
            alt={getTitle(media)}
            width={80}
            height={120}
            sizes="80px"
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center px-2 text-center text-[10px] text-foreground-muted"
          >
            No image
          </div>
        )}
      </div>

      <div className="min-w-0 space-y-1.5">
        <h3 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-accent-secondary">
          {getTitle(media)}
        </h3>
        <p className="text-xs text-foreground-muted">{getYear(media)}</p>
        <span className="block text-[10px] font-semibold uppercase tracking-widest text-accent">
          {mediaType}
        </span>
      </div>
    </Link>
  );
}
