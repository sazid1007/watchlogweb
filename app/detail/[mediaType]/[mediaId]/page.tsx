import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import DetailActions from "@/components/DetailActions";
import MediaCard from "@/components/MediaCard";
import { getMediaDetail, imageUrl } from "@/lib/tmdb";
import { getTitle, getYear } from "@/lib/types";

export default async function DetailPage({ params }: { params: Promise<{ mediaType: string; mediaId: string }> }) {
  const { mediaType, mediaId } = await params;
  if (mediaType !== "movie" && mediaType !== "tv") notFound();
  const media = await getMediaDetail(mediaType, mediaId);
  if (!media) notFound();

  const title = getTitle(media);
  const backdrop = imageUrl(media.backdrop_path ?? media.poster_path, "original");
  const recommendations = media.recommendations?.results?.length ? media.recommendations.results : media.similar?.results ?? [];
  const crew = media.credits?.crew ?? [];
  const directors = crew.filter((person) => person.job === "Director").map((person) => person.name).slice(0, 3);
  const writers = crew.filter((person) => ["Writer", "Screenplay", "Story", "Creator"].includes(person.job)).map((person) => person.name).slice(0, 4);
  const keywords = media.keywords?.keywords ?? media.keywords?.results ?? [];
  const trailers = media.videos?.results.filter((video) => video.site === "YouTube" && ["Trailer", "Teaser"].includes(video.type)).slice(0, 4) ?? [];
  const runtime = media.runtime ?? media.episode_run_time?.[0];

  return <div className="space-y-16">
    <Link href="/" className="back-link">← Back to Home</Link>
    <section className="detail-hero detail-hero-expanded">
      <div className="relative min-h-[330px] overflow-hidden rounded-[4px] bg-surface lg:min-h-[570px]">{backdrop ? <Image src={backdrop} alt="" fill sizes="(max-width: 1024px) 100vw, 65vw" className="object-cover" /> : null}<div className="hero-wash" /></div>
      <div className="flex flex-col justify-end py-4 lg:pb-8"><p className="eyebrow">{mediaType === "tv" ? "Series" : "Feature film"} · {getYear(media)}</p><h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl">{title}</h1><div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-foreground-muted"><span className="rating-star">★ {media.vote_average?.toFixed(1) ?? "—"}</span><span>{media.original_language?.toUpperCase()}</span><span>{media.status ?? "Released"}</span></div><p className="mt-5 max-w-xl text-sm leading-7 text-foreground-muted">{media.tagline ? `“${media.tagline}”` : media.overview ?? "No synopsis has been added yet."}</p><div className="mt-5 flex flex-wrap gap-2">{media.genres?.slice(0, 5).map((genre) => <span key={genre.id} className="tag-pill">{genre.name}</span>)}</div><DetailActions media={{ ...media, media_type: mediaType }} title={title} /></div>
    </section>
    <section className="detail-section"><p className="eyebrow">Storyline</p><h2 className="section-title">The story</h2><p className="storyline">{media.overview ?? "The storyline for this title is not available yet."}</p></section>
    {mediaType === "tv" ? <section className="detail-section"><p className="eyebrow">Series information</p><h2 className="section-title">Across the seasons</h2><div className="info-grid"><InfoItem label="Seasons" value={String(media.number_of_seasons ?? "—")} /><InfoItem label="Episodes" value={String(media.number_of_episodes ?? "—")} /><InfoItem label="Episode runtime" value={runtime ? `${runtime} min` : "—"} /><InfoItem label="Last air date" value={media.last_episode_to_air?.air_date ?? "—"} /><InfoItem label="Status" value={media.status ?? "—"} /><InfoItem label="Created by" value={media.created_by?.map((creator) => creator.name).join(", ") || "—"} /></div></section> : null}
    <section className="detail-section"><p className="eyebrow">Credits & details</p><h2 className="section-title">Behind the title</h2><div className="info-grid"><InfoItem label="Director" value={directors.join(", ") || "—"} /><InfoItem label="Writers" value={writers.join(", ") || "—"} /><InfoItem label="Runtime" value={runtime ? `${runtime} min` : "—"} /><InfoItem label="Release date" value={media.release_date ?? media.first_air_date ?? "—"} /><InfoItem label="Production" value={media.production_companies?.map((company) => company.name).slice(0, 2).join(", ") || "—"} /><InfoItem label="Spoken languages" value={media.spoken_languages?.map((language) => language.english_name ?? language.name).join(", ") || "—"} /></div></section>
    {media.credits?.cast?.length ? <section className="detail-section"><p className="eyebrow">The people in it</p><h2 className="section-title mb-5">Cast</h2><div className="cast-grid">{media.credits.cast.slice(0, 12).map((person) => <Link key={`${person.id}-${person.credit_id}`} href={`/actor/${person.id}/${encodeURIComponent(person.name)}`} className="cast-card">{person.profile_path ? <Image src={imageUrl(person.profile_path, "w342") ?? ""} alt={person.name} fill sizes="100px" className="object-cover" /> : <div className="cast-placeholder">{person.name.slice(0, 1)}</div>}<div className="cast-overlay"><strong>{person.name}</strong><span>{person.character ?? "Cast"}</span></div></Link>)}</div></section> : null}
    {trailers.length ? <section className="detail-section"><p className="eyebrow">Watch next</p><h2 className="section-title mb-5">Video & Trailers</h2><div className="video-grid">{trailers.map((video) => <a key={video.key} href={`https://www.youtube.com/watch?v=${video.key}`} target="_blank" rel="noreferrer" className="video-card"><Image src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`} alt={video.name} fill sizes="(max-width: 700px) 100vw, 33vw" className="object-cover" /><span>▶</span><strong>{video.name}</strong></a>)}</div></section> : null}
    {keywords.length ? <section className="detail-section"><p className="eyebrow">Index</p><h2 className="section-title mb-4">Tags</h2><div className="flex flex-wrap gap-2">{keywords.slice(0, 14).map((keyword) => <span key={keyword.id} className="tag-pill">{keyword.name}</span>)}</div></section> : null}
    {recommendations.length ? <section className="detail-section"><p className="eyebrow">Keep looking</p><h2 className="section-title mb-5">Similar Suggestions</h2><div className="poster-grid">{recommendations.slice(0, 6).map((item) => <MediaCard key={`${item.media_type}-${item.id}`} media={{ ...item, media_type: item.media_type ?? mediaType }} />)}</div></section> : null}
  </div>;
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return <div className="info-item"><span>{label}</span><strong>{value}</strong></div>;
}