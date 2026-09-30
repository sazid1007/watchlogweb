import Link from "next/link";
import MediaCard from "@/components/MediaCard";
import { getCatalogResults } from "@/lib/tmdb";
import type { MediaType } from "@/lib/types";

interface MediaCatalogPageProps {
  type: MediaType;
  query?: string;
  page?: number;
}

export default async function MediaCatalogPage({ type, query = "", page = 1 }: MediaCatalogPageProps) {
  const title = type === "movie" ? "Movies" : "TV Shows";
  const route = type === "movie" ? "/movies" : "/tv";
  const catalog = await getCatalogResults(type, query, page);
  const pageHref = (nextPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    params.set("page", String(nextPage));
    return `${route}?${params.toString()}`;
  };

  return (
    <div className="space-y-8">
      <header className="catalog-header">
        <div>
          <p className="eyebrow">Browse library</p>
          <h1 className="section-title mt-2 text-3xl sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-foreground-muted">
            {query ? `Results for “${query}”` : `Popular ${type === "movie" ? "films" : "series"}`}
          </p>
        </div>
        <form action={route} className="catalog-search">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder={`Search ${type === "movie" ? "movies" : "TV shows"}`}
            aria-label={`Search ${type === "movie" ? "movies" : "TV shows"}`}
          />
          <button type="submit">Search</button>
        </form>
      </header>

      {catalog.results.length ? (
        <div className="poster-grid">
          {catalog.results.map((item) => <MediaCard key={`${type}-${item.id}`} media={item} />)}
        </div>
      ) : (
        <p className="text-sm text-foreground-muted">No {type === "movie" ? "movies" : "TV shows"} found. Try another search.</p>
      )}

      {catalog.total_pages > 1 ? (
        <nav aria-label={`${title} pages`} className="catalog-pagination">
          {page > 1 ? <Link href={pageHref(page - 1)}>← Previous</Link> : <span />}
          <span>Page {page} of {catalog.total_pages}</span>
          {page < catalog.total_pages ? <Link href={pageHref(page + 1)}>Next →</Link> : <span />}
        </nav>
      ) : null}
    </div>
  );
}