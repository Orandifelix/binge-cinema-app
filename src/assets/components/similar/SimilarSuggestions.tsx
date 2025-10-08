import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAdvancedSimilar } from "../../../lib/tmdb";
import type { TMDBMovie } from "../../../lib/tmdb";
import MovieCard from "../Home/MovieCard";
import type { Movie } from "../../../hooks/useFetchMovies";

interface Props {
  type: "movie" | "tv";
}

// ✅ Type guard for items with `genre_ids`
interface TMDBMovieWithGenres extends TMDBMovie {
  genre_ids?: number[];
}

function mapToMovieCardData(item: TMDBMovie): Movie {
  const mediaType: "movie" | "tv" =
    item.media_type === "tv" ? "tv" : "movie";

  // Safely extract genre IDs (always ends up as a number[])
  const genreIds: number[] =
    "genre_ids" in item && Array.isArray((item as TMDBMovieWithGenres).genre_ids)
      ? (item as TMDBMovieWithGenres).genre_ids!
      : [];

  const year =
    item.release_date || item.first_air_date
      ? new Date(
          item.release_date || item.first_air_date || "1900-01-01"
        ).getFullYear().toString()
      : "N/A";

  return {
    id: item.id,
    title: item.title || item.name || "Untitled",
    year,
    genre: genreIds.length > 0 ? genreIds.join(", ") : "Unknown",
    rating: item.vote_average?.toFixed(1) ?? "N/A",
    backdrop: item.backdrop_path
      ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}`
      : item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : "/placeholder.jpg",
    media_type: mediaType,
  };
}


const SimilarSuggestions: React.FC<Props> = ({ type }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [fromCast, setFromCast] = useState<TMDBMovie[]>([]);
  const [fromGenre, setFromGenre] = useState<TMDBMovie[]>([]);
  const [others, setOthers] = useState<TMDBMovie[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchAdvancedSimilar(Number(id), type);
        setFromCast(data.fromCast);
        setFromGenre(data.fromGenre);
        setOthers(data.others);
      } catch (err) {
        console.error(err);
        setError("Failed to load recommendations.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, type]);

  if (loading) {
    return (
      <div className="text-center text-gray-400 mt-8">
        Loading recommendations...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  if (!fromCast.length && !fromGenre.length && !others.length) {
    return (
      <div className="text-center text-gray-400 mt-8">
        No similar suggestions available.
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-12">
      {/* 🎭 From Main Cast */}
      {fromCast.length > 0 && (
        <section>
          {/* <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
            Top Rated from Main Cast
          </h2> */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {fromCast.map((movie) => (
              <MovieCard key={movie.id} movie={mapToMovieCardData(movie)} />
            ))}
          </div>
        </section>
      )}

      {/* 🎬 Same Genre */}
      {fromGenre.length > 0 && (
        <section>
          {/* <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
            Top Rated in Same Genre
          </h2> */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {fromGenre.map((movie) => (
              <MovieCard key={movie.id} movie={mapToMovieCardData(movie)} />
            ))}
          </div>
        </section>
      )}

      {/* 🌍 Others */}
      {others.length > 0 && (
        <section>
          {/* <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
            You May Also Like
          </h2> */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {others.map((movie) => (
              <MovieCard key={movie.id} movie={mapToMovieCardData(movie)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SimilarSuggestions;
