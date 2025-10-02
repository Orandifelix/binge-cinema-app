import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";
import { searchMulti, type TMDBMovie } from "../../../lib/tmdb";   

import type { Movie } from "../../../hooks/useFetchMovies";
import MovieCard from "../Home/MovieCard";

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(false);

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
        <main className="flex-1 px-6 sm:px-12 lg:px-24 py-8">
          <h1 className="text-2xl font-bold mb-6">
            {query
              ? `Search results for "${query}"`
              : "Type a movie or show name in the search bar"}
          </h1>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {results.map((item) => {
                const movieLike: Movie = {
                  id: item.id,
                  title: item.title || item.name || "Unknown",
                  year:
                    item.release_date?.slice(0, 4) ||
                    item.first_air_date?.slice(0, 4) ||
                    "N/A",
                  genre: "N/A", // placeholder unless you map genres
                  rating: (item.vote_average ?? 0).toFixed(1),
                  backdrop: item.poster_path
                    ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image",
                  media_type: item.media_type || (item.title ? "movie" : "tv"),
                };

                return <MovieCard key={`${item.media_type}-${item.id}`} movie={movieLike} />;
              })}
            </div>
          ) : (
            <p className="text-gray-400">No results found.</p>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default SearchPage;
