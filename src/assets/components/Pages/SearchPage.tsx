import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";
import { searchMulti, type TMDBMovie } from "../../../lib/tmdb";   


const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await searchMulti(query);
        setResults(data);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setResults([]);
      }
      setLoading(false);
    };

    fetchResults();
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
              : "Type a movie or show name in search bar"}
          </h1>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {results.length > 0 ? (
                results.map((item) => (
                  <div
                    key={`${item.media_type}-${item.id}`}  
                    className="bg-gray-900 rounded-lg overflow-hidden shadow-md hover:scale-105 transition"
                  >
                    <img
                      src={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                          : "https://via.placeholder.com/300x450?text=No+Image"
                      }
                      alt={item.title || item.name}
                      className="w-full h-60 object-cover"
                    />
                    <div className="p-3 text-sm">
                      <p className="font-semibold truncate">
                        {item.title || item.name}
                      </p>
                      <p className="text-gray-400">
                        {item.release_date?.slice(0, 4) ||
                          item.first_air_date?.slice(0, 4) ||
                          "N/A"}
                      </p>
                      <button
                        onClick={() =>
                          navigate(
                            item.media_type === "movie"
                              ? `/movie/${item.id}`
                              : `/tv/${item.id}`
                          )
                        }
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





