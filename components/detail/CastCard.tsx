import Image from "next/image";
import Link from "next/link";
import { tmdbImageUrl } from "@/lib/tmdb";

interface CastCardProps {
  cast: {
    id: number;
    name: string;
    character?: string;
    profile_path?: string | null;
  };
}

export default function CastCard({ cast }: CastCardProps) {
  const avatar = tmdbImageUrl(cast.profile_path);
  const href = `/actor/${cast.id}/${encodeURIComponent(cast.name)}`;

  return (
    <Link
      href={href}
      className="group block w-[100px] shrink-0 text-center"
      aria-label={`View ${cast.name}'s filmography`}
    >
      <div className="mx-auto mb-2 h-[100px] w-[100px] overflow-hidden rounded-full border border-glass-border bg-surface">
        {avatar ? (
          <Image
            src={avatar}
            alt={cast.name}
            width={100}
            height={100}
            sizes="100px"
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-[0.2em] text-foreground-muted">
            {cast.name.slice(0, 2)}
          </div>
        )}
      </div>
      <p className="line-clamp-2 text-xs font-semibold text-foreground">{cast.name}</p>
      {cast.character ? (
        <p className="mt-1 line-clamp-2 text-[10px] text-foreground-muted">{cast.character}</p>
      ) : null}
    </Link>
  );
}
