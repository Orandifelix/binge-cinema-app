import React, { memo, useState, useCallback } from "react";
import { Play, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../../../hooks/useFetchMovies";

interface Props {
  movie: Movie;
}

const MovieCard: React.FC<Props> = memo(({ movie }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const goToDetails = useCallback(() => {
    if (movie.media_type === "tv") {
      navigate(`/tv/${movie.id}`);
    } else {
      navigate(`/movie/${movie.id}`);
    }
  }, [movie.media_type, movie.id, navigate]);

  const goToLive = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // ⛔ prevent parent click
    if (movie.media_type === "tv") {
      navigate(`/live/tv/${movie.id}`);
    } else {
      navigate(`/live/movie/${movie.id}`);
    }
  }, [movie.media_type, movie.id, navigate]);

  const goToDetailsButton = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // ⛔ prevent parent click
    goToDetails();
  }, [goToDetails]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  // Optimize image URL - use smaller size for better performance
  const optimizedImageUrl = movie.backdrop 
    ? movie.backdrop.replace('/original/', '/w500/') // Use w500 instead of original
    : '';

  return (
    <div
      className="relative group overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
      onClick={goToDetails}
    >
      {/* Image with loading state */}
      {optimizedImageUrl && !imageError ? (
        <>
          {/* Loading placeholder */}
          {!imageLoaded && (
            <div className="w-full h-64 bg-gray-800 animate-pulse flex items-center justify-center">
              <div className="text-gray-400 text-sm">Loading...</div>
            </div>
          )}
          
          {/* Actual image */}
          <img
            src={optimizedImageUrl}
            alt={movie.title}
            className={`w-full h-64 object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
            // Add decoding="async" for better performance
            decoding="async"
          />
        </>
      ) : (
        /* Fallback image */
        <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <div className="text-4xl mb-2">🎬</div>
            <div className="text-sm">No Image</div>
          </div>
        </div>
      )}

      {/* Rating badge */}
      <div className="absolute top-2 right-2 bg-black/80 text-yellow-400 px-2 py-1 text-xs rounded-md font-semibold">
        ⭐ {movie.rating}
      </div>

      {/* Title and genre/year info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent text-white px-3 py-2 text-sm">
        <h3 className="font-semibold truncate">{movie.title}</h3>
        <p className="text-xs text-gray-300">
          {movie.genre} • {movie.year}
        </p>
      </div>

      {/* Hover buttons */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity duration-300">
        <button
          onClick={goToLive}
          className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors duration-200"
          aria-label={`Play ${movie.title}`}
        >
          <Play size={16} /> Play
        </button>
        <button
          onClick={goToDetailsButton}
          className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-600 transition-colors duration-200"
          aria-label={`More info about ${movie.title}`}
        >
          <Info size={16} /> Info
        </button>
      </div>
    </div>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;

