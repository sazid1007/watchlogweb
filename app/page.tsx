import Image from "next/image";
import Link from "next/link";
import MediaCard from "@/components/MediaCard";
import RecentExplored from "@/components/RecentExplored";
import { getHomeRows, getSearchResults, imageUrl } from "@/lib/tmdb";
import { getTitle, mediaHref } from "@/lib/types";
import type { MediaResult } from "@/lib/types";

export default async function DiscoverPage({ searchParams }: { searchParams: Promise<{ q?: string; view?: string }> }) {
  const { q, view } = await searchParams;
  const { trending, movies, shows } = await getHomeRows();
  const searchResults = q ? await getSearchResults(q) : [];
  const activeItems = view === "movies" ? movies : view === "tv" ? shows : trending;
  const hero = activeItems[0] ?? trending[0];
  const heroImage = imageUrl(hero?.backdrop_path ?? hero?.poster_path, "original");
  const latestItems = activeItems.slice(3);

  return (
    <div className="space-y-14">
      {q ? <section><p className="eyebrow">Search results</p><h1 className="section-title mt-2">Titles matching “{q}”</h1><div className="poster-grid mt-6">{searchResults.length ? searchResults.slice(0, 12).map((item) => <MediaCard key={`${item.media_type}-${item.id}`} media={item} />) : <p className="text-sm text-foreground-muted">No titles found. Try another search.</p>}</div></section> : null}
      <section className="hero-panel">
        {heroImage ? <Image src={heroImage} alt="" fill priority sizes="100vw" className="object-cover object-center" /> : null}
        <div className="hero-wash" />
        <div className="relative max-w-2xl px-6 py-12 sm:px-10 sm:py-20">
          <p className="eyebrow">Featured item</p>
          <h1 className="hero-title">{getTitle(hero)}</h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-white/70 sm:text-base">{hero?.overview ?? "A considered place to find your next great watch."}</p>
          <Link href={hero ? mediaHref(hero) : "/journal"} className="primary-button mt-7 inline-flex">Explore title <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between"><div><p className="eyebrow">A living shelf</p><h2 className="section-title">Featured Items</h2></div><span className="text-xs uppercase tracking-[0.18em] text-foreground-muted">Updated weekly</span></div>
        <div className="poster-grid feature-grid">{activeItems.slice(0, 6).map((item, index) => <MediaCard key={`${item.media_type}-${item.id}`} media={item} featured={index === 0} />)}</div>
      </section>

      <MediaRow title="Latest Films & Shows" items={latestItems.length ? latestItems : [...movies.slice(3), ...shows.slice(3)]} />
      <RecentExplored />
    </div>
  );
}

function MediaRow({ title, items }: { title: string; items: MediaResult[] }) {
  return <section><div className="mb-5 flex items-end justify-between"><div><p className="eyebrow">WatchLog picks</p><h2 className="section-title">{title}</h2></div><Link href="/journal" className="text-xs text-accent hover:text-white">Open journal →</Link></div><div className="poster-grid">{items.slice(0, 6).map((item) => <MediaCard key={`${item.media_type}-${item.id}`} media={item} />)}</div></section>;
}
