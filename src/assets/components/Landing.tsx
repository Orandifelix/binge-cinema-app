import { useState } from "react";
import { Play, Info } from "lucide-react";

const Landing = () => {
  const [trailerOpen, setTrailerOpen] = useState(false);

  const movie = {
    title: "Midnight Hunter",
    year: "2024",
    runtime: "2h 15m",
    genre: "Action",
    rating: "8.9",
    overview:
      "In a world where time and space collide, a team of scientists must prevent the collapse of reality itself. An epic sci-fi adventure that pushes the boundaries of imagination.",
    backdrop:
      "https://image.tmdb.org/t/p/original/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg",
    trailerUrl: "https://www.youtube.com/embed/abc123",
  };

  return (
    <section
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${movie.backdrop})` }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* 3-column grid */}
      <div className="relative z-10 grid grid-cols-3 h-full text-white">
        {/* Left column (Movie Info) */}
        <div className="flex flex-col justify-center px-8 space-y-4">
          <span className="bg-white text-black px-3 py-1 text-xs rounded-full w-fit">
            Trending Now
          </span>

          <h1 className="text-4xl md:text-5xl font-bold">{movie.title}</h1>

          <p className="text-sm space-x-3">
            <span>{movie.year}</span>
            <span>• {movie.runtime}</span>
            <span>• {movie.genre}</span>
            <span>⭐ {movie.rating}</span>
          </p>

          <p className="bg-white/10 backdrop-blur-sm p-4 rounded-md text-sm md:text-base max-w-md">
            {movie.overview}
          </p>

          <div className="flex space-x-3">
            <button
              onClick={() => setTrailerOpen(true)}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md"
            >
              <Play className="w-4 h-4" />
              <span>Watch Trailer</span>
            </button>

            <button className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md">
              <Info className="w-4 h-4" />
              <span>More Info</span>
            </button>
          </div>
        </div>

        {/* Middle column (Play button at center) */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => setTrailerOpen(true)}
            className="bg-white/70 hover:bg-white p-6 rounded-full shadow-lg transition"
          >
            <Play className="w-10 h-10 text-black" />
          </button>
        </div>

        {/* Right column (empty for now) */}
        <div></div>
      </div>

      {/* Trailer Modal */}
      {trailerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative w-full max-w-3xl aspect-video bg-black">
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

