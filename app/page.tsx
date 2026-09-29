import Link from "next/link";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import MediaCard from "@/components/MediaCard";
import RecentExplored from "@/components/RecentExplored";
import { getHomeRows, getSearchResults } from "@/lib/tmdb";
import type { MediaResult } from "@/lib/types";

export default async function DiscoverPage({ searchParams }: { searchParams: Promise<{ q?: string; view?: string }> }) {
  const { q, view } = await searchParams;
  const { trending, movies, shows } = await getHomeRows();
  const searchResults = q ? await getSearchResults(q) : [];
  const activeItems = view === "movies" ? movies : view === "tv" ? shows : trending;
  const latestItems = activeItems.slice(5);
  const rankedShows = [...shows].sort((left, right) => (right.vote_average ?? 0) - (left.vote_average ?? 0));
  const watchOffset = rankedShows.length ? new Date().getDate() % rankedShows.length : 0;
  const watchNext = [...rankedShows.slice(watchOffset), ...rankedShows.slice(0, watchOffset)].slice(0, 6);
  const categories = [
    { name: "Action picks", items: movies.filter((item) => item.genre_ids?.includes(28)) },
    { name: "Drama picks", items: [...movies, ...shows].filter((item) => item.genre_ids?.includes(18)) },
    { name: "Comedy picks", items: [...movies, ...shows].filter((item) => item.genre_ids?.includes(35)) },
  ];

  return (
    <div className="space-y-14">
      {q ? <section><p className="eyebrow">Search results</p><h1 className="section-title mt-2">Titles matching “{q}”</h1><div className="poster-grid mt-6">{searchResults.length ? searchResults.slice(0, 12).map((item) => <MediaCard key={`${item.media_type}-${item.id}`} media={item} />) : <p className="text-sm text-foreground-muted">No titles found. Try another search.</p>}</div></section> : null}
      <FeaturedCarousel items={activeItems} />

      <MediaRow title="Watch Next" items={watchNext} />
      <MediaRow title="Latest Films & Shows" items={latestItems.length ? latestItems : [...movies.slice(5), ...shows.slice(5)]} />
      <RecentExplored />
      {categories.map((category) => <MediaRow key={category.name} title={category.name} items={category.items.length ? category.items : activeItems.slice(0, 6)} />)}
    </div>
  );
}

function MediaRow({ title, items }: { title: string; items: MediaResult[] }) {
  return <section><div className="mb-5 flex items-end justify-between"><div><p className="eyebrow">WatchLog picks</p><h2 className="section-title">{title}</h2></div><Link href="/journal" className="text-xs text-accent hover:text-white">Open journal →</Link></div><div className="poster-grid">{items.slice(0, 6).map((item) => <MediaCard key={`${item.media_type}-${item.id}`} media={item} />)}</div></section>;
}
