import { useEffect, useState } from "react";
import type { Genre } from "../../../lib/tmdb";
import {
  fetchGenres,
  fetchMoviesByGenre,
  fetchSeriesByGenre,
  type TMDBMovie,
} from "../../../lib/tmdb";
import { useSearchParams } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import MovieCard from "../Home/MovieCard";
import type { Movie } from "../../../hooks/useFetchMovies";

interface GenreMovie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  media_type: "movie" | "tv";
}

const Genres: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selected, setSelected] = useState<Genre | null>(null);
  const [movies, setMovies] = useState<GenreMovie[]>([]);
  const [searchParams] = useSearchParams();

  const genreQuery = searchParams.get("g");

  useEffect(() => {
    fetchGenres()
      .then((allGenres) => {
        setGenres(allGenres);
        if (genreQuery) {
          const match = allGenres.find(
            (g) => g.name.toLowerCase() === genreQuery.toLowerCase()
          );
          if (match) handleSelect(match);
        }
      })
      .catch((err: unknown) =>
        console.error("fetchGenres error:", err instanceof Error ? err.message : err)
      );
  }, [genreQuery]);

  const handleSelect = async (genre: Genre) => {
    setSelected(genre);
    try {
      // ✅ Fetch both movies & TV
      const [moviesData, tvData] = await Promise.all([
        fetchMoviesByGenre(genre.id, 40),
        fetchSeriesByGenre(genre.id, 40),
      ]);

      const mapped: GenreMovie[] = [...moviesData, ...tvData].map((m: TMDBMovie) => ({
        id: m.id,
        title: m.title || m.name || "Untitled",
        poster_path: m.poster_path ?? "",
        backdrop_path: m.backdrop_path,
        release_date: m.release_date,
        first_air_date: m.first_air_date,
        vote_average: m.vote_average,
        media_type: m.media_type ?? (m.title ? "movie" : "tv"),
      }));

      setMovies(mapped);
    } catch (err: unknown) {
      console.error(
        "fetchMoviesByGenre error:",
        err instanceof Error ? err.message : err
      );
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="px-4 sm:px-6 lg:px-12 xl:px-14">
        <Navbar />
      </div>

      {/* Main content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-12 xl:px-20 py-6">
        {/* Heading */}
        <h1 className="text-lg sm:text-2xl md:text-3xl font-bold mb-6 text-center sm:text-left">
          🎬 Browse by Genre
        </h1>

        {/* Genres List */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center sm:justify-start">
          {genres.map((g) => (
            <span
              key={g.id}
              className={`cursor-pointer px-3 py-1 rounded-full text-sm sm:text-base transition ${
                selected?.id === g.id
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-red-400"
              }`}
              onClick={() => handleSelect(g)}
            >
              {g.name}
            </span>
          ))}
        </div>

        {/* Movies Grid */}
        {selected && (
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6">
              Best of {selected.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movies.map((m) => {
                const movieLike: Movie = {
                  id: m.id,
                  title: m.title,
                  year: m.release_date?.slice(0, 4) || m.first_air_date?.slice(0, 4) || "N/A",
                  genre: selected.name,
                  rating: (m.vote_average ?? 0).toFixed(1),
                  backdrop: m.poster_path
                    ? `https://image.tmdb.org/t/p/w300${m.poster_path}`
                    : m.backdrop_path
                    ? `https://image.tmdb.org/t/p/w300${m.backdrop_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image",
                  media_type: m.media_type,
                };

                return <MovieCard key={`${m.media_type}-${m.id}`} movie={movieLike} />;
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Genres;

