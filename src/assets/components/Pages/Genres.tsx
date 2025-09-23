import { useEffect, useState } from "react";
import type { Genre } from "../../../lib/tmdb";
import { fetchGenres, fetchMoviesByGenre } from "../../../lib/tmdb";
import { Play, Info } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const Genres = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selected, setSelected] = useState<Genre | null>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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
          if (match) {
            handleSelect(match);
          }
        }
      })
      .catch(console.error);
  }, [genreQuery]);

  const handleSelect = async (genre: Genre) => {
    setSelected(genre);
    try {
      const data = await fetchMoviesByGenre(genre.id, 30);
      setMovies(data);
    } catch (err) {
      console.error(err);
    }
  };

  const goToDetails = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <Navbar />
      <h1 className="text-2xl font-bold mb-6 px-6">Browse by Genre</h1>

      {/* Genres List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-10 px-6">
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
          <h2 className="text-xl font-semibold mb-4 px-6">
            Best of {selected.name}
          </h2>
          <div className="grid grid-cols-2 px-6 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="relative group bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
              >
                {/* Poster */}
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-48 object-cover"
                />

                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white px-2 py-1 text-sm">
                  {movie.title}
                </div>

                {/* Hover buttons */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300">
                  <button
                    onClick={() => goToDetails(movie.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition"
                  >
                    <Play size={16} /> Play
                  </button>
                  <button
                    onClick={() => goToDetails(movie.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-600 transition"
                  >
                    <Info size={16} /> Info
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Genres;









 