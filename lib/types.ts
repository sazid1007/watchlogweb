/* --------------------------------------------------------------------------
   WatchLog data models
   --------------------------------------------------------------------------
   Typed shapes for the TMDB data we consume (v3 JSON API).

   TMDB quirk handled here: movie payloads use `title` / `release_date` while
   TV payloads use `name` / `first_air_date`. Both are modelled optional and
   read through the helpers at the bottom of this file (`getTitle`,
   `getReleaseDate`, ...) — always use them instead of touching the raw keys.

   Fields that only exist when requested via `append_to_response` are marked
   accordingly and are optional.
   -------------------------------------------------------------------------- */

/* Common ------------------------------------------------------------------ */

export type MediaType = "movie" | "tv";

/** What TMDB's search/discover endpoints can return in a single list. */
export type SearchMediaType = MediaType | "person";

export interface Genre {
  id: number;
  name: string;
}

/** Minimal fields shared by every media-shaped payload (list item or detail). */
export interface MediaBase {
  id: number;
  /** Movie */
  title?: string;
  /** TV show */
  name?: string;
  /** Movie */
  release_date?: string;
  /** TV show */
  first_air_date?: string;
}

/* Lists / search results ---------------------------------------------------- */

/** One entry from search, discover, trending, keyword, list, ... endpoints. */
export interface MediaResult extends MediaBase {
  media_type?: SearchMediaType;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  /** People results carry a profile image instead of a poster. */
  profile_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  adult?: boolean;
  original_language?: string;
  original_title?: string;
  original_name?: string;
  /** IDs only in list endpoints; full `Genre[]` comes from the detail endpoint. */
  genre_ids?: number[];
  /** Present on person results. */
  known_for_department?: string;
  known_for?: MediaResult[];
}

/** A person entry from `/search/person`, `/trending`, ... */
export interface PersonResult {
  id: number;
  media_type: "person";
  name: string;
  profile_path?: string | null;
  popularity?: number;
  known_for_department?: string;
  known_for?: MediaResult[];
}

export interface PagedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export type MediaListResponse = PagedResponse<MediaResult>;

/* Detail -------------------------------------------------------------------- */

/** `/movie/{id}` and `/tv/{id}` — differences between the two are optional. */
export interface MediaDetailResponse extends MediaBase {
  media_type?: MediaType;
  original_title?: string;
  original_name?: string;
  overview?: string;
  tagline?: string;
  homepage?: string;
  imdb_id?: string;
  status?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  adult?: boolean;
  original_language?: string;
  genres?: Genre[];
  genre_ids?: number[];

  /* Movie only */
  runtime?: number;
  budget?: number;
  revenue?: number;

  /* TV only */
  episode_run_time?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: Season[];
  created_by?: Creator[];
  networks?: Network[];
  in_production?: boolean;
  languages?: string[];
  next_episode_to_air?: Episode | null;
  last_episode_to_air?: Episode | null;

  /* Shared collections */
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountry[];
  spoken_languages?: SpokenLanguage[];
  belongs_to_collection?: Collection | null;

  /* Only when appended with `append_to_response=...` */
  credits?: CreditsResponse;
  videos?: VideosResponse;
  keywords?: KeywordsResponse;
  "watch/providers"?: WatchProvidersResponse;
  similar?: MediaListResponse;
  recommendations?: MediaListResponse;
  images?: ImagesResponse;
  external_ids?: ExternalIds;
}

export interface ProductionCompany {
  id: number;
  logo_path?: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name?: string;
  iso_639_1: string;
  name: string;
}

export interface Collection {
  id: number;
  name: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
}

export interface Season {
  id: number;
  air_date?: string | null;
  episode_count: number;
  name: string;
  overview?: string;
  poster_path?: string | null;
  season_number: number;
  vote_average?: number;
}

export interface Episode {
  id: number;
  air_date?: string | null;
  episode_number: number;
  name?: string;
  overview?: string;
  season_number: number;
  still_path?: string | null;
  vote_average?: number;
}

export interface Network {
  id: number;
  logo_path?: string | null;
  name: string;
  origin_country?: string;
}

export interface Creator {
  id: number;
  credit_id?: string;
  name: string;
  gender?: number;
  profile_path?: string | null;
}

export interface ExternalIds {
  imdb_id?: string | null;
  facebook_id?: string | null;
  instagram_id?: string | null;
  twitter_id?: string | null;
  /** TV only */
  tvdb_id?: number | null;
  tvrage_id?: number | null;
}

/* Credits -------------------------------------------------------------------- */

export interface Cast {
  id: number;
  credit_id?: string;
  name: string;
  original_name?: string;
  gender?: number;
  profile_path?: string | null;
  character?: string;
  /** Movie credits */
  cast_id?: number;
  /** Order of appearance in the cast list */
  order?: number;
  known_for_department?: string;
}

export interface Crew {
  id: number;
  credit_id?: string;
  name: string;
  original_name?: string;
  gender?: number;
  profile_path?: string | null;
  job: string;
  department: string;
}

export interface CreditsResponse {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

/** `/person/{id}` detail payload (actor pages). */
export interface PersonDetailResponse {
  id: number;
  name: string;
  biography?: string;
  birthday?: string | null;
  deathday?: string | null;
  gender?: number;
  height?: number;
  known_for_department?: string;
  also_known_as?: string[];
  place_of_birth?: string | null;
  profile_path?: string | null;
  popularity?: number;
  imdb_id?: string;
  homepage?: string | null;
  /** Only when appended with `append_to_response=combined_credits` */
  combined_credits?: PersonCombinedCredits;
}

export interface PersonCombinedCredits {
  id: number;
  cast?: MediaResult[];
  crew?: MediaResult[];
}

/* Videos ---------------------------------------------------------------------- */

export interface Video {
  id?: string;
  /** YouTube video key, e.g. "dQw4w9WgXcQ" */
  key: string;
  name: string;
  site: string;
  type: string;
  official?: boolean;
  published_at?: string;
  iso_639_1?: string;
  iso_3166_1?: string;
  /** Localised `name` for the requested language */
  localized_name?: string;
}

export interface VideosResponse {
  id: number;
  results: Video[];
}

/* Keywords -------------------------------------------------------------------- */

export interface Keyword {
  id: number;
  name: string;
}

export interface KeywordsResponse {
  id: number;
  /** `/keyword` payloads; some TV responses field it as `results`. */
  keywords?: Keyword[];
  results?: Keyword[];
}

/* Watch providers -------------------------------------------------------------- */

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
  display_priority?: number;
}

/** One country's catalogue: `results` of `/watch/{type}/{id}` region buckets. */
export interface WatchProviderCatalog {
  link?: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  ads?: WatchProvider[];
  free?: WatchProvider[];
}

/** `/movie/{id}/watch/providers`, `/tv/{id}/watch/providers`. */
export interface WatchProvidersResponse {
  id: number;
  /** Keyed by ISO 3166-1 country code, e.g. "US". */
  results: Record<string, WatchProviderCatalog>;
}

/* Images ------------------------------------------------------------------------ */

export interface ImageItem {
  aspect_ratio: number;
  height: number;
  width: number;
  file_path: string;
  vote_average?: number;
  vote_count?: number;
}

export interface ImagesResponse {
  id?: number;
  backdrops?: ImageItem[];
  posters?: ImageItem[];
  logos?: ImageItem[];
  profiles?: ImageItem[];
}

/* Account state (watchlist / ratings — journal features) ------------------------- */

export interface AccountStateResponse {
  id: number;
  /** `false` when not rated, otherwise `{ value: 1..10 }`. */
  rated?: { value: number } | false;
  favorite?: boolean;
  watchlist?: boolean;
}

/* Helpers ------------------------------------------------------------------------ */

/** Display title: `title` for movies, `name` for TV shows and people. */
export function getTitle(media: MediaBase): string {
  return media.title ?? media.name ?? "";
}

/** Release date: `release_date` for movies, `first_air_date` for TV shows. */
export function getReleaseDate(media: MediaBase): string {
  return media.release_date ?? media.first_air_date ?? "";
}

/** Release year, or an empty string when the date is missing. */
export function getYear(media: MediaBase): string {
  const date = getReleaseDate(media);
  return date ? date.slice(0, 4) : "";
}

/**
 * Media type of a payload. Uses `media_type` when present (search/discover
 * results); otherwise falls back to movie when the payload carries a `title`.
 */
export function getMediaType(
  media: MediaBase & { media_type?: SearchMediaType },
): MediaType {
  if (media.media_type === "movie" || media.media_type === "tv") {
    return media.media_type;
  }
  return media.title !== undefined ? "movie" : "tv";
}

/** In-app route for a media payload: `/detail/movie/550`, `/detail/tv/1396`. */
export function mediaHref(
  media: MediaBase & { media_type?: SearchMediaType },
): string {
  return `/detail/${getMediaType(media)}/${media.id}`;
}
