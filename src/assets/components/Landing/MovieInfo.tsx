import WatchTrailer from "./WatchTrailer";
import { Info } from "lucide-react";
import { Link } from "react-router-dom";

interface MovieInfoProps {
  movieId: number;
  playTrailer: (id: number) => void;
}

const MovieInfo = ({ movieId, playTrailer }: MovieInfoProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Watch Trailer button */}
      <WatchTrailer onPlayTrailer={() => playTrailer(movieId)} />

      {/* More Info button */}
      <Link
        to={`/movie/${movieId}`}  // ✅ dynamic path
        onClick={() => console.log(`Show details for movie ${movieId}`)} // ✅ correctly placed
        className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 
                   px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm transition-all duration-200"
      >
        <Info className="w-4 h-4" />
        <span>More Info</span>
      </Link>
    </div>
  );
};

export default MovieInfo;



