import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAdvancedSimilar } from "../../../lib/tmdb";
import type { TMDBMovie } from "../../../lib/tmdb";
import MovieCard from "../Home/MovieCard";
import type { Movie } from "../../../hooks/useFetchMovies";

interface Props {
  type: "movie" | "tv";
}

const SimilarSuggestions: React.FC<Props> = ({ type }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [fromCast, setFromCast] = useState<TMDBMovie[]>([]);
  const [fromGenre, setFromGenre] = useState<TMDBMovie[]>([]);
  const [others, setOthers] = useState<TMDBMovie[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ✅ TMDBMovie → MovieCard format
  const mapToMovieCardData = (item: TMDBMovie): Movie => {
    const mediaType: "movie" | "tv" =
      item.media_type === "tv" ? "tv" : "movie";

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
      genre: mediaType === "tv" ? "TV Show" : "Movie",
      rating: item.vote_average?.toFixed(1) ?? "N/A",
      backdrop: item.backdrop_path
        ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}`
        : item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : "/placeholder.jpg",
      media_type: mediaType,
    };
  };

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

  if (loading)
    return (
      <div className="text-center text-gray-400 mt-8">
        Loading recommendations...
      </div>
    );

  if (error)
    return <div className="text-center text-red-500 mt-8">{error}</div>;

  if (!fromCast.length && !fromGenre.length && !others.length)
    return (
      <div className="text-center text-gray-400 mt-8">
        No similar suggestions available.
      </div>
    );

  return (
    <div className="mt-12 space-y-12 px-4 md:px-8">
      {fromCast.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">
            From Cast
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {fromCast.slice(0, 6).map((m) => (
              <MovieCard key={`${m.id}-${m.media_type}`} movie={mapToMovieCardData(m)} />
            ))}
          </div>
        </section>
      )}

      {fromGenre.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">
            From Genre
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {fromGenre.slice(0, 6).map((m) => (
              <MovieCard key={`${m.id}-${m.media_type}`} movie={mapToMovieCardData(m)} />
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">
            Similar Titles
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {others.slice(0, 6).map((m) => (
              <MovieCard key={`${m.id}-${m.media_type}`} movie={mapToMovieCardData(m)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SimilarSuggestions;
