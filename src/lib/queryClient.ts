import { QueryClient } from '@tanstack/react-query';

// Create a client with optimized defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 2 times
      retry: 2,
      // Don't refetch on window focus for better UX
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect
      refetchOnReconnect: false,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
    },
  },
});

// Query keys for consistent caching
export const queryKeys = {
  movies: {
    trending: (type: string) => ['movies', 'trending', type],
    popular: (type: string) => ['movies', 'popular', type],
    topRated: (type: string) => ['movies', 'topRated', type],
    upcoming: () => ['movies', 'upcoming'],
    nowPlaying: () => ['movies', 'nowPlaying'],
    byGenre: (genreId: number, type: 'movie' | 'tv') => ['movies', 'byGenre', genreId, type],
    byType: (type: string) => ['movies', 'byType', type],
    details: (id: number, type: 'movie' | 'tv') => ['movies', 'details', id, type],
    similar: (id: number, type: 'movie' | 'tv') => ['movies', 'similar', id, type],
    trailer: (id: number, type: 'movie' | 'tv') => ['movies', 'trailer', id, type],
    advancedSimilar: (id: number, type: 'movie' | 'tv') => ['movies', 'advancedSimilar', id, type],
  },
  search: (query: string) => ['search', query],
  genres: () => ['genres'],
  series: {
    details: (id: number) => ['series', 'details', id],
    seasons: (id: number, seasonNumber: number) => ['series', 'seasons', id, seasonNumber],
    episodes: (id: number, seasonNumber: number) => ['series', 'episodes', id, seasonNumber],
  },
} as const;
