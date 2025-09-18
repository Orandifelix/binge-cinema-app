import { Play, Info } from "lucide-react";

interface ContentProps {
  movie: {
    title: string;
    year: string;
    runtime: string;
    genre: string;
    rating: number;
    overview: string;
  };
  setTrailerOpen: (open: boolean) => void;
}

const Content = ({ movie, setTrailerOpen }: ContentProps) => {
  return (
    <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 px-16 h-full text-white">
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
  );
};

export default Content;

