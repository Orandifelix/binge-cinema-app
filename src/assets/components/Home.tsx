import { useState, useMemo, memo, useCallback, useEffect } from "react";
import MovieCard from "./Home/MovieCard";
import type { Movie } from "../../hooks/useFetchMovies";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useTrendingMovies,
  usePopularMovies,
  useTopRatedMovies,
  useUpcomingMovies,
  useNowPlayingMovies,
} from "../../hooks/useApi";
import type { TMDBMovie } from "../../lib/tmdb";
import type { UseQueryResult } from "@tanstack/react-query";

// Sections configuration with optimized data fetching
const sections = [
  { title: "🎬 Movies", label: "movie", hook: () => useTrendingMovies("movie") },
  { title: "📺 TV Shows", label: "tv", hook: () => useTrendingMovies("tv") },
  { title: "⭐ Top Rated", label: "top_rated", hook: () => useTopRatedMovies("movie") },
  { title: "🎞 Latest Movies", label: "latest", hook: () => useNowPlayingMovies() },
  { title: "📡 Popular TV Shows", label: "popular", hook: () => usePopularMovies("tv") },
  { title: "⏳ Coming Soon", label: "upcoming", hook: () => useUpcomingMovies() },
];

// Transform TMDB data to Movie format
const transformToMovie = (tmdbMovie: TMDBMovie): Movie => ({
  id: tmdbMovie.id,
  title: tmdbMovie.title || tmdbMovie.name || "Unknown",
  year: (tmdbMovie.release_date || tmdbMovie.first_air_date || "N/A").split("-")[0],
  genre: "N/A",
  rating: tmdbMovie.vote_average?.toFixed(1) || "0.0",
  backdrop: tmdbMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${tmdbMovie.backdrop_path}`
    : "",
  // ✅ Only allow "movie" or "tv" — fallback to "movie"
  media_type:
    tmdbMovie.media_type === "movie" || tmdbMovie.media_type === "tv"
      ? tmdbMovie.media_type
      : "movie",
});

// Section props
interface SectionProps {
  title: string;
  hook: () => UseQueryResult<TMDBMovie[], Error>;
}

// Section component
const Section: React.FC<SectionProps> = memo(({ title, hook }) => {
  const { data, isLoading, error } = hook();
  const [currentPage, setCurrentPage] = useState(0);

  // Transform data once
  const movies = useMemo(() => {
    if (!data) return [];
    return data.map(transformToMovie);
  }, [data]);

  const pageSize = 6;
  const totalPages = Math.ceil(movies.length / pageSize);

  // Paginate
  const paginatedMovies = useMemo(() => {
    return movies.slice(currentPage * pageSize, currentPage * pageSize + pageSize);
  }, [movies, currentPage]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  }, [currentPage, totalPages]);

  const handlePrev = useCallback(() => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  }, [currentPage]);

  // Reset page when data changes
  useEffect(() => {
    setCurrentPage(0);
  }, [data]);

  if (error) {
    return (
      <section className="space-y-4">
        <div className="px-2 sm:px-4">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold border-l-4 pl-3 text-white">
            {title}
          </h1>
        </div>
        <div className="px-4 text-red-400">Error loading movies</div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {/* Title */}
      <div className="px-2 sm:px-4">
        <h1
          className="text-lg sm:text-xl md:text-2xl font-bold border-l-4 pl-3 text-white"
          style={{
            borderImage: "linear-gradient(to bottom, #FFD700, #FFA500) 1",
          }}
        >
          {title}
        </h1>
      </div>

      {/* Movies Grid */}
      <div className="relative">
        {isLoading ? (
          <div className="px-2 sm:px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="w-full h-64 bg-gray-800 animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="px-2 sm:px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {paginatedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Prev / Next Buttons */}
            {currentPage > 0 && (
              <button
                onClick={handlePrev}
                className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 
                           bg-gray-800/70 hover:bg-gray-700 p-1.5 sm:p-2 
                           rounded-full shadow-md transition-colors duration-200"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </button>
            )}

            {currentPage < totalPages - 1 && (
              <button
                onClick={handleNext}
                className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 
                           bg-gray-800/70 hover:bg-gray-700 p-1.5 sm:p-2 
                           rounded-full shadow-md transition-colors duration-200"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
});

Section.displayName = "Section";

// Home component (root)
const Home: React.FC = memo(() => {
  return (
    <div className="h-auto bg-gray-950 text-white py-6 space-y-12">
      {sections.map((section, idx) => (
        <Section key={idx} title={section.title} hook={section.hook} />
      ))}
    </div>
  );
});

Home.displayName = "Home";

export default Home;
