import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setMovies([]);
      return;
    }

    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            query
          )}&include_adult=false&language=en-US&page=1`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN}`,
              accept: "application/json",
            },
          }
        );
        const data = await res.json();
        setMovies(data.results || []);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setMovies([]);
      }
      setLoading(false);
    };

    fetchMovies();
  }, [query]);

  return (
    <div className="bg-gray-900">
      <div className="px-18">
        <Navbar />
      </div>
      <div className="flex flex-col min-h-screen bg-gray-950 text-white font-sans">
        <main className="flex-1 px-24 py-8 ">
          <h1 className="text-2xl font-bold mb-6">
            {query
              ? `Search results for "${query}"`
              : "Type a movie name in search bar"}
          </h1>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {movies.length > 0 ? (
                movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="bg-gray-900 rounded-lg overflow-hidden shadow-md hover:scale-105 transition"
                  >
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "https://via.placeholder.com/300x450?text=No+Image"
                      }
                      alt={movie.title}
                      className="w-full h-60 object-cover"
                    />
                    <div className="p-3 text-sm">
                      <p className="font-semibold truncate">{movie.title}</p>
                      <p className="text-gray-400">
                        {movie.release_date?.slice(0, 4) || "N/A"}
                      </p>
                      <button
                        onClick={() => navigate(`/movie/${movie.id}`)}
                        className="mt-2 text-xs px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md"
                      >
                        Watch now
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No results found.</p>
              )}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default SearchPage;




