import React, { memo, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Footer from "../Footer";
import Navbar from "../Navbar";
import { useSearch } from "../../../hooks/useApi";
import type { Movie } from "../../../hooks/useFetchMovies";
import MovieCard from "../Home/MovieCard";

const SearchPage: React.FC = memo(() => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const { data: results, isLoading, error } = useSearch(query);

  const movies = useMemo(() => {
    if (!results) return [];
    return results.map((item): Movie => ({
      id: item.id,
      title: item.title || item.name || "Unknown",
      year: item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4) || "N/A",
      genre: item.media_type === "tv" ? "TV" : "Movie",
      rating: (item.vote_average ?? 0).toFixed(1),
      backdrop: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : "",
      media_type:
        item.media_type === "movie" || item.media_type === "tv"
          ? item.media_type
          : "movie",
    }));
  }, [results]);

  return (
    <div className="bg-gray-900">
      <div className="px-18">
        <Navbar />
      </div>
      <div className="flex flex-col min-h-screen bg-gray-950 text-white font-sans">
        <main className="flex-1 px-6 sm:px-12 lg:px-24 py-8">
          <h1 className="text-2xl font-bold mb-6">
            {query
              ? `Search results for "${query}"`
              : "Type a movie or show name in the search bar"}
          </h1>

          {/* Loading state */}
          {isLoading && movies.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6" role="status" aria-live="polite">
              {/* ✅ Add hidden accessible text for screen readers and tests */}
              <span className="sr-only">Loading...</span>
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  data-testid="skeleton-card"
                  className="w-full h-64 bg-gray-800 animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-red-400">
              Error loading search results. Please try again.
            </div>
          ) : movies.length > 0 ? (
            <>
              {isLoading && (
                <p className="text-gray-400 mb-4 text-sm">Updating results...</p>
              )}
              <div
                data-testid="movies-grid"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
              >
                {movies.map((movie) => (
                  <MovieCard
                    key={`${movie.media_type}-${movie.id}`}
                    movie={movie}
                  />
                ))}
              </div>
            </>
          ) : (
            query && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No results found</div>
                <div className="text-gray-500 text-sm">
                  Try searching for a different movie or TV show
                </div>
              </div>
            )
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
});

SearchPage.displayName = "SearchPage";

export default SearchPage;
