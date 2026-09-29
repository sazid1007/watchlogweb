"use client";

import { useEffect, useRef } from "react";
import MediaCard from "@/components/MediaCard";
import type { MediaResult } from "@/lib/types";

export default function FeaturedCarousel({ items }: { items: MediaResult[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const firstCard = track.firstElementChild as HTMLElement | null;
      const step = (firstCard?.offsetWidth ?? 280) + 18;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - step;
      track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + step, behavior: "smooth" });
    }, 3000);

    return () => window.clearInterval(timer);
  }, []);

  return <div className="featured-carousel"><div ref={trackRef} className="featured-track">{items.slice(0, 5).map((item) => <MediaCard key={`${item.media_type}-${item.id}`} media={item} featured />)}</div></div>;
}