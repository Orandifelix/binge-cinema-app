import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { fetchMoviesByType } from "../../../lib/tmdb";
import { Play, Info } from "lucide-react";

// Define a type for the movies returned by fetchMoviesByType
interface MovieItem {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
}

const BrowseType: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!type) return;

    setLoading(true);
    fetchMoviesByType(type, 60)
      .then((m: MovieItem[]) => setMovies(m))
      .catch((err: unknown) => {
        if (err instanceof Error) {
          console.error("fetchMoviesByType:", err.message);
        } else {
          console.error("fetchMoviesByType: Unknown error", err);
        }
      })
      .finally(() => setLoading(false));
  }, [type]);

  const goToDetails = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <div className="px-18">
        <Navbar />
      </div>

      <main className="flex-1 px-6 md:px-24 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {type ? `Showing ${type.replace("_", " ")}` : "Browse"}
        </h1>

        {loading ? (
          <div className="py-12 text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {movies.map((m: MovieItem) => (
              <div
                key={m.id}
                className="relative group bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
              >
                {/* Poster */}
                <img
                  src={
                    m.poster_path
                      ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                      : m.backdrop_path
                      ? `https://image.tmdb.org/t/p/w500${m.backdrop_path}`
                      : ""
                  }
                  alt={m.title ?? m.name ?? "Untitled"}
                  className="w-full h-56 object-cover"
                />

                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white px-2 py-1 text-sm truncate">
                  {m.title ?? m.name ?? "Untitled"}
                </div>

                {/* Hover buttons */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300">
                  <button
                    onClick={() => goToDetails(m.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition"
                  >
                    <Play size={16} /> Play
                  </button>
                  <button
                    onClick={() => goToDetails(m.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-600 transition"
                  >
                    <Info size={16} /> Info
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BrowseType;





