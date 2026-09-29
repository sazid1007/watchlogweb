import Image from "next/image";
import { notFound } from "next/navigation";
import MediaCard from "@/components/MediaCard";
import { getPersonDetail, imageUrl } from "@/lib/tmdb";

export default async function ActorPage({ params }: { params: Promise<{ personId: string; personName: string }> }) {
  const { personId } = await params;
  const person = await getPersonDetail(personId);
  if (!person) notFound();
  const credits = [...(person.combined_credits?.cast ?? []), ...(person.combined_credits?.crew ?? [])].filter((item, index, list) => list.findIndex((candidate) => candidate.id === item.id) === index);

  return <div className="space-y-12"><p className="eyebrow">Cast profile</p><section className="person-hero">{person.profile_path ? <Image src={imageUrl(person.profile_path, "w500") ?? ""} alt={person.name} fill sizes="220px" className="object-cover" /> : null}<div className="person-copy"><h1 className="hero-title">{person.name}</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-foreground-muted">{person.biography || `${person.name} is known for ${person.known_for_department?.toLowerCase() ?? "their work on screen"}.`}</p><p className="mt-5 text-xs uppercase tracking-[0.14em] text-foreground-muted">{person.place_of_birth ?? ""}</p></div></section>{credits.length ? <section><p className="eyebrow">Selected work</p><h2 className="section-title mb-5">Known for</h2><div className="poster-grid">{credits.slice(0, 12).map((item) => <MediaCard key={`${item.media_type}-${item.id}`} media={item} />)}</div></section> : null}</div>;
}