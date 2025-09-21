import { useState, useEffect } from "react";

import Content from "./Landing/Content";
import Next_previous from "./Landing/Next_previous";
import PlayModal from "./Landing/Play_modal";

const Landing = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerOpen, setTrailerOpen] = useState(false);

  // Fetch movies (TMDB Trending)
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_TMDB_BASE_URL}/trending/movie/week`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN}`,
            },
          }
        );
  
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
  
        const data = await res.json();
  
        const mapped = (data.results || []).map((m: any) => ({
          id: m.id,
          title: m.title,
          overview: m.overview,
          year: m.release_date ? m.release_date.split("-")[0] : "N/A",
          rating: m.vote_average,
          backdrop: `https://image.tmdb.org/t/p/original${m.backdrop_path}`,
          poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
          genre_ids: m.genre_ids,
          trailerUrl: "",
        }));
  
        setMovies(mapped);
      } catch (err) {
        console.error("Error fetching trending movies:", err);
      }
    };
  
    fetchTrending();
  }, []);
  

  // Auto-slide every 6 seconds
  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === movies.length - 1 ? 0 : prev + 1
      );
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
      <Content movie={movie} setTrailerOpen={setTrailerOpen} />

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
        trailerUrl={movie.trailerUrl}
        onClose={() => setTrailerOpen(false)}
      />
    </section>
  );
};

export default Landing;
