import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Play, Clock, Star, Info } from "lucide-react";
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

  // trailer modal
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");

  // pagination
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
        setSimilar(related);
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
    fetchSeasonEpisodes(seriesId, selectedSeason).then((eps) => setEpisodes(eps || []));
    setPage(0);
  }, [seriesId, selectedSeason]);

  // Trailer
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

      {/* Episodes Layer */}
      <div className="px-4 sm:px-6 md:px-12 py-12">
        <div className="flex items-center gap-3 mb-6">
          <label className="font-semibold">Season:</label>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(Number(e.target.value))}
            className="bg-gray-800 text-white p-2 rounded"
          >
            {series.seasons.map((s) => (
              <option key={s.season_number} value={s.season_number}>
                {s.name || `Season ${s.season_number}`}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 relative">
          {paginatedEpisodes.map((ep) => (
            <div
              key={ep.id}
              className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition"
            >
              {ep.still_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${ep.still_path}`}
                  alt={ep.name}
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="w-full h-32 bg-gray-700 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <div className="p-2 text-xs sm:text-sm">
                <p className="font-semibold truncate">
                  Ep {ep.episode_number}: {ep.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between mt-4">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-gray-800 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-800 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
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
              className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition"
            >
              <img
                src={`https://image.tmdb.org/t/p/w300${rel.poster_path}`}
                alt={rel.name}
                className="w-full aspect-[2/3] object-cover"
              />
              <div className="p-2 text-xs sm:text-sm">
                <p className="font-semibold truncate">{rel.name}</p>
                <p className="text-gray-400">{rel.first_air_date?.slice(0, 4)}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => navigate(`/tv/${rel.id}`)}
                    className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-1"
                  >
                    <Play size={12} /> Play
                  </button>
                  <button
                    onClick={() => navigate(`/tv/${rel.id}`)}
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

export default SeriesDetails;
