import { useEffect, useState } from "react";
import type { Genre } from "../../../lib/tmdb";
import { fetchGenres, type TMDBMovie, fetchMoviesByGenre } from "../../../lib/tmdb";
import {  useSearchParams } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import MovieCard from "../Home/MovieCard";
import type { Movie } from "../../../hooks/useFetchMovies";

// Define the type for movies returned by fetchMoviesByGenre
interface GenreMovie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path?: string;
  release_date?: string;
  vote_average?: number;
}

const Genres: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selected, setSelected] = useState<Genre | null>(null);
  const [movies, setMovies] = useState<GenreMovie[]>([]);
  const [searchParams] = useSearchParams();

  // Get genre name from query param (?g=Action)
  const genreQuery = searchParams.get("g");

  // Load genres
  useEffect(() => {
    fetchGenres()
      .then((allGenres) => {
        setGenres(allGenres);

        // If URL has ?g=xxx, auto-select it
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
      const data: TMDBMovie[] = await fetchMoviesByGenre(genre.id, 30);
  
      const mapped: GenreMovie[] = data.map((m) => ({
        id: m.id,
        title: m.title || m.name || "Untitled",
        poster_path: m.poster_path ?? "",
        backdrop_path: m.backdrop_path,
        release_date: m.release_date,
        vote_average: m.vote_average,
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
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />

      <main className="p-6">
        <h1 className="text-2xl font-bold mb-6">Browse by Genre</h1>

        {/* Genres List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-10">
          {genres.map((g) => (
            <span
              key={g.id}
              className={`cursor-pointer ${
                selected?.id === g.id ? "text-red-500" : "text-gray-300"
              } hover:text-red-400 hover:underline text-lg transition`}
              onClick={() => handleSelect(g)}
            >
              {g.name}
            </span>
          ))}
        </div>

        {/* Movies */}
        {selected && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Best of {selected.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {movies.map((m) => {
                // Map GenreMovie -> Movie type
                const movieLike: Movie = {
                  id: m.id,
                  title: m.title,
                  year: m.release_date?.slice(0, 4) || "N/A",
                  genre: selected.name,
                  rating: (m.vote_average ?? 0).toFixed(1),
                  backdrop: m.poster_path
                    ? `https://image.tmdb.org/t/p/w300${m.poster_path}`
                    : m.backdrop_path
                    ? `https://image.tmdb.org/t/p/w300${m.backdrop_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image",
                  media_type: "movie", 
                };

                return <MovieCard key={m.id} movie={movieLike} />;
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Genres;
