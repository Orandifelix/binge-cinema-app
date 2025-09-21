import { useState, useEffect } from "react";

import Content from "./Landing/Content";
import Next_previous from "./Landing/Next_previous";
import PlayModal from "./Landing/Play_modal";

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

const Landing = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState<string>("");

  // ✅ Fetch trending movies (with details + trailer)
  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const res = await fetch("https://api.themoviedb.org/3/trending/movie/week", {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN}`,
            accept: "application/json",
          },
        });

        if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
        const data = await res.json();

        const detailedMovies = await Promise.all(
          data.results.map(async (movie: any) => {
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

              const details = await detailsRes.json();

              const trailer = details.videos?.results?.find(
                (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
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
                  ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
                  : "",
                trailerUrl: trailer ? `https://www.youtube.com/embed/${trailer.key}` : null,
              };
            } catch (err) {
              console.error("Error fetching movie details:", err);
              return null;
            }
          })
        );

        setMovies(detailedMovies.filter(Boolean) as Movie[]);
      } catch (err) {
        console.error("Error fetching trending movies:", err);
      }
    };

    fetchTrendingMovies();
  }, []);

  // ✅ Open trailer modal
  const playTrailer = (movieId: number) => {
    const movie = movies.find((m) => m.id === movieId);
    if (movie?.trailerUrl) {
      setTrailerUrl(movie.trailerUrl);
      setTrailerOpen(true);
    } else {
      console.warn("No trailer available for this movie");
    }
  };

  // ✅ Auto-slide carousel
  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [movies]);

  if (movies.length === 0) {
    return (
      <section className="flex items-center justify-center w-full h-screen bg-black text-white">
        <p>Loading movies...</p>
      </section>
    );
  }

  const movie = movies[currentIndex];

  const prevMovie = () => {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  const nextMovie = () => {
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      className="relative w-full h-screen bg-cover bg-center transition-all duration-700"
      style={{ backgroundImage: `url(${movie.backdrop})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Navigation Arrows */}
      <Next_previous prevMovie={prevMovie} nextMovie={nextMovie} />

      {/* Content */}
      <Content movie={movie} playTrailer={playTrailer} />

      {/* Pagination Dots */}
      <div className="absolute bottom-4 sm:bottom-6 w-full flex justify-center space-x-2 z-20">
        {movies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors duration-300 ${
              idx === currentIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Trailer Modal */}
      <PlayModal
        trailerOpen={trailerOpen}
        trailerUrl={trailerUrl}
        onClose={() => setTrailerOpen(false)}
      />
    </section>
  );
};

export default Landing;
