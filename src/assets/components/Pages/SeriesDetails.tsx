import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Play, Clock, Star, ChevronLeft, ChevronRight } from "lucide-react";
import PlayModal from "../../components/Landing/Play_modal";
import {
  fetchSeriesDetails,
  fetchSeriesTrailer,
  fetchSeasonEpisodes,
} from "../../../lib/tmdb";

import SimilarSuggestions from "../similar/SimilarSuggestions";

// ---------------- TYPES ----------------
interface GenreItem {
  id: number;
  name: string;
}

interface SeriesDetailsType {
  id: number;
  name: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  first_air_date: string;
  genres: GenreItem[];
  number_of_seasons: number;
  seasons: { season_number: number; name: string }[];
}



interface Episode {
  id: number;
  name: string;
  still_path: string | null;
  episode_number: number;
}

// ---------------- COMPONENT ----------------
const SeriesDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const seriesId = Number(id);
  const navigate = useNavigate();

  const [series, setSeries] = useState<SeriesDetailsType | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  // Trailer modal
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const pageSize = 6;
  const paginatedEpisodes = episodes.slice(page * pageSize, page * pageSize + pageSize);
  const totalPages = Math.ceil(episodes.length / pageSize);

  // Fetch series details
  useEffect(() => {
    if (!seriesId) return;
    setLoading(true);

    fetchSeriesDetails(seriesId)
      .then((details) => {
        setSeries(details);
        if (details.seasons?.length) {
          setSelectedSeason(details.seasons[0].season_number);
        }
      })
      .catch((err) => console.error("Failed to fetch series:", err))
      .finally(() => setLoading(false));
  }, [seriesId]);

  // Fetch episodes when season changes
  useEffect(() => {
    if (!seriesId || !selectedSeason) return;
    fetchSeasonEpisodes(seriesId, selectedSeason).then((eps) =>
      setEpisodes(eps || [])
    );
    setPage(0);
  }, [seriesId, selectedSeason]);

  // Play trailer
  const playTrailer = async (id: number) => {
    try {
      const url = await fetchSeriesTrailer(id);
      if (url) {
        setTrailerUrl(url);
        setTrailerOpen(true);
      } else {
        alert("No trailer found for this series.");
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

  if (!series) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">
        Series not found
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
            backgroundImage: `url(https://image.tmdb.org/t/p/original${series.backdrop_path})`,
          }}
        >
          <div className="bg-gray-950 bg-opacity-70 flex flex-col md:flex-row gap-6 p-6 sm:p-8 md:p-12 container mx-auto">
            {/* Poster */}
            <img
              src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
              alt={series.name}
              className="w-40 sm:w-48 md:w-64 rounded-lg shadow-lg mx-auto md:mx-0"
            />

            {/* Info */}
            <div className="space-y-4 max-w-3xl text-center md:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                {series.name}
              </h1>

              {/* Quick actions */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm sm:text-base">
                <button
                  onClick={() => playTrailer(series.id)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 rounded-md hover:bg-red-700"
                >
                  <Play size={16} /> Trailer
                </button>
                <span className="flex items-center gap-1">
                  <Star className="text-yellow-400" size={16} />{" "}
                  {series.vote_average.toFixed(1)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={16} /> {series.number_of_seasons} Seasons
                </span>
              </div>

              {/* Overview */}
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {series.overview}
              </p>

              {/* Metadata */}
              <div className="text-xs sm:text-sm text-gray-400 space-y-1">
                <p>
                  <span className="font-semibold">First Air Date:</span>{" "}
                  {series.first_air_date}
                </p>
                <p>
                  <span className="font-semibold">Genres:</span>{" "}
                  {series.genres.map((g) => g.name).join(", ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes grid */}
      <div className="relative px-12 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {paginatedEpisodes.map((ep) => (
            <div
              key={ep.id}
              className="relative bg-gray-900 rounded-lg overflow-hidden group cursor-pointer"
              onClick={() =>
                navigate(`/live/tv/${id}/season/${selectedSeason}/episode/${ep.episode_number}`)
              }
            >
              <img
                src={
                  ep.still_path
                    ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
                    : "https://via.placeholder.com/300x169?text=No+Image"
                }
                alt={ep.name}
                className="w-full aspect-video object-cover group-hover:opacity-80 transition"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black/40 rounded-full flex items-center justify-center border border-white/40">
                  <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </div>
              <div className="p-2 text-xs sm:text-sm">
                <p className="font-semibold truncate">{ep.name}</p>
                <p className="text-gray-400">Ep {ep.episode_number}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination controls */}
        {page > 0 && (
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black p-2 sm:p-3 rounded-full"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
        )}
        {page + 1 < totalPages && (
          <button
            onClick={() => setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black p-2 sm:p-3 rounded-full"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
        )}
      </div>

      {/* ✅ Advanced Similar Suggestions */}
      <div className="px-4 sm:px-6 md:px-12 py-12">
        <div className="flex items-center mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mr-4">
            You May Also Like
          </h2>
          <div className="flex-1 h-[2px] bg-gradient-to-r from-red-600 to-transparent"></div>
        </div>

        {/* Component dynamically fetches top cast, genre & others */}
        <SimilarSuggestions type="tv" />
      </div>

      <Footer />

      {/* Trailer Modal */}
      <PlayModal
        trailerOpen={trailerOpen}
        trailerUrl={trailerUrl}
        onClose={() => setTrailerOpen(false)}
      />
    </div>
  );
};

export default SeriesDetails;
