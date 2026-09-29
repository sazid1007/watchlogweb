/* --------------------------------------------------------------------------
   WatchLog TMDB client (v3 JSON API)
   --------------------------------------------------------------------------
   Small typed wrapper around https://api.themoviedb.org/3/ — every helper
   throws on a non-2xx response so callers can treat a failed request as an
   error instead of silently rendering an empty payload.

   Auth: NEXT_PUBLIC_TMDB_API_KEY (see .env.local.example).
   Images: paths returned by the API are relative (`/abc.jpg`) — build an
   absolute URL with `tmdbImageUrl()`.
   -------------------------------------------------------------------------- */

import type {
  MediaDetailResponse,
  MediaListResponse,
  MediaType,
  PersonCombinedCredits,
} from "./types";

export const TMDB_API_BASE_URL = "https://api.themoviedb.org/3/";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

/** Absolute URL for a TMDB image path, or `null` when the path is missing. */
export function tmdbImageUrl(path: string | null | undefined): string | null {
  return path ? `${TMDB_IMAGE_BASE_URL}${path}` : null;
}

function getApiKey(): string {
  const key = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!key) {
    throw new Error(
      "TMDB API key missing: set NEXT_PUBLIC_TMDB_API_KEY in .env.local (see .env.local.example).",
    );
  }
  return key;
}

/** GET `path` against the v3 API. Throws when TMDB answers with an error status. */
async function tmdbGet<T>(
  path: string,
  params: Record<string, string | number> = {},
): Promise<T> {
  const url = new URL(path, TMDB_API_BASE_URL);
  url.searchParams.set("api_key", getApiKey());
  url.searchParams.set("language", "en-US");

  for (const [name, value] of Object.entries(params)) {
    url.searchParams.set(name, String(value));
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(
      `TMDB request failed: GET ${path} → ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as T;
}

/** Trending movies, TV shows and people for today: `trending/all/day`. */
export function getTrending(): Promise<MediaListResponse> {
  return tmdbGet<MediaListResponse>("trending/all/day");
}

/** `search/multi` — movies, TV shows and people matching `query`. */
export function searchMedia(query: string): Promise<MediaListResponse> {
  return tmdbGet<MediaListResponse>("search/multi", { query });
}

/** `discover/movie?with_genres=` — movies belonging to one genre. */
export function discoverByGenre(genreId: number): Promise<MediaListResponse> {
  return tmdbGet<MediaListResponse>("discover/movie", { with_genres: genreId });
}

/** `discover/{movie|tv}?with_keywords=` — one media type for one keyword. */
export function discoverByKeyword(
  mediaType: MediaType,
  keywordId: number,
): Promise<MediaListResponse> {
  return tmdbGet<MediaListResponse>(`discover/${mediaType}`, {
    with_keywords: keywordId,
  });
}

/** `person/{id}/combined_credits` — a person's full filmography (cast + crew). */
export function getPersonCredits(personId: number): Promise<PersonCombinedCredits> {
  return tmdbGet<PersonCombinedCredits>(`person/${personId}/combined_credits`);
}

/** `movie/{id}` or `tv/{id}` with the related, credits, and media metadata. */
export function getMediaDetail(
  mediaType: MediaType,
  id: number,
): Promise<MediaDetailResponse> {
  return tmdbGet<MediaDetailResponse>(`${mediaType}/${id}`, {
    append_to_response:
      "credits,videos,keywords,recommendations,similar,images,watch/providers",
    include_image_language: "en,null",
  });
}

/** `movie/{id}/similar` or `tv/{id}/similar` — suggested titles for the detail page. */
export function getSimilarMedia(
  mediaType: MediaType,
  id: number,
): Promise<MediaListResponse> {
  return tmdbGet<MediaListResponse>(`${mediaType}/${id}/similar`);
}
