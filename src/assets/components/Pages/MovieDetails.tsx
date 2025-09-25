import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Play, Clock, Star, Info } from "lucide-react";
import {
  fetchMovieDetails,
  fetchSimilarMovies,
  fetchMovieTrailer,
} from "../../../lib/tmdb";
import PlayModal from "../../components/Landing/Play_modal";

// Types
interface GenreItem {
  id: number;
  name: string;
}

interface MovieDetailsType {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  runtime: number;
  release_date: string;
  genres: GenreItem[];
}

interface SimilarMovieType {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);
  const navigate = useNavigate();

  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [similar, setSimilar] = useState<SimilarMovieType[]>([]);
  const [loading, setLoading] = useState(true);

  // trailer modal state
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");

  // Fetch movie details & similar movies
  useEffect(() => {
    if (!movieId) return;
    setLoading(true);

    Promise.all([fetchMovieDetails(movieId), fetchSimilarMovies(movieId)])
      .then(([details, related]) => {
        setMovie(details);
        setSimilar(related);
      })
      .catch((err: unknown) => {
        if (err instanceof Error) console.error(err.message);
        else console.error("Unknown error", err);
      })
      .finally(() => setLoading(false));
  }, [movieId]);

  // Play trailer
  const playTrailer = async (id: number) => {
    try {
      const url = await fetchMovieTrailer(id);
      if (url) {
        setTrailerUrl(url);
        setTrailerOpen(true);
      } else {
        alert("No trailer found for this movie.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">
        Movie not found
      </div>
    );
  }

  return (
<div className="flex flex-col min-h-screen bg-gray-900 text-white font-sans">
  {/* Navbar */}
  <div className="px-4 sm:px-6 md:px-12">
    <Navbar />
  </div>

  {/* Hero Section */}
  <div className="w-full">
    <div
      className="relative w-full bg-cover bg-center"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      }}
    >
      <div className="bg-gray-950 bg-opacity-70 flex flex-col md:flex-row gap-6 p-6 sm:p-8 md:p-12 container mx-auto">
        {/* Poster */}
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-40 sm:w-48 md:w-64 rounded-lg shadow-lg mx-auto md:mx-0"
        />

        {/* Info */}
        <div className="space-y-4 max-w-3xl text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            {movie.title}
          </h1>

          {/* Quick actions */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm sm:text-base">
              <button
                onClick={() => playTrailer(movie.id)}
                className="flex items-center gap-1 px-3 py-1 bg-red-600 rounded-md hover:bg-red-700"
              >
                <Play size={16} /> Trailer
              </button>

              {/* New Watch Now button */}
              <button
                onClick={() => navigate(`/live/${movie.id}`)}
                className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 rounded-md font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                🎬 Watch Now
              </button>

              <span className="flex items-center gap-1">
                <Star className="text-yellow-400" size={16} /> {movie.vote_average.toFixed(1)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={16} /> {movie.runtime} min
              </span>
            </div>


          {/* Overview */}
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {movie.overview}
          </p>

          {/* Metadata */}
          <div className="text-xs sm:text-sm text-gray-400 space-y-1">
            <p>
              <span className="font-semibold">Released:</span>{" "}
              {movie.release_date}
            </p>
            <p>
              <span className="font-semibold">Genres:</span>{" "}
              {movie.genres.map((g: GenreItem) => g.name).join(", ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Related movies */}
  <div className="px-4 sm:px-6 md:px-12 py-12">
    <h2 className="text-lg sm:text-xl font-semibold mb-6 text-center md:text-left">
      You may also like
    </h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {similar.map((rel: SimilarMovieType) => (
        <div
          key={rel.id}
          className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition"
        >
          <img
            src={`https://image.tmdb.org/t/p/w300${rel.poster_path}`}
            alt={rel.title}
            className="w-full aspect-[2/3] object-cover"
          />
          <div className="p-2 text-xs sm:text-sm">
            <p className="font-semibold truncate">{rel.title}</p>
            <p className="text-gray-400">{rel.release_date?.slice(0, 4)}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => navigate(`/movie/${rel.id}`)}
                className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-1"
              >
                <Play size={12} /> Play
              </button>
              <button
                onClick={() => navigate(`/movie/${rel.id}`)}
                className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-800 rounded-md flex items-center gap-1"
              >
                <Info size={12} /> More Info
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>

  <Footer />

  {/* Trailer modal */}
  <PlayModal
    trailerOpen={trailerOpen}
    trailerUrl={trailerUrl}
    onClose={() => setTrailerOpen(false)}
  />
</div>

  );
};

export default MovieDetails;
