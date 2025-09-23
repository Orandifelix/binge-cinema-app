const BASE = "https://api.themoviedb.org/3";

const getHeaders = () => ({
  Authorization: `Bearer ${import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN}`,
  accept: "application/json",
});

export type Genre = { id: number; name: string };
export type TMDBMovie = any; //   flexible atm

export async function fetchGenres(): Promise<Genre[]> {
  const res = await fetch(`${BASE}/genre/movie/list`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`fetchGenres: ${res.status}`);
  const data = await res.json();
  return data.genres ?? [];
}

/**
 * Fetch movies for a given genre id. Will page through results until `limit` items are collected (default 40).
 */
export async function fetchMoviesByGenre(genreId: number, limit = 40): Promise<TMDBMovie[]> {
  const results: TMDBMovie[] = [];
  let page = 1;
  // TMDB pages are 20 items each. Stop after 5 pages to avoid too many requests.
  while (results.length < limit && page <= 5) {
    const res = await fetch(`${BASE}/discover/movie?with_genres=${genreId}&language=en-US&page=${page}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`fetchMoviesByGenre: ${res.status}`);
    const data = await res.json();
    results.push(...(data.results ?? []));
    page++;
  }
  return results.slice(0, limit);
}

// Trailer fetch 
export async function fetchMovieTrailer(id: number): Promise<string | null> {
  const res = await fetch(`${BASE}/movie/${id}/videos?language=en-US`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`fetchMovieTrailer: ${res.status}`);
  const data = await res.json();

  const trailer = (data.results ?? []).find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  );
  return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
}

 

// Get details for a specific movie
export async function fetchMovieDetails(id: number): Promise<TMDBMovie> {
  const res = await fetch(`${BASE}/movie/${id}?language=en-US`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`fetchMovieDetails: ${res.status}`);
  return res.json();
}

// Get similar movies for a specific movie
export async function fetchSimilarMovies(id: number, limit = 12): Promise<TMDBMovie[]> {
  const res = await fetch(`${BASE}/movie/${id}/similar?language=en-US&page=1`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`fetchSimilarMovies: ${res.status}`);
  const data = await res.json();
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
        // /movie/latest returns single item — fallback to now_playing/popular
        return "/movie/now_playing";
      case "popular":
        return "/movie/popular";
      case "upcoming":
        return "/movie/upcoming";
      case "tv":
        return "/tv/popular";
      case "movie":
        return "/discover/movie?sort_by=popularity.desc";
      default:
        // try discover with type as part of path
        return `/discover/movie?sort_by=popularity.desc`;
    }
  };

  const baseEndpoint = endpointForType(type);

  while (results.length < limit && page <= maxPages) {
    const url =
      baseEndpoint.includes("?") ?
        `${BASE}${baseEndpoint}&page=${page}` :
        `${BASE}${baseEndpoint}?page=${page}`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`fetchMoviesByType '${type}': ${res.status}`);
    const data = await res.json();
    // different endpoints use `results` or a single object; normalize
    if (Array.isArray(data.results)) results.push(...data.results);
    else if (Array.isArray(data)) results.push(...data);
    page++;
  }

  return results.slice(0, limit);
}
