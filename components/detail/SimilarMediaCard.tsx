import Image from "next/image";
import Link from "next/link";
import { tmdbImageUrl } from "@/lib/tmdb";
import { getMediaType, getTitle, getYear, type MediaResult } from "@/lib/types";

interface SimilarMediaCardProps {
  media: MediaResult;
}

export default function SimilarMediaCard({ media }: SimilarMediaCardProps) {
  const poster = tmdbImageUrl(media.poster_path ?? media.backdrop_path);
  const mediaType = getMediaType(media);

  return (
    <Link
      href={`/detail/${mediaType}/${media.id}`}
      className="group block w-[130px] shrink-0 overflow-hidden rounded-2xl border border-glass-border bg-surface transition-colors hover:border-accent/70"
      aria-label={`Open ${getTitle(media)}`}
    >
      <div className="relative h-[180px] w-full overflow-hidden">
        {poster ? (
          <Image
            src={poster}
            alt={getTitle(media)}
            fill
            sizes="130px"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-2 text-center text-[10px] text-foreground-muted">
            No image
          </div>
        )}
      </div>
      <div className="space-y-1 px-2 py-2">
        <p className="line-clamp-2 text-xs font-semibold text-foreground">{getTitle(media)}</p>
        <p className="text-[10px] text-foreground-muted">{getYear(media)}</p>
      </div>
    </Link>
  );
}
