"use client";

/* --------------------------------------------------------------------------
   Discover — the home screen.

   Layout (top to bottom): fixed search bar, "Watch Next" row (only while the
   query is blank), headline, category chips, vertical result list.
   All fetching lives in hooks/useDiscover.
   -------------------------------------------------------------------------- */
import CategoryChip from "@/components/discover/CategoryChip";
import EmptyState from "@/components/discover/EmptyState";
import FeaturedCard from "@/components/discover/FeaturedCard";
import LoadingSpinner from "@/components/discover/LoadingSpinner";
import MediaCard from "@/components/discover/MediaCard";
import SearchBarHeader from "@/components/discover/SearchBarHeader";
import { CATEGORIES, useDiscover } from "@/hooks/useDiscover";
import { getMediaType } from "@/lib/types";

const IDLE_HEADLINE = "Discover Your Next Favorite Shows.";

export default function DiscoverPage() {
  const {
    results,
    watchNextResults,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    selectCategory,
    error,
    retry,
  } = useDiscover();

  const isSearching = searchQuery.trim().length > 0;
  const headline = isSearching
    ? "Search Results"
    : selectedCategory === "All"
      ? IDLE_HEADLINE
      : `${selectedCategory} Movies`;

  const showWatchNext = !isSearching && watchNextResults.length > 0;

  return (
    <>
      {/* Fixed search bar. Its height (h-[85px]) = pt-6 (24) + h-12 input (48)
          + pb-3 (12) + 1px border; <main> repeats it as top padding so the
          content keeps AppShell's usual 24px gap below the bar. */}
      <header className="fixed inset-x-0 top-0 z-40 h-[85px] border-b border-glass-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-2xl px-4 pt-6 pb-3">
          <SearchBarHeader value={searchQuery} onChange={setSearchQuery} />
        </div>
      </header>

      <main className="pt-[85px]">
        {showWatchNext ? (
          <section aria-label="Watch Next" className="mb-6">
            <ul className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-1">
              {watchNextResults.map((item) => (
                <li key={`${getMediaType(item)}-${item.id}`}>
                  <FeaturedCard media={item} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <h1 className="mb-4 text-2xl font-bold leading-tight tracking-tight text-foreground">
          {headline}
        </h1>

        <nav aria-label="Categories" className="mb-6">
          <ul className="-mx-4 flex gap-2 overflow-x-auto px-4">
            {CATEGORIES.map((category) => (
              <li key={category}>
                <CategoryChip
                  label={category}
                  isActive={selectedCategory === category}
                  onClick={() => selectCategory(category)}
                />
              </li>
            ))}
          </ul>
        </nav>

        <section aria-label="Results" aria-busy={isLoading}>
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="py-12 text-center">
              <p className="mb-3 text-sm text-foreground-muted">Error loading results.</p>
              <button
                type="button"
                onClick={retry}
                className="px-3 py-2 rounded bg-accent text-white"
              >
                Retry
              </button>
            </div>
          ) : results.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="space-y-2">
              {results.map((item) => (
                <li key={`${getMediaType(item)}-${item.id}`}>
                  <MediaCard media={item} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
