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
import PlayModal from "../../components/./Landing/Play_modal";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);
  const navigate = useNavigate();

  const [movie, setMovie] = useState<any | null>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // trailer modal state
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    if (!movieId) return;
    setLoading(true);

    Promise.all([fetchMovieDetails(movieId), fetchSimilarMovies(movieId)])
      .then(([details, related]) => {
        setMovie(details);
        setSimilar(related);
      })
      .catch(console.error)
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
      <div className="px-18">
        <Navbar />
      </div>

      {/* Hero section */}
      <div className="px-24">
        <div
          className="relative w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          }}
        >
          <div className="bg-gray-950 bg-opacity-70 flex flex-col md:flex-row gap-6 p-6 md:p-12 max-w-6xl mx-auto">
            {/* Poster */}
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-48 md:w-64 rounded-lg shadow-lg"
            />

            {/* Info */}
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>

              {/* Quick actions */}
              <div className="flex gap-4 text-sm sm:text-base">
                <button
                  onClick={() => playTrailer(movie.id)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 rounded-md hover:bg-red-700"
                >
                  <Play size={16} /> Trailer
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
              <p className="text-gray-300">{movie.overview}</p>

              {/* Metadata */}
              <div className="text-sm text-gray-400 space-y-1">
                <p>
                  <span className="font-semibold">Released:</span>{" "}
                  {movie.release_date}
                </p>
                <p>
                  <span className="font-semibold">Genres:</span>{" "}
                  {movie.genres.map((g: any) => g.name).join(", ")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related movies */}
        <div className="px-2 py-16">
          <h2 className="text-xl font-semibold mb-4">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {similar.map((rel) => (
              <div
                key={rel.id}
                className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${rel.poster_path}`}
                  alt={rel.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-2 text-sm">
                  <p className="font-semibold">{rel.title}</p>
                  <p className="text-gray-400">
                    {rel.release_date?.slice(0, 4)}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => playTrailer(rel.id)}
                      className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-1"
                    >
                      <Play size={12} /> Trailer
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


