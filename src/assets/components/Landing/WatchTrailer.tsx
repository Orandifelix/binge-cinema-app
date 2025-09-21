import { Play } from "lucide-react";

interface WatchTrailerProps {
  onPlayTrailer: () => void;
}

const WatchTrailer = ({ onPlayTrailer }: WatchTrailerProps) => {
  return (
    <button
      onClick={onPlayTrailer}
      className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 
                 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm transition-all 
                 duration-200 hover:scale-105"
    >
      <Play className="w-4 h-4" />
      <span>Watch Trailer</span>
    </button>
  );
};

export default WatchTrailer;
