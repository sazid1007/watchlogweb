import WatchList from "@/components/WatchList";

export default function JournalPage() {
  return <div className="space-y-12"><div><p className="eyebrow">Your collection</p><h1 className="hero-title mt-4">My List</h1><p className="mt-5 max-w-xl text-sm leading-7 text-foreground-muted">Titles you want to watch later, kept in one calm little corner of WatchLog.</p></div><WatchList /></div>;
}