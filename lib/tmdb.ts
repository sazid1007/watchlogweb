import type { MediaDetailResponse, MediaListResponse, MediaResult, MediaType, PersonCombinedCredits, PersonDetailResponse } from "@/lib/types";

const API_URL = "https://api.themoviedb.org/3";

const fallbackMovies: MediaResult[] = [
  { id: 693134, media_type: "movie", title: "Dune: Part Two", release_date: "2024-02-27", poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg", vote_average: 8.2, overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family." },
  { id: 949, media_type: "movie", title: "Heat", release_date: "1995-12-15", poster_path: "/umSVjVdbVwtx5ryCA2QXL44Durm.jpg", backdrop_path: "/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg", vote_average: 8.3, overview: "A master thief and a relentless detective circle one another in Los Angeles." },
  { id: 872585, media_type: "movie", title: "Oppenheimer", release_date: "2023-07-19", poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", backdrop_path: "/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg", vote_average: 8.1, overview: "The story of J. Robert Oppenheimer and the creation of the atomic bomb." },
  { id: 346698, media_type: "movie", title: "Barbie", release_date: "2023-07-19", poster_path: "/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg", backdrop_path: "/nHf61UzkfFno5X1ofIhugCPus2R.jpg", vote_average: 7.0, overview: "Barbie has a perfect day in Barbieland, until an unexpected trip to the real world changes everything." },
  { id: 157336, media_type: "movie", title: "Interstellar", release_date: "2014-11-05", poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", backdrop_path: "/xJHokMbljvjADYdit5fK5QtbCo.jpg", vote_average: 8.4, overview: "Explorers travel through a wormhole in space in an attempt to ensure humanity's survival." },
  { id: 1399, media_type: "tv", name: "Game of Thrones", first_air_date: "2011-04-17", poster_path: "/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg", backdrop_path: "/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg", vote_average: 8.4, overview: "Nine noble families fight for control over the lands of Westeros." },
];

async function tmdbFetch<T>(path: string): Promise<T | null> {
  const key = process.env.TMDB_API_KEY;
  if (!key) return null;

  try {
    const response = await fetch(`${API_URL}${path}${path.includes("?") ? "&" : "?"}api_key=${key}&language=en-US`, {
      next: { revalidate: 900 },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getHomeRows() {
  const [trending, popularMovies, popularShows] = await Promise.all([
    tmdbFetch<MediaListResponse>("/trending/all/week"),
    tmdbFetch<MediaListResponse>("/movie/popular"),
    tmdbFetch<MediaListResponse>("/tv/popular"),
  ]);

  return {
    trending: trending?.results.filter((item) => item.media_type !== "person") ?? fallbackMovies,
    movies: popularMovies?.results ?? fallbackMovies.filter((item) => item.media_type === "movie"),
    shows: popularShows?.results ?? fallbackMovies.filter((item) => item.media_type === "tv"),
  };
}

export async function getMediaDetail(type: MediaType, id: string | number) {
  const detail = await tmdbFetch<MediaDetailResponse>(
    `/${type}/${encodeURIComponent(String(id))}?append_to_response=credits,similar,recommendations,watch/providers`,
  );
  if (detail) return detail;

  const fallback = fallbackMovies.find((item) => String(item.id) === String(id) && (item.media_type === type || !item.media_type));
  return fallback ? ({ ...fallback, media_type: type, genres: [] } as MediaDetailResponse) : null;
}

export function imageUrl(path: string | null | undefined, size: "w342" | "w500" | "original" = "w500") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}

export async function getSearchResults(query: string) {
  if (!query.trim()) return [];
  const response = await tmdbFetch<MediaListResponse>(`/search/multi?query=${encodeURIComponent(query.trim())}`);
  return response?.results.filter((item) => item.media_type !== "person") ?? [];
}

export async function getPersonDetail(id: string) {
  return tmdbFetch<PersonDetailResponse>(`/person/${encodeURIComponent(id)}?append_to_response=combined_credits`);
}

function requireResponse<T>(response: T | null): T {
  if (!response) throw new Error("TMDB data is unavailable. Check TMDB_API_KEY.");
  return response;
}

export function tmdbImageUrl(path: string | null | undefined) {
  return imageUrl(path, "w500");
}

export function getTrending() {
  return tmdbFetch<MediaListResponse>("/trending/all/day").then((response) => requireResponse(response));
}

export function searchMedia(query: string) {
  return tmdbFetch<MediaListResponse>(`/search/multi?query=${encodeURIComponent(query)}`).then((response) => requireResponse(response));
}

export function discoverByGenre(genreId: number) {
  return tmdbFetch<MediaListResponse>(`/discover/movie?with_genres=${genreId}`).then((response) => requireResponse(response));
}

export function discoverByKeyword(type: MediaType, keywordId: number) {
  return tmdbFetch<MediaListResponse>(`/discover/${type}?with_keywords=${keywordId}`).then((response) => requireResponse(response));
}

export function getPersonCredits(personId: number) {
  return tmdbFetch<PersonCombinedCredits>(`/person/${personId}/combined_credits`).then((response) => requireResponse(response));
}

export function getSimilarMedia(type: MediaType, id: string | number) {
  return tmdbFetch<MediaListResponse>(`/${type}/${id}/similar`).then((response) => requireResponse(response));
}