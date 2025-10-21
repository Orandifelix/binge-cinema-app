import { useState, useEffect, memo, useCallback } from "react";
import Content from "./Landing/Content";
import Next_previous from "./Landing/Next_previous";
import PlayModal from "./Landing/Play_modal";
import { useTrendingMovies } from "../../hooks/useApi";
import type { TMDBVideo } from "../../lib/tmdb"; // ✅ import the proper type

// Movie type for internal state
interface Movie {
  id: number;
  title: string;
  year: string;
  runtime: string;
  genre: string;
  rating: number;
  overview: string;
  backdrop: string;
  trailerUrl?: string | null;
}

const Landing: React.FC = memo(() => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState<string>("");

  // Use React Query for trending movies
  const { data: trendingMovies, isLoading, error } = useTrendingMovies("movie");

  // Transform trending movies to detailed movie format
  useEffect(() => {
    if (!trendingMovies) return;

    const fetchMovieDetails = async () => {
      try {
        const detailedMovies: (Movie | null)[] = await Promise.all(
          trendingMovies.slice(0, 10).map(async (movie) => {
            try {
              const detailsRes = await fetch(
                `https://api.themoviedb.org/3/movie/${movie.id}?append_to_response=videos`,
                {
                  headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN}`,
                    accept: "application/json",
                  },
                }
              );

              if (!detailsRes.ok) return null;
              const details = await detailsRes.json();

              // ✅ Use the correct type for the trailer
              const trailer = details.videos?.results.find(
                (vid: TMDBVideo) => vid.type === "Trailer" && vid.site === "YouTube"
              );

              return {
                id: details.id,
                title: details.title,
                year: details.release_date?.split("-")[0] || "N/A",
                runtime: details.runtime ? `${details.runtime} min` : "N/A",
                genre: details.genres?.[0]?.name || "N/A",
                rating: details.vote_average || 0,
                overview: details.overview,
                backdrop: details.backdrop_path
                  ? `https://image.tmdb.org/t/p/w1280${details.backdrop_path}`
                  : "",
                trailerUrl: trailer ? `https://www.youtube.com/embed/${trailer.key}` : null,
              };
            } catch (err) {
              console.error("Error fetching movie details:", err);
              return null;
            }
          })
        );

        // Filter out nulls and set movies
        setMovies(detailedMovies.filter((m): m is Movie => m !== null));
      } catch (err) {
        console.error("Error processing movie details:", err);
      }
    };

    fetchMovieDetails();
  }, [trendingMovies]);

  // Open trailer modal
  const playTrailer = useCallback(
    (movieId: number) => {
      const movie = movies.find((m) => m.id === movieId);
      if (movie?.trailerUrl) {
        setTrailerUrl(movie.trailerUrl);
        setTrailerOpen(true);
      } else {
        console.warn("No trailer available for this movie");
      }
    },
    [movies]
  );

  // Auto-slide carousel
  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [movies]);

  const prevMovie = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  }, [movies.length]);

  const nextMovie = useCallback(() => {
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  }, [movies.length]);

  const closeTrailer = useCallback(() => {
    setTrailerOpen(false);
  }, []);

  // Loading state
  if (isLoading || movies.length === 0) {
    return (
      <section className="flex items-center justify-center w-full h-screen bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p>Loading movies...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="flex items-center justify-center w-full h-screen bg-black text-white">
        <div className="text-center">
          <p className="text-red-400">Error loading movies</p>
        </div>
      </section>
    );
  }

  const movie = movies[currentIndex];

  return (
    <section
      className="relative w-full h-screen bg-cover bg-center transition-all duration-700"
      style={{ backgroundImage: `url(${movie.backdrop})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <Next_previous prevMovie={prevMovie} nextMovie={nextMovie} />
      <Content movie={movie} playTrailer={playTrailer} />

      <div className="absolute bottom-4 sm:bottom-6 w-full flex justify-center space-x-2 z-20">
        {movies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors duration-300 ${
              idx === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      <PlayModal
        trailerOpen={trailerOpen}
        trailerUrl={trailerUrl}
        onClose={closeTrailer}
      />
    </section>
  );
});

Landing.displayName = "Landing";

export default Landing;
