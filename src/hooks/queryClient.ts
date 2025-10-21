// src/hooks/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const queryKeys = {
  movies: {
    trending: (type: string) => ["movies", "trending", type],
    popular: (type: string) => ["movies", "popular", type],
    topRated: (type: string) => ["movies", "topRated", type],
    upcoming: () => ["movies", "upcoming"],
    nowPlaying: () => ["movies", "nowPlaying"],
    details: (id: number, type: string) => ["movies", "details", id, type],
    trailer: (id: number, type: string) => ["movies", "trailer", id, type],
    similar: (id: number, type: string) => ["movies", "similar", id, type],
    byGenre: (genreId: number, type: string) => ["movies", "genre", genreId, type],
    byType: (type: string) => ["movies", "type", type],
  },
  series: {
    details: (id: number) => ["series", "details", id],
    seasons: (seriesId: number, seasonNumber: number) => [
      "series",
      "season",
      seriesId,
      seasonNumber,
    ],
    episodes: (seriesId: number, seasonNumber: number) => [
      "series",
      "episodes",
      seriesId,
      seasonNumber,
    ],
  },
  search: (query: string) => ["search", query],
  genres: () => ["genres"],
};
