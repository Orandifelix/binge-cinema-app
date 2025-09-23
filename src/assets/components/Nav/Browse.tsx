
import { useState } from "react";
import { X, Home, Film, Tv, Star, PlayCircle, CalendarClock } from "lucide-react";
import { Link } from "react-router-dom";

const Browse = () => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const types = [
    { label: "Movies", path: "movie", Icon: Film },
    { label: "TV Shows", path: "tv", Icon: Tv },
    { label: "Top Rated", path: "top_rated", Icon: Star },
    { label: "Latest", path: "latest", Icon: PlayCircle },
    { label: "Popular", path: "popular", Icon: PlayCircle },
    { label: "Coming Soon", path: "upcoming", Icon: CalendarClock },
  ];

  const genres = [
    "Action", "Comedy", "Drama", "Horror", "Romance", "Crime",
    "Sci-Fi & Fantasy", "Thriller", "Western", "Documentary",
    "Adventure", "Animations", "Biography", "War & Politics",
    "Music", "Mystery", "Family", "Reality", "Kids", "History", "Soap", "War",
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center space-x-2 px-3 py-1.5 bg-white text-gray-900 rounded-md text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span>Browse</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Sidebar */}
          <div className="w-64 bg-black text-white h-full shadow-lg p-4 overflow-y-auto relative z-50">
            <button onClick={close} className="p-2 hover:bg-gray-800 rounded-md mb-4">
              <X className="w-5 h-5" />
            </button>

            <nav className="space-y-3">
              <Link to="/" onClick={close} className="flex items-center space-x-2 hover:text-indigo-300">
                <Home className="w-5 h-5" /><span>Home</span>
              </Link>

              {types.map((t) => (
                <Link key={t.path} to={`/browse/${t.path}`} onClick={close} className="flex items-center space-x-2 hover:text-indigo-300">
                  <t.Icon className="w-5 h-5" /><span>{t.label}</span>
                </Link>
              ))}
            </nav>

            <hr className="my-4 border-gray-700" />

            <h3 className="text-xs uppercase tracking-wide text-gray-400 mb-2">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Link
                  key={genre}
                  to={`/genres?g=${encodeURIComponent(genre)}`}
                  onClick={close}
                  className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-sm rounded-md"
                >
                  {genre}
                </Link>
              ))}
            </div>
          </div>

          {/* overlay */}
          <div className="flex-1 bg-black/50" onClick={close} />
        </div>
      )}
    </>
  );
};

export default Browse;

