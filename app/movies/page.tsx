import MediaCatalogPage from "@/components/MediaCatalogPage";

export default async function MoviesPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q, page } = await searchParams;
  const requestedPage = Number(page);

  return <MediaCatalogPage type="movie" query={q} page={Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1} />;
}