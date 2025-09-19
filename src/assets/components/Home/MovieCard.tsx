import React from "react";
import { Play, Info } from "lucide-react";

export interface Movie {
  id?: number;
  title: string;
  year: string;
  genre: string;
  rating: string;
  backdrop: string;
  trailerUrl?: string;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div
      className="relative group rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105"
    >
      {/* Poster */}
      <img
        src={movie.backdrop}
        alt={movie.title}
        className="w-full h-64 object-cover"
        loading="lazy"
      />

      {/* Rating badge */}
      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center space-x-1">
        <span>⭐</span>
        <span>{movie.rating}</span>
      </div>

      {/* Movie details (always visible) */}
      <div className="absolute bottom-2 left-2 text-white">
        <span className="bg-white/70 text-black text-xs px-2 py-0.5 rounded-md">
          {movie.genre}
        </span>
        <h3 className="text-sm font-bold leading-tight">{movie.title}</h3>
        <p className="text-xs">{movie.year}</p>
      </div>

      {/* Hover buttons (only appear on hover) */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center space-y-3 transition-opacity duration-300">
        <button className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-200">
          <Play className="w-4 h-4" />
          <span>Play</span>
        </button>
        <button className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-700">
          <Info className="w-4 h-4" />
          <span>Info</span>
        </button>
      </div>
    </div>
  );
};

export default MovieCard;

