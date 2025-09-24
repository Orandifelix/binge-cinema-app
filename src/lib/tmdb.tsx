const BASE = "https://api.themoviedb.org/3";

const getHeaders = () => ({
  Authorization: `Bearer ${import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN}`,
  accept: "application/json",
});

// --- TYPES ---
export type Genre = { id: number; name: string };

export interface TMDBMovie {
  id: number;
  title: string;
  overview?: string;
  release_date?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  runtime?: number;
  genres?: Genre[];
  [key: string]: unknown; // fallback for other fields
}

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

// --- FUNCTIONS ---

export async function fetchGenres(): Promise<Genre[]> {
  const res = await fetch(`${BASE}/genre/movie/list`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`fetchGenres: ${res.status}`);
  const data: { genres: Genre[] } = await res.json();
  return data.genres ?? [];
}

/**
 * Fetch movies for a given genre id. Will page through results until `limit` items are collected (default 40).
 */
export async function fetchMoviesByGenre(genreId: number, limit = 40): Promise<TMDBMovie[]> {
  const results: TMDBMovie[] = [];
  let page = 1;

  while (results.length < limit && page <= 5) {
    const res = await fetch(`${BASE}/discover/movie?with_genres=${genreId}&language=en-US&page=${page}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`fetchMoviesByGenre: ${res.status}`);
    const data: { results: TMDBMovie[] } = await res.json();
    results.push(...(data.results ?? []));
    page++;
  }

  return results.slice(0, limit);
}

export async function fetchMovieTrailer(id: number): Promise<string | null> {
  const res = await fetch(`${BASE}/movie/${id}/videos?language=en-US`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`fetchMovieTrailer: ${res.status}`);

  const data: { results: TMDBVideo[] } = await res.json();
  const trailer = data.results.find((v) => v.type === "Trailer" && v.site === "YouTube");
  return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
}

export async function fetchMovieDetails(id: number): Promise<TMDBMovie> {
  const res = await fetch(`${BASE}/movie/${id}?language=en-US`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`fetchMovieDetails: ${res.status}`);
  return res.json();
}

export async function fetchSimilarMovies(id: number, limit = 12): Promise<TMDBMovie[]> {
  const res = await fetch(`${BASE}/movie/${id}/similar?language=en-US&page=1`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`fetchSimilarMovies: ${res.status}`);
  const data: { results: TMDBMovie[] } = await res.json();
  return (data.results ?? []).slice(0, limit);
}

/**
 * Fetch "type" lists like popular, top_rated, upcoming, or generic discover by media type.
 * type param examples: "movie", "tv", "top_rated", "popular", "upcoming", "latest"
 * Will collect ~limit items (default 60) by paging the appropriate endpoint.
 */
export async function fetchMoviesByType(type: string, limit = 60): Promise<TMDBMovie[]> {
  const results: TMDBMovie[] = [];
  let page = 1;
  const maxPages = 6;

  const endpointForType = (t: string) => {
    switch (t) {
      case "top_rated":
        return "/movie/top_rated";
      case "latest":
        return "/movie/now_playing"; // latest returns single movie, fallback
      case "popular":
        return "/movie/popular";
      case "upcoming":
        return "/movie/upcoming";
      case "tv":
        return "/tv/popular";
      case "movie":
        return "/discover/movie?sort_by=popularity.desc";
      default:
        return "/discover/movie?sort_by=popularity.desc";
    }
  };

  const baseEndpoint = endpointForType(type);

  while (results.length < limit && page <= maxPages) {
    const url = baseEndpoint.includes("?")
      ? `${BASE}${baseEndpoint}&page=${page}`
      : `${BASE}${baseEndpoint}?page=${page}`;

    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`fetchMoviesByType '${type}': ${res.status}`);

    const data: { results?: TMDBMovie[] } | TMDBMovie[] = await res.json();

    if (Array.isArray(data)) results.push(...data);
    else if (Array.isArray(data.results)) results.push(...data.results);

    page++;
  }

  return results.slice(0, limit);
}
