import { useEffect, useState } from "react";
import type { Genre } from "../../../lib/tmdb";
import { fetchGenres, fetchMoviesByGenre } from "../../../lib/tmdb";


const Genres = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selected, setSelected] = useState<Genre | null>(null);
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    fetchGenres().then(setGenres).catch(console.error);
  }, []);

  const handleSelect = async (genre: Genre) => {
    setSelected(genre);
    try {
      const data = await fetchMoviesByGenre(genre.id, 20);
      setMovies(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
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
        <>
          <h2 className="text-xl font-semibold mb-4">
            Best of {selected.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-800 rounded-lg overflow-hidden"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-2 text-sm">{movie.title}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Genres;






 