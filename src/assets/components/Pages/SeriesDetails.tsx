import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Play, Info, Tv, Clock } from "lucide-react";
import { fetchSeriesDetails, fetchSeasonDetails, fetchSimilarSeries } from "../../../lib/tmdb";

interface SeriesDetailsType {
  id: number;
  name: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  first_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  genres: { id: number; name: string }[];
  seasons: { season_number: number; name: string; episode_count: number; poster_path: string | null }[];
}

interface EpisodeType {
  id: number;
  name: string;
  still_path: string | null;
  episode_number: number;
  overview: string;
}

const SeriesDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [series, setSeries] = useState<SeriesDetailsType | null>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [episodes, setEpisodes] = useState<EpisodeType[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch series details
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    Promise.all([fetchSeriesDetails(Number(id)), fetchSimilarSeries(Number(id))])
      .then(([details, related]) => {
        setSeries(details);
        setSimilar(related);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const loadSeason = async (seasonNumber: number) => {
    if (!id) return;
    try {
      const season = await fetchSeasonDetails(Number(id), seasonNumber);
      setEpisodes(season.episodes || []);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading...</div>;
  }

  if (!series) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">Series not found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white font-sans">
      <div className="px-4 sm:px-6 md:px-12">
        <Navbar />
      </div>

      {/* Hero */}
      <div className="relative w-full bg-cover bg-center"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${series.backdrop_path})` }}>
        <div className="bg-gray-950 bg-opacity-70 flex flex-col md:flex-row gap-6 p-6 sm:p-8 md:p-12 container mx-auto">
          <img src={`https://image.tmdb.org/t/p/w500${series.poster_path}`} alt={series.name}
            className="w-40 sm:w-48 md:w-64 rounded-lg shadow-lg mx-auto md:mx-0" />
          <div className="space-y-4 max-w-3xl text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{series.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm sm:text-base">
              <span className="flex items-center gap-1"><Tv size={16}/> {series.number_of_seasons} Seasons</span>
              <span className="flex items-center gap-1"><Clock size={16}/> {series.number_of_episodes} Episodes</span>
            </div>
            <p className="text-gray-300">{series.overview}</p>
            <div className="text-xs sm:text-sm text-gray-400 space-y-1">
              <p><span className="font-semibold">First Air:</span> {series.first_air_date}</p>
              <p><span className="font-semibold">Genres:</span> {series.genres.map(g => g.name).join(", ")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Seasons */}
      <div className="px-4 sm:px-6 md:px-12 py-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Seasons</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {series.seasons.map(season => (
            <div key={season.season_number} onClick={() => loadSeason(season.season_number)}
              className="cursor-pointer bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition">
              {season.poster_path && (
                <img src={`https://image.tmdb.org/t/p/w300${season.poster_path}`} alt={season.name}
                  className="w-full aspect-[2/3] object-cover"/>
              )}
              <div className="p-2 text-xs sm:text-sm">
                <p className="font-semibold">{season.name}</p>
                <p className="text-gray-400">{season.episode_count} episodes</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Episodes */}
      {episodes.length > 0 && (
        <div className="px-4 sm:px-6 md:px-12 py-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Episodes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {episodes.map(ep => (
              <div key={ep.id} className="bg-gray-800 rounded-lg overflow-hidden">
                {ep.still_path && (
                  <img src={`https://image.tmdb.org/t/p/w300${ep.still_path}`} alt={ep.name}
                    className="w-full aspect-video object-cover"/>
                )}
                <div className="p-2 text-xs sm:text-sm">
                  <p className="font-semibold">{ep.episode_number}. {ep.name}</p>
                  <p className="text-gray-400">{ep.overview || "No overview available."}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar Series */}
      <div className="px-4 sm:px-6 md:px-12 py-12">
        <h2 className="text-lg sm:text-xl font-semibold mb-6">You may also like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {similar.map(rel => (
            <div key={rel.id} className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition">
              <img src={`https://image.tmdb.org/t/p/w300${rel.poster_path}`} alt={rel.name || rel.title}
                className="w-full aspect-[2/3] object-cover"/>
              <div className="p-2 text-xs sm:text-sm">
                <p className="font-semibold truncate">{rel.name || rel.title}</p>
                <button onClick={() => navigate(`/tv/${rel.id}`)}
                  className="mt-2 text-xs px-2 py-1 bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-1">
                  <Play size={12}/> View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SeriesDetails;
