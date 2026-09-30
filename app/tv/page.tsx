import MediaCatalogPage from "@/components/MediaCatalogPage";

export default async function TvPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q, page } = await searchParams;
  const requestedPage = Number(page);

  return <MediaCatalogPage type="tv" query={q} page={Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1} />;
}