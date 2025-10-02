// --- BASE & HEADERS ---
const BASE = "https://api.themoviedb.org/3";

const getHeaders = () => ({
  Authorization: `Bearer ${import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN}`,
  accept: "application/json",
});



// --- TYPES ---
export type Genre = { id: number; name: string };

export interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;                // TV uses "name"
  overview?: string;
  release_date?: string;        // Movies
  first_air_date?: string;      // TV
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  runtime?: number;             // Only for movies
  genres?: Genre[];
  media_type?: "movie" | "tv";  // Sometimes included in multi endpoints
  [key: string]: unknown;
}

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface TMDBEpisode {
  id: number;
  name: string;
  still_path: string | null;
  episode_number: number;
}

// Simplified Movie type for your frontend
export interface Movie {
  id: number;
  title: string;
  year: string;
  genre: string;
  rating: string;
  backdrop: string;
  media_type: "movie" | "tv";
}


// --- SEARCH ---
export async function searchMulti(query: string): Promise<TMDBMovie[]> {
  const res = await fetch(
    `${BASE}/search/multi?query=${encodeURIComponent(query)}&language=en-US`,
    { headers: getHeaders() }
  );
  if (!res.ok) throw new Error(`searchMulti: ${res.status}`);
  const data: { results: TMDBMovie[] } = await res.json();

  return data.results.filter(
    (r) => r.media_type === "movie" || r.media_type === "tv"
  );
}



// --- GENRES ---
export async function fetchGenres(): Promise<Genre[]> {
  const res = await fetch(`${BASE}/genre/movie/list`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`fetchGenres: ${res.status}`);
  const data: { genres: Genre[] } = await res.json();
  return data.genres ?? [];
}

// --- MOVIES ---
export async function fetchMoviesByGenre(genreId: number, limit = 40): Promise<TMDBMovie[]> {
  const results: TMDBMovie[] = [];
  let page = 1;

  while (results.length < limit && page <= 5) {
    const res = await fetch(
      `${BASE}/discover/movie?with_genres=${genreId}&language=en-US&page=${page}`,
      { headers: getHeaders() }
    );
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

// --- SERIES ---
export async function fetchSeriesDetails(id: number) {
  const res = await fetch(`${BASE}/tv/${id}?language=en-US`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`fetchSeriesDetails: ${res.status}`);
  return res.json();
}

export async function fetchSeasonDetails(seriesId: number, seasonNumber: number) {
  const res = await fetch(`${BASE}/tv/${seriesId}/season/${seasonNumber}?language=en-US`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`fetchSeasonDetails: ${res.status}`);
  return res.json();
}

// ✅ Only episodes array
export async function fetchSeasonEpisodes(seriesId: number, seasonNumber: number): Promise<TMDBEpisode[]> {
  const season = await fetchSeasonDetails(seriesId, seasonNumber);
  return season.episodes ?? [];
}

export async function fetchSimilarSeries(id: number, limit = 12) {
  const res = await fetch(`${BASE}/tv/${id}/similar?language=en-US&page=1`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`fetchSimilarSeries: ${res.status}`);
  const data: { results: TMDBMovie[] } = await res.json();
  return (data.results ?? []).slice(0, limit);
}

export async function fetchSeriesTrailer(id: number): Promise<string | null> {
  const res = await fetch(`${BASE}/tv/${id}/videos?language=en-US`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`fetchSeriesTrailer: ${res.status}`);
  const data: { results: TMDBVideo[] } = await res.json();
  const trailer = data.results.find((v) => v.type === "Trailer" && v.site === "YouTube");
  return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
}

// --- GENERIC TYPE FETCH ---
export async function fetchMoviesByType(type: string, limit = 60): Promise<TMDBMovie[]> {
  const results: TMDBMovie[] = [];
  let page = 1;
  const maxPages = 6;

  const endpointForType = (t: string) => {
    switch (t) {
      case "top_rated": return "/movie/top_rated";
      case "latest":    return "/movie/now_playing"; // "latest" returns 1 item, so fallback
      case "popular":   return "/movie/popular";
      case "upcoming":  return "/movie/upcoming";
      case "tv":        return "/tv/popular";
      case "movie":     return "/discover/movie?sort_by=popularity.desc";
      default:          return "/discover/movie?sort_by=popularity.desc";
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
