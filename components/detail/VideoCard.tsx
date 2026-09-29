import Image from "next/image";

interface VideoCardProps {
  video: {
    key: string;
    name: string;
    type: string;
  };
}

export default function VideoCard({ video }: VideoCardProps) {
  const thumbnail = `https://img.youtube.com/vi/${video.key}/0.jpg`;
  const href = `https://www.youtube.com/watch?v=${video.key}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group relative block w-[180px] shrink-0 overflow-hidden rounded-2xl border border-glass-border bg-surface"
      aria-label={`Open ${video.name} on YouTube`}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={thumbnail}
          alt={video.name}
          fill
          sizes="180px"
          className="object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-background shadow-lg">
            <svg
              viewBox="0 0 24 24"
              className="ml-0.5 h-5 w-5 fill-current"
              aria-hidden="true"
            >
              <path d="M8 6.5v11l9-5.5-9-5.5Z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="px-3 py-2">
        <p className="line-clamp-2 text-xs font-medium text-foreground">{video.name}</p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-foreground-muted">
          {video.type}
        </p>
      </div>
    </a>
  );
}
