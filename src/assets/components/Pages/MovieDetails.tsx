import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Play, Clock, Star } from "lucide-react";
import {
  fetchMovieDetails,
  fetchSimilarMovies,
  fetchMovieTrailer,
} from "../../../lib/tmdb";
import PlayModal from "../../components/Landing/Play_modal";
import SimilarSuggestions from "../similar/SimilarSuggestions";

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
  vote_average?: number;
}

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);
  const navigate = useNavigate();

  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [similar, setSimilar] = useState<SimilarMovieType[]>([]);
  const [loading, setLoading] = useState(true);

  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    if (!movieId) return;
    setLoading(true);

    Promise.all([fetchMovieDetails(movieId), fetchSimilarMovies(movieId)])
      .then(([details, related]) => {
        const mappedDetails: MovieDetailsType = {
          id: details.id,
          title: details.title || details.name || "Unknown",
          overview: details.overview || "No overview available",
          backdrop_path: details.backdrop_path || "",
          poster_path: details.poster_path || "",
          vote_average: details.vote_average ?? 0,
          runtime: details.runtime ?? 0,
          release_date: details.release_date || details.first_air_date || "N/A",
          genres: details.genres || [],
        };
        setMovie(mappedDetails);

        const mappedRelated: SimilarMovieType[] = related.map((rel) => ({
          id: rel.id,
          title: rel.title || rel.name || "Unknown",
          poster_path: rel.poster_path || "",
          release_date: rel.release_date || rel.first_air_date || "N/A",
          vote_average: rel.vote_average ?? 0,
        }));
        setSimilar(mappedRelated);
      })
      .catch((err: unknown) => {
        if (err instanceof Error) console.error("Error:", err.message);
        else console.error("Unknown error:", err);
      })
      .finally(() => setLoading(false));
  }, [movieId]);

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
      console.error("Trailer error:", err);
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

                <button
                  onClick={() => navigate(`/live/${movie.id}`)}
                  className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 rounded-md font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  🎬 Watch Now
                </button>

                <span className="flex items-center gap-1">
                  <Star className="text-yellow-400" size={16} />{" "}
                  {movie.vote_average.toFixed(1)}
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
                  {movie.genres?.map((g) => g.name).join(", ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related movies */}
      <div className="flex items-center mb-8 px-4 sm:px-6 md:px-12 lg:px-18">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mr-4">
          You may also like
        </h2>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-red-600 to-transparent"></div>
      </div>

      {/* ✅ Always pass correct type */}
      <div className="px-4 sm:px-6 md:px-12 lg:px-18">
          <SimilarSuggestions type="movie" />
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
