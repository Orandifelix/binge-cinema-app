/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from './queryClient';
import type { TMDBMovie, Genre, TMDBVideo, TMDBEpisode } from '../lib/tmdb';

// ✅ Export these types for other components (like Home.tsx)
export type { TMDBMovie, Genre, TMDBVideo, TMDBEpisode };

// Base API setup
const BASE_URL = 'https://api.themoviedb.org/3';
const getHeaders = () => ({
  Authorization: `Bearer ${import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN}`,
  accept: 'application/json',
});

// Helper: detect modern movies
const isModern = (date?: string) => {
  const year = parseInt(date?.split('-')[0] ?? '0');
  return year >= 1990;
};

// Generic fetch with error handling
async function fetchWithErrorHandling<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
  return res.json();
}

// ---------------------------
// 🔹 TRENDING / POPULAR / TOP-RATED
// ---------------------------
export function useTrendingMovies(type: 'movie' | 'tv' | 'all' = 'all') {
  return useQuery({
    queryKey: queryKeys.movies.trending(type),
    queryFn: async () => {
      const data = await fetchWithErrorHandling<{ results: TMDBMovie[] }>(
        `${BASE_URL}/trending/${type}/week?language=en-US&page=1`
      );
      return data.results.filter(m => isModern(m.release_date || m.first_air_date));
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function usePopularMovies(type: 'movie' | 'tv' = 'movie') {
  return useQuery({
    queryKey: queryKeys.movies.popular(type),
    queryFn: async () => {
      const data = await fetchWithErrorHandling<{ results: TMDBMovie[] }>(
        `${BASE_URL}/${type}/popular?language=en-US&page=1`
      );
      return data.results.filter(m => isModern(m.release_date || m.first_air_date));
    },
  });
}

export function useTopRatedMovies(type: 'movie' | 'tv' = 'movie') {
  return useQuery({
    queryKey: queryKeys.movies.topRated(type),
    queryFn: async () => {
      const data = await fetchWithErrorHandling<{ results: TMDBMovie[] }>(
        `${BASE_URL}/${type}/top_rated?language=en-US&page=1`
      );
      return data.results.filter(m => isModern(m.release_date || m.first_air_date));
    },
  });
}

export function useUpcomingMovies() {
  return useQuery({
    queryKey: queryKeys.movies.upcoming(),
    queryFn: async () => {
      const data = await fetchWithErrorHandling<{ results: TMDBMovie[] }>(
        `${BASE_URL}/movie/upcoming?language=en-US&page=1`
      );
      return data.results.filter(m => isModern(m.release_date));
    },
  });
}

export function useNowPlayingMovies() {
  return useQuery({
    queryKey: queryKeys.movies.nowPlaying(),
    queryFn: async () => {
      const data = await fetchWithErrorHandling<{ results: TMDBMovie[] }>(
        `${BASE_URL}/movie/now_playing?language=en-US&page=1`
      );
      return data.results.filter(m => isModern(m.release_date));
    },
  });
}

// ---------------------------
// 🔹 DETAILS / TRAILER / SIMILAR
// ---------------------------
export function useMovieDetails(id: number, type: 'movie' | 'tv') {
  return useQuery({
    queryKey: queryKeys.movies.details(id, type),
    queryFn: () => fetchWithErrorHandling<TMDBMovie>(`${BASE_URL}/${type}/${id}?language=en-US`),
  });
}

export function useMovieTrailer(id: number, type: 'movie' | 'tv') {
  return useQuery({
    queryKey: queryKeys.movies.trailer(id, type),
    queryFn: async () => {
      const data = await fetchWithErrorHandling<{ results: TMDBVideo[] }>(
        `${BASE_URL}/${type}/${id}/videos?language=en-US`
      );
      const trailer = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
      return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
    },
    enabled: !!id,
  });
}

export function useSimilarMovies(id: number, type: 'movie' | 'tv', limit?: number) {
  const maxResults = limit ?? 18; // ✅ assign internally, avoiding "unused var" warning

  return useQuery({
    queryKey: queryKeys.movies.similar(id, type),
    queryFn: async () => {
      const data = await fetchWithErrorHandling<{ results: TMDBMovie[] }>(
        `${BASE_URL}/${type}/${id}/similar?language=en-US&page=1`
      );
      return data.results
        .filter(m => isModern(m.release_date || m.first_air_date))
        .slice(0, maxResults);
    },
    enabled: !!id,
  });
}


// ---------------------------
// 🔹 SEARCH / GENRES / BY GENRE
// ---------------------------
export function useSearch(query: string) {
  return useQuery({
    queryKey: queryKeys.search(query),
    queryFn: async () => {
      if (!query.trim()) return [];
      const data = await fetchWithErrorHandling<{ results: TMDBMovie[] }>(
        `${BASE_URL}/search/multi?query=${encodeURIComponent(query)}&language=en-US&include_adult=false`
      );
      return data.results.filter(i => i.media_type === 'movie' || i.media_type === 'tv');
    },
    enabled: !!query.trim(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useGenres() {
  return useQuery({
    queryKey: queryKeys.genres(),
    queryFn: async () => {
      const data = await fetchWithErrorHandling<{ genres: Genre[] }>(
        `${BASE_URL}/genre/movie/list?language=en-US`
      );
      return data.genres;
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useMoviesByGenre(genreId: number, type: 'movie' | 'tv' = 'movie', _limit = 40) {
  return useInfiniteQuery({
    queryKey: queryKeys.movies.byGenre(genreId, type),
    queryFn: async ({ pageParam = 1 }) => {
      const data = await fetchWithErrorHandling<{ results: TMDBMovie[] }>(
        `${BASE_URL}/discover/${type}?with_genres=${genreId}&language=en-US&page=${pageParam}`
      );
      return {
        results: data.results.filter(m => isModern(m.release_date || m.first_air_date)),
        nextPage: pageParam < 5 ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: lastPage => lastPage.nextPage,
    initialPageParam: 1,
    enabled: !!genreId,
  });
}

// ---------------------------
// 🔹 SERIES / SEASON DETAILS
// ---------------------------
export function useSeriesDetails(id: number) {
  return useQuery({
    queryKey: queryKeys.series.details(id),
    queryFn: () => fetchWithErrorHandling<TMDBMovie>(`${BASE_URL}/tv/${id}?language=en-US`),
    enabled: !!id,
  });
}

export function useSeasonDetails(seriesId: number, seasonNumber: number) {
  return useQuery({
    queryKey: queryKeys.series.seasons(seriesId, seasonNumber),
    queryFn: () =>
      fetchWithErrorHandling<{ episodes: TMDBEpisode[] }>(
        `${BASE_URL}/tv/${seriesId}/season/${seasonNumber}?language=en-US`
      ),
    enabled: !!seriesId && !!seasonNumber,
  });
}

export function useSeasonEpisodes(seriesId: number, seasonNumber: number) {
  return useQuery({
    queryKey: queryKeys.series.episodes(seriesId, seasonNumber),
    queryFn: async () => {
      const data = await fetchWithErrorHandling<{ episodes: TMDBEpisode[] }>(
        `${BASE_URL}/tv/${seriesId}/season/${seasonNumber}?language=en-US`
      );
      return data.episodes || [];
    },
    enabled: !!seriesId && !!seasonNumber,
  });
}
