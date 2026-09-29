"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CastCard from "@/components/detail/CastCard";
import InfoRow from "@/components/detail/InfoRow";
import SectionHeader from "@/components/detail/SectionHeader";
import SimilarMediaCard from "@/components/detail/SimilarMediaCard";
import VideoCard from "@/components/detail/VideoCard";
import { useDetail } from "@/hooks/useDetail";
import { tmdbImageUrl } from "@/lib/tmdb";
import { getTitle, getYear, type MediaType } from "@/lib/types";

const STAR_VALUES = Array.from({ length: 10 }, (_, index) => index + 1);

export default function DetailPage() {
  const { mediaType, mediaId } = useParams<{ mediaType?: string; mediaId?: string }>();
  const router = useRouter();
  const type: MediaType = mediaType === "movie" || mediaType === "tv" ? mediaType : "movie";
  const id = Number(mediaId ?? "0");

  const { detail, similar, isLoading, localEntry, toggleWatchlist, saveRating } =
    useDetail(type, id);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [draftRating, setDraftRating] = useState(localEntry.rating);

  useEffect(() => {
    setDraftRating(localEntry.rating);
  }, [localEntry.rating]);

  if (isLoading) {
    return <div className="py-12 text-center text-foreground-muted">Loading details…</div>;
  }

  if (!detail) {
    return <div className="py-12 text-center text-foreground-muted">Media not found.</div>;
  }

  const title = getTitle(detail) || "Untitled";
  const year = getYear(detail);
  const voteAverage = detail.vote_average != null ? Number(detail.vote_average).toFixed(1) : "N/A";
  const heroImage = tmdbImageUrl(detail.backdrop_path ?? detail.poster_path);
  const logo = detail.images?.logos?.[0];
  const seasonOrRuntime =
    type === "movie"
      ? detail.runtime
        ? `${detail.runtime} min`
        : "Runtime unavailable"
      : detail.number_of_seasons
        ? `${detail.number_of_seasons} seasons`
        : "TV details unavailable";

  const cast = detail.credits?.cast?.slice(0, 10) ?? [];
  const crew = detail.credits?.crew ?? [];
  const director = crew.find((member) => member.job === "Director")?.name ?? "Not listed";
  const writers = crew
    .filter((member) => member.job === "Writer" || member.job === "Screenplay")
    .map((member) => member.name)
    .slice(0, 3);
  const providers = detail["watch/providers"]?.results?.US?.flatrate ?? [];
  const videos = (detail.videos?.results ?? [])
    .filter(
      (video) =>
        video.site === "YouTube" &&
        (video.type === "Trailer" || video.type === "Teaser"),
    )
    .slice(0, 4);
  const tags = (detail.keywords?.keywords ?? detail.keywords?.results ?? []).slice(0, 15);

  const handleSaveRating = () => {
    saveRating(draftRating);
    setIsRatingOpen(false);
  };

  return (
    <div className="relative -mx-4 pb-10">
      <header className="relative h-[430px] overflow-hidden">
        <div className="absolute inset-0">
          {heroImage ? (
            <Image
              src={heroImage}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw"
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-background/45 to-background" />
        </div>

        <div className="relative z-10 flex h-full flex-col justify-between px-4 pt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white shadow-lg backdrop-blur-sm transition-transform hover:scale-105"
            aria-label="Go back"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" aria-hidden="true">
              <path d="M15 18 9 12l6-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="pb-6">
            {logo?.file_path ? (
              <div className="max-w-[260px]">
                <Image
                  src={tmdbImageUrl(logo.file_path) ?? ""}
                  alt={title}
                  width={260}
                  height={90}
                  className="max-h-[90px] w-auto object-contain"
                />
              </div>
            ) : (
              <h1 className="max-w-[16ch] text-3xl font-black leading-none tracking-tight text-white">
                {title}
              </h1>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 -mt-8 rounded-t-3xl border-t border-glass-border bg-background px-4 pt-6">
        <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-foreground-muted">
          {year ? <span>{year}</span> : null}
          {year ? <span>•</span> : null}
          <span>{seasonOrRuntime}</span>
          <span>•</span>
          <div className="flex items-center gap-1 text-foreground">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-accent text-accent" aria-hidden="true">
              <path d="m12 2.7 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.8-5.4 2.8 1-6.1L3.2 9.1l6.1-.9L12 2.7Z" />
            </svg>
            <span>{voteAverage}/10</span>
            <span className="text-foreground-muted">({detail.vote_count ?? 0})</span>
          </div>
          <div className="ml-auto flex items-center gap-1 rounded-full border border-glass-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
            {localEntry.rating > 0 ? `Rated ${localEntry.rating}/10` : "Unrated"}
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {(detail.genres ?? []).map((genre) => (
            <span
              key={genre.id}
              className="rounded-full border border-glass-border bg-surface px-3 py-1 text-xs font-medium text-foreground-muted"
            >
              {genre.name}
            </span>
          ))}
        </div>

        <div className="mb-6 flex gap-3">
          <button
            type="button"
            onClick={toggleWatchlist}
            className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
              localEntry.watchlist
                ? "bg-accent text-white"
                : "border border-glass-border bg-surface text-foreground"
            }`}
          >
            {localEntry.watchlist ? "On Playlist" : "Save to List"}
          </button>
          <button
            type="button"
            onClick={() => setIsRatingOpen(true)}
            className="flex-1 rounded-full border border-glass-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground"
          >
            {localEntry.rating > 0 ? `Rated ${localEntry.rating}` : "Rate Title"}
          </button>
        </div>

        {providers.length > 0 ? (
          <section className="mb-8">
            <SectionHeader title="Where to Watch" />
            <div className="mt-4 flex flex-wrap gap-3">
              {providers.map((provider) => {
                const logo = tmdbImageUrl(provider.logo_path);
                return (
                  <div key={provider.provider_id} className="w-[72px] text-center">
                    <div className="mx-auto mb-2 flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-xl bg-surface">
                      {logo ? (
                        <Image
                          src={logo}
                          alt={provider.provider_name}
                          width={50}
                          height={50}
                          sizes="50px"
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <p className="text-[10px] text-foreground-muted">{provider.provider_name}</p>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="mb-8 space-y-3">
          <SectionHeader title="Storyline" />
          <p className="text-sm leading-6 text-foreground-muted">
            {detail.overview || "No overview available."}
          </p>
        </section>

        {type === "tv" ? (
          <section className="mb-8 space-y-3">
            <SectionHeader title="TV Show Info" />
            <InfoRow label="Episodes" value={detail.number_of_episodes ?? "Unknown"} />
            <InfoRow
              label="Last Air Date"
              value={detail.last_episode_to_air?.air_date ?? "Not available"}
            />
            <InfoRow
              label="Episode Runtime"
              value={
                detail.episode_run_time != null ? `${detail.episode_run_time} min` : "Unknown"
              }
            />
          </section>
        ) : null}

        <section className="mb-8">
          <SectionHeader title="Details" />
          <div className="mt-3 space-y-1">
            <InfoRow label="Director" value={director} />
            <InfoRow
              label="Writers"
              value={writers.length > 0 ? writers.join(", ") : "Not listed"}
            />
            <InfoRow label="Status" value={detail.status ?? "Unknown"} />
            <InfoRow
              label="Original Language"
              value={detail.original_language?.toUpperCase() ?? "Unknown"}
            />
            <InfoRow
              label="Popularity"
              value={detail.popularity != null ? detail.popularity.toFixed(1) : "Unknown"}
            />
            <InfoRow
              label="Production countries"
              value={detail.production_countries?.map((country) => country.name).join(", ") || "Not listed"}
            />
            <InfoRow
              label="Companies"
              value={detail.production_companies?.map((company) => company.name).join(", ") || "Not listed"}
            />
          </div>
        </section>

        <section className="mb-8">
          <SectionHeader title="Cast" />
          <div className="mt-4 flex gap-4 overflow-x-auto pb-1">
            {cast.map((member) => (
              <CastCard key={member.id} cast={member} />
            ))}
          </div>
        </section>

        {videos.length > 0 ? (
          <section className="mb-8">
            <SectionHeader title="Videos & Trailers" />
            <div className="mt-4 flex gap-4 overflow-x-auto pb-1">
              {videos.map((video) => (
                <VideoCard key={video.key} video={video} />
              ))}
            </div>
          </section>
        ) : null}

        {tags.length > 0 ? (
          <section className="mb-8">
            <SectionHeader title="Tags" />
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <a
                  key={tag.id}
                  href={`/tag/${tag.id}/${encodeURIComponent(tag.name)}`}
                  className="rounded-full border border-glass-border bg-surface px-3 py-1.5 text-xs text-foreground-muted transition-colors hover:border-accent/70 hover:text-accent"
                >
                  #{tag.name}
                </a>
              ))}
            </div>
          </section>
        ) : null}

        {similar.length > 0 ? (
          <section className="mb-8">
            <SectionHeader title="Similar Suggestions" />
            <div className="mt-4 flex gap-4 overflow-x-auto pb-1">
              {similar.slice(0, 10).map((item) => (
                <SimilarMediaCard key={`${item.media_type ?? type}-${item.id}`} media={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      {isRatingOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-t-3xl border border-glass-border bg-background px-5 pb-5 pt-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium uppercase tracking-[0.2em] text-foreground-muted">
                Your Rating
              </span>
              <button
                type="button"
                onClick={() => setIsRatingOpen(false)}
                className="text-sm text-foreground-muted"
                aria-label="Close rating sheet"
              >
                Close
              </button>
            </div>

            <div className="mb-5 flex items-center justify-center gap-2 text-2xl font-bold text-accent">
              <span>{draftRating}</span>
              <span className="text-lg">/10</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-center gap-3">
                {STAR_VALUES.slice(0, 5).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setDraftRating(value)}
                    className={`text-2xl ${value <= draftRating ? "text-accent" : "text-foreground-muted"}`}
                    aria-label={`Rate ${value} out of 10`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <div className="flex justify-center gap-3">
                {STAR_VALUES.slice(5).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setDraftRating(value)}
                    className={`text-2xl ${value <= draftRating ? "text-accent" : "text-foreground-muted"}`}
                    aria-label={`Rate ${value} out of 10`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveRating}
              disabled={draftRating === 0}
              className={`mt-6 w-full rounded-full px-4 py-3 text-sm font-semibold transition-colors ${
                draftRating === 0
                  ? "cursor-not-allowed bg-surface text-foreground-muted"
                  : "bg-accent text-white"
              }`}
            >
              Save to Journal
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
