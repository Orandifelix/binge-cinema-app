import { Play } from "lucide-react";
import MovieInfo from "./MovieInfo";
import { Link } from "react-router-dom";

interface ContentProps {
  movie: {
    id: number;
    title: string;
    year: string;
    runtime: string;
    genre: string;
    rating: number;
    overview: string;
  };
  playTrailer: (id: number) => void;
}

const Content = ({ movie, playTrailer }: ContentProps) => {
  return (
    <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 px-16 h-full text-white">
      {/* Left column */}
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

        {/* Info & trailer buttons */}
        <MovieInfo movieId={movie.id} playTrailer={playTrailer} />
      </div>

      {/* Middle column (big play button → Live page) */}
      <div className="hidden md:flex items-center justify-center col-span-1">
        <Link
          to={`/live/${movie.id}`}
          className="bg-white/70 hover:bg-white p-6 rounded-full shadow-lg transition"
        >
          <Play className="w-10 h-10 text-black" />
        </Link>
      </div>

      {/* Right column (for balance) */}
      <div className="hidden md:block"></div>
    </div>
  );
};

export default Content;



