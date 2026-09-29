/* --------------------------------------------------------------------------
   FeaturedCard — 300x180 backdrop card used by the "Watch Next" row.
   Bottom-to-top gradient keeps the title and star rating readable.
   -------------------------------------------------------------------------- */

import Image from "next/image";
import Link from "next/link";
import { tmdbImageUrl } from "@/lib/tmdb";
import { getTitle, mediaHref, type MediaResult } from "@/lib/types";

interface FeaturedCardProps {
  media: MediaResult;
}

export default function FeaturedCard({ media }: FeaturedCardProps) {
  const backdrop = tmdbImageUrl(media.backdrop_path ?? media.poster_path);
  const rating = media.vote_average ?? 0;

  return (
    <Link
      href={mediaHref(media)}
      className="block w-[300px] shrink-0 snap-start rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <article className="group relative h-[180px] w-[300px] overflow-hidden rounded-2xl bg-surface">
        {backdrop ? (
          <Image
            src={backdrop}
            alt=""
            fill
            sizes="300px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-glass" aria-hidden="true" />
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-transparent"
        />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3">
          <h3 className="line-clamp-2 text-sm font-semibold text-white">{getTitle(media)}</h3>
          <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-white">
            <StarIcon className="h-3.5 w-3.5 text-yellow-400" />
            {rating.toFixed(1)}
          </span>
        </div>
      </article>
    </Link>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.31l-5.8 3.05 1.11-6.46-4.7-4.58 6.49-.94L12 2.5z" />
    </svg>
  );
}
