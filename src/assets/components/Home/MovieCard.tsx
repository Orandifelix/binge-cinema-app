import { useNavigate } from "react-router-dom";
import type { Movie } from "../../../hooks/useFetchMovies";  

interface Props {
  movie: Movie;
}

const MovieCard: React.FC<Props> = ({ movie }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (movie.media_type === "tv") {
      navigate(`/tv/${movie.id}`);
    } else {
      navigate(`/movie/${movie.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition"
    >
      {movie.backdrop && (
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full aspect-video object-cover"
        />
      )}
      <div className="p-2 text-sm">
        <p className="font-semibold truncate">{movie.title}</p>
        <p className="text-gray-400 text-xs">{movie.year}</p>
      </div>
    </div>
  );
};

export default MovieCard;


