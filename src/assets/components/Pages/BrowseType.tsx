import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { fetchMoviesByType } from "../../../lib/tmdb";
import type { Movie } from "../../../hooks/useFetchMovies";
import MovieCard from "../Home/MovieCard";

// Define a type for the movies returned by TMDB
interface MovieItem {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  first_air_date?: string;
  release_date?: string;
  media_type?: string;
}

const BrowseType: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(false);

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
          {movies.map((m) => {
              const movieLike: Movie = {
                id: m.id,
                title: m.title || m.name || "Untitled",
                year: m.release_date?.slice(0, 4) || m.first_air_date?.slice(0, 4) || "N/A",
                genre: "N/A",
                rating: (m.vote_average ?? 0).toFixed(1),
                backdrop: m.poster_path
                  ? `https://image.tmdb.org/t/p/w300${m.poster_path}`
                  : m.backdrop_path
                  ? `https://image.tmdb.org/t/p/w300${m.backdrop_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image",
                media_type: m.media_type as "movie" | "tv", 
              };

              return <MovieCard key={m.id} movie={movieLike} />;
            })}


          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BrowseType;
