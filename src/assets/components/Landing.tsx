import { useState, useEffect } from "react";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";

const Landing = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerOpen, setTrailerOpen] = useState(false);

  // Fetch movies from json-server
  useEffect(() => {
    fetch("http://localhost:5000/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

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
      <button
        onClick={prevMovie}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black p-2 sm:p-3 rounded-full"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>

      <button
        onClick={nextMovie}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black p-2 sm:p-3 rounded-full"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>

      {/* Content */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 h-full text-white">
        {/* Left column (Movie Info) */}
        <div className="flex flex-col justify-center px-6 sm:px-8 py-8 space-y-4 md:col-span-1">
          <span className="bg-white text-black px-3 py-1 text-xs rounded-full w-fit">
            Trending Now
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            {movie.title}
          </h1>

          <p className="text-xs sm:text-sm space-x-2 sm:space-x-3">
            <span>{movie.year}</span>
            <span>• {movie.runtime}</span>
            <span>• {movie.genre}</span>
            <span>⭐ {movie.rating}</span>
          </p>

          <p className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-md text-xs sm:text-sm md:text-base max-w-md">
            {movie.overview}
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setTrailerOpen(true)}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm"
            >
              <Play className="w-4 h-4" />
              <span>Watch Trailer</span>
            </button>

            <button className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm">
              <Info className="w-4 h-4" />
              <span>More Info</span>
            </button>
          </div>
        </div>

        {/* Middle column (Play button at center, hidden on small screens) */}
        <div className="hidden md:flex items-center justify-center col-span-1">
          <button
            onClick={() => setTrailerOpen(true)}
            className="bg-white/70 hover:bg-white p-6 rounded-full shadow-lg transition"
          >
            <Play className="w-10 h-10 text-black" />
          </button>
        </div>

        {/* Right column (optional filler for layout balance) */}
        <div className="hidden md:block"></div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 sm:bottom-6 w-full flex justify-center space-x-2 z-20">
        {movies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
              idx === currentIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Trailer Modal */}
      {trailerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-3xl aspect-video bg-black rounded-md overflow-hidden">
            <iframe
              src={movie.trailerUrl}
              title="Trailer"
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            <button
              onClick={() => setTrailerOpen(false)}
              className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-2 rounded-md"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Landing;
