import React from "react";

export interface Movie {
  id: number;
  title: string;
  year: string;
  genre: string;
  rating: string;
  backdrop: string;
}

const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  return (
    <div className="relative group overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
      {/* Poster */}
      <img
        src={movie.backdrop}
        alt={movie.title}
        className="w-full h-64 object-cover"
        loading="lazy"
      />

      {/* Rating (top-right corner) */}
      <div className="absolute top-2 right-2 bg-black/80 text-yellow-400 px-2 py-1 text-xs rounded-md font-semibold">
        ⭐ {movie.rating}
      </div>

      {/* Always visible details (bottom) */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white px-3 py-2 text-sm">
        <h3 className="font-semibold">{movie.title}</h3>
        <p className="text-xs text-gray-300">
          {movie.genre} • {movie.year}
        </p>
      </div>

      {/* Hover buttons (center) */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity duration-300">
        <button className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition">
          ▶ Play
        </button>
        <button className="px-3 py-1 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-600 transition">
          ℹ Info
        </button>
      </div>
    </div>
  );
};

export default MovieCard;


