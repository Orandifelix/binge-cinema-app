import { useState } from "react";
import { X, Home, Film, Tv, Star, PlayCircle, CalendarClock } from "lucide-react";

const Browse = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Browse button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center space-x-2 px-3 py-1.5 bg-white text-gray-900 rounded-md text-sm font-medium 
           shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"

      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span>Browse</span>
      </button>

      {/* Sidebar + Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Sidebar (black) */}
          <div className="w-64 bg-black text-white h-full shadow-lg p-4 overflow-y-auto relative z-50">
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="p-2 hover:bg-gray-800 rounded-md mb-4"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Menu */}
            <nav className="space-y-4">
              <a href="#" className="flex items-center space-x-2 hover:text-indigo-400">
                <Home className="w-5 h-5" />
                <span>Home</span>
              </a>
              <a href="#" className="flex items-center space-x-2 hover:text-indigo-400">
                <Film className="w-5 h-5" />
                <span>Movies</span>
              </a>
              <a href="#" className="flex items-center space-x-2 hover:text-indigo-400">
                <Tv className="w-5 h-5" />
                <span>TV Shows</span>
              </a>
              <a href="#" className="flex items-center space-x-2 hover:text-indigo-400">
                <Star className="w-5 h-5" />
                <span>Top IMDB</span>
              </a>
              <a href="#" className="flex items-center space-x-2 hover:text-indigo-400">
                <PlayCircle className="w-5 h-5" />
                <span>Latest Movies</span>
              </a>
              <a href="#" className="flex items-center space-x-2 hover:text-indigo-400">
                <Tv className="w-5 h-5" />
                <span>Latest TV Shows</span>
              </a>
              <a href="#" className="flex items-center space-x-2 hover:text-indigo-400">
                <CalendarClock className="w-5 h-5" />
                <span>Coming Soon</span>
              </a>
            </nav>

            {/* Divider */}
            <hr className="my-4 border-gray-700" />

            {/* Genres */}
            <h3 className="text-xs uppercase tracking-wide text-gray-400 mb-2">
              Genre
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Action",
                "Comedy",
                "Drama",
                "Horror",
                "Romance",
                "Crime",
                "Sci-Fi & Fantasy",
                "Thriller",
                "Western",
                "Documentary",
                "Adventure",
                "Animations",
                "Biography",
                "War & Politics",
                "Music",
                "Mystery",
                "Family",
                "Reality",
                "Kids",
                "History",
                "Soap",
                "War",
              ].map((genre) => (
                <button
                  key={genre}
                  className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-sm rounded-md"
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Semi-transparent overlay (rest of screen) */}
          <div
            className="flex-1 bg-black/50"
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default Browse;
