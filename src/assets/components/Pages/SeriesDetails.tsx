/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Play, Clock, Star, Info, ChevronLeft, ChevronRight } from "lucide-react";
import PlayModal from "../../components/Landing/Play_modal";
import {
  fetchSeriesDetails,
  fetchSeriesTrailer,
  fetchSimilarSeries,
  fetchSeasonEpisodes,
} from "../../../lib/tmdb";

// Types
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

interface SimilarSeriesType {
  id: number;
  name: string;
  poster_path: string;
  first_air_date: string;
}

interface Episode {
  id: number;
  name: string;
  still_path: string | null;
  episode_number: number;
}

const SeriesDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const seriesId = Number(id);
  const navigate = useNavigate();

  const [series, setSeries] = useState<SeriesDetailsType | null>(null);
  const [similar, setSimilar] = useState<SimilarSeriesType[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  // Trailer modal
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const pageSize = 6;
  const totalPages = Math.ceil(episodes.length / pageSize);
  const paginatedEpisodes = episodes.slice(page * pageSize, page * pageSize + pageSize);

  // Fetch series details & similar
  useEffect(() => {
    if (!seriesId) return;
    setLoading(true);

    Promise.all([fetchSeriesDetails(seriesId), fetchSimilarSeries(seriesId)])
      .then(([details, related]) => {
        setSeries(details);

        // Map to ensure "name" is always present
        const mappedSimilar: SimilarSeriesType[] = related.map((item: any) => ({
          id: item.id,
          name: item.name || item.title || "Unknown",
          poster_path: item.poster_path || "",
          first_air_date: item.first_air_date || "N/A",
        }));
        setSimilar(mappedSimilar);

        if (details.seasons?.length) {
          setSelectedSeason(details.seasons[0].season_number);
        }
      })
      .catch((err) => console.error(err))
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

      {/* Episodes grid with navigation */}
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

        {/* Pagination arrows */}
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

      {/* Related Series */}
      <div className="px-4 sm:px-6 md:px-12 py-12">
        <h2 className="text-lg sm:text-xl font-semibold mb-6 text-center md:text-left">
          You may also like
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {similar.map((rel) => (
            <div
              key={rel.id}
              className="relative group overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
            >
              <img
                src={`https://image.tmdb.org/t/p/w300${rel.poster_path}`}
                alt={rel.name}
                className="w-full aspect-[2/3] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white px-3 py-2 text-sm">
                <p className="font-semibold truncate">{rel.name}</p>
                <p className="text-gray-300 text-xs">
                  {rel.first_air_date?.slice(0, 4)}
                </p>
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-300">
                <button
                  onClick={() => navigate(`/tv/${rel.id}`)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition"
                >
                  <Play size={14} /> Play
                </button>
                <button
                  onClick={() => navigate(`/tv/${rel.id}`)}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-600 transition"
                >
                  <Info size={14} /> Info
                </button>
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

export default SeriesDetails;
