// --- BASE URL & HEADERS ---
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
  name?: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  runtime?: number;
  genres?: Genre[];
  media_type?: "movie" | "tv" | "person";
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

export interface Movie {
  id: number;
  title: string;
  year: string;
  genre: string;
  rating: string;
  backdrop: string;
  media_type: "movie" | "tv";
}

// --- Utility: year filter ---
const isModern = (date?: string) => {
  const year = parseInt(date?.split("-")[0] ?? "0");
  return year >= 1990;
};

// --- SEARCH (includes character/person search) ---
export async function searchMulti(query: string): Promise<TMDBMovie[]> {
  const timeless = query.toLowerCase().includes("timeless");

  const res = await fetch(
    `${BASE}/search/multi?query=${encodeURIComponent(query)}&language=en-US&include_adult=false`,
    { headers: getHeaders() }
  );

  if (!res.ok) throw new Error(`searchMulti: ${res.status}`);
  const data: { results: TMDBMovie[] } = await res.json();

  // Step 1: movies/tv shows directly matching
  const mediaResults = data.results.filter(
    (r) => r.media_type === "movie" || r.media_type === "tv"
  );

  // Step 2: people results (actors / characters)
  const personResults = data.results.filter((r) => r.media_type === "person");

  // Step 3: fetch credits for people (character-based results)
  const relatedResults: TMDBMovie[] = [];
  const seenPeople = new Set<number>();

  for (const person of personResults) {
    if (!person.id || seenPeople.has(person.id)) continue;
    seenPeople.add(person.id);

    try {
      const creditRes = await fetch(
        `${BASE}/person/${person.id}/combined_credits?language=en-US`,
        { headers: getHeaders() }
      );
      if (!creditRes.ok) continue;

      const creditsData: { cast?: TMDBMovie[] } = await creditRes.json();
      const validCredits = (creditsData.cast ?? []).filter(
        (r) => r.media_type === "movie" || r.media_type === "tv"
      );

      relatedResults.push(...validCredits);
    } catch (err) {
      console.warn("Error fetching credits for person:", person.id, err);
    }
  }

  // Step 4: merge all and filter by year if not timeless
  const allResults = [...mediaResults, ...relatedResults];
  const unique = Array.from(new Map(allResults.map((m) => [m.id, m])).values());

  return timeless
    ? unique
    : unique.filter((m) =>
        isModern(m.release_date || m.first_air_date)
      );
}

// --- GENRES ---
export async function fetchGenres(): Promise<Genre[]> {
  const res = await fetch(`${BASE}/genre/movie/list`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`fetchGenres: ${res.status}`);
  const data: { genres: Genre[] } = await res.json();
  return data.genres ?? [];
}

// --- MOVIES BY GENRE ---
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

    const filtered = (data.results ?? []).filter((m) => isModern(m.release_date));
    results.push(...filtered);
    page++;
  }

  return results.slice(0, limit);
}

// --- SERIES BY GENRE ---
export async function fetchSeriesByGenre(genreId: number, limit = 40): Promise<TMDBMovie[]> {
  const results: TMDBMovie[] = [];
  let page = 1;

  while (results.length < limit && page <= 5) {
    const res = await fetch(
      `${BASE}/discover/tv?with_genres=${genreId}&language=en-US&page=${page}`,
      { headers: getHeaders() }
    );
    if (!res.ok) throw new Error(`fetchSeriesByGenre: ${res.status}`);
    const data: { results: TMDBMovie[] } = await res.json();

    const filtered = (data.results ?? []).filter((s) => isModern(s.first_air_date));
    results.push(...filtered);
    page++;
  }

  return results.slice(0, limit);
}

// --- MOVIE DETAILS ---
export async function fetchMovieDetails(id: number): Promise<TMDBMovie> {
  const res = await fetch(`${BASE}/movie/${id}?language=en-US`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`fetchMovieDetails: ${res.status}`);
  return res.json();
}

// --- MOVIE TRAILER ---
export async function fetchMovieTrailer(id: number): Promise<string | null> {
  const res = await fetch(`${BASE}/movie/${id}/videos?language=en-US`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`fetchMovieTrailer: ${res.status}`);

  const data: { results: TMDBVideo[] } = await res.json();
  const trailer = data.results.find((v) => v.type === "Trailer" && v.site === "YouTube");
  return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
}

// --- SIMILAR MOVIES ---
export async function fetchSimilarMovies(id: number, limit = 18): Promise<TMDBMovie[]> {
  const res = await fetch(`${BASE}/movie/${id}/similar?language=en-US&page=1`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`fetchSimilarMovies: ${res.status}`);
  const data: { results: TMDBMovie[] } = await res.json();

  return (data.results ?? [])
    .filter((m) => isModern(m.release_date))
    .slice(0, limit);
}

// --- SERIES DETAILS ---
export async function fetchSeriesDetails(id: number) {
  const res = await fetch(`${BASE}/tv/${id}?language=en-US`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`fetchSeriesDetails: ${res.status}`);
  return res.json();
}

// --- SEASON DETAILS ---
export async function fetchSeasonDetails(seriesId: number, seasonNumber: number) {
  const res = await fetch(`${BASE}/tv/${seriesId}/season/${seasonNumber}?language=en-US`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`fetchSeasonDetails: ${res.status}`);
  return res.json();
}

// --- SEASON EPISODES ---
export async function fetchSeasonEpisodes(seriesId: number, seasonNumber: number): Promise<TMDBEpisode[]> {
  const season = await fetchSeasonDetails(seriesId, seasonNumber);
  return season.episodes ?? [];
}

// --- SIMILAR SERIES ---
export async function fetchSimilarSeries(id: number, limit = 18) {
  const res = await fetch(`${BASE}/tv/${id}/similar?language=en-US&page=1`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`fetchSimilarSeries: ${res.status}`);
  const data: { results: TMDBMovie[] } = await res.json();

  return (data.results ?? [])
    .filter((s) => isModern(s.first_air_date))
    .slice(0, limit);
}

// --- SERIES TRAILER ---
export async function fetchSeriesTrailer(id: number): Promise<string | null> {
  const res = await fetch(`${BASE}/tv/${id}/videos?language=en-US`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`fetchSeriesTrailer: ${res.status}`);
  const data: { results: TMDBVideo[] } = await res.json();
  const trailer = data.results.find((v) => v.type === "Trailer" && v.site === "YouTube");
  return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
}

// --- MOVIES BY TYPE ---
export async function fetchMoviesByType(type: string, limit = 60): Promise<TMDBMovie[]> {
  const results: TMDBMovie[] = [];
  let page = 1;
  const maxPages = 6;

  const endpointForType = (t: string): { url: string; media: "movie" | "tv" } => {
    switch (t) {
      case "top_rated": return { url: "/movie/top_rated", media: "movie" };
      case "latest":    return { url: "/movie/now_playing", media: "movie" };
      case "popular":   return { url: "/movie/popular", media: "movie" };
      case "upcoming":  return { url: "/movie/upcoming", media: "movie" };
      case "tv":        return { url: "/tv/popular", media: "tv" };
      case "movie":     return { url: "/discover/movie?sort_by=popularity.desc", media: "movie" };
      default:          return { url: "/discover/movie?sort_by=popularity.desc", media: "movie" };
    }
  };

  const { url: baseEndpoint, media } = endpointForType(type);

  while (results.length < limit && page <= maxPages) {
    const url = baseEndpoint.includes("?")
      ? `${BASE}${baseEndpoint}&page=${page}`
      : `${BASE}${baseEndpoint}?page=${page}`;

    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`fetchMoviesByType '${type}': ${res.status}`);

    const data: { results?: TMDBMovie[] } = await res.json();

    if (Array.isArray(data.results)) {
      const filtered = data.results
        .map((r) => ({ ...r, media_type: r.media_type ?? media }))
        .filter((item) => {
          const date = item.media_type === "movie" ? item.release_date : item.first_air_date;
          return isModern(date);
        });
      results.push(...filtered);
    }

    page++;
  }

  return results.slice(0, limit);
}
