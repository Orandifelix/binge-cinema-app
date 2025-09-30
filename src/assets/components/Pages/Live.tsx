import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";
import {
  fetchSimilarMovies,
  fetchSimilarSeries,
  fetchMovieDetails,
  fetchSeriesDetails,
  fetchSeasonEpisodes,
} from "../../../lib/tmdb";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../../../firebase";

// Firestore service
import { saveLastWatched } from "../../../services/watchedService";
import ContinueWatching from "../ContinueWatching";

// Types
interface SimilarMovieType {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

interface SeriesDetailsType {
  id: number;
  name: string;
  seasons: { season_number: number; name: string }[];
}

interface Episode {
  id: number;
  name: string;
  still_path: string | null;
  episode_number: number;
}

const Live = () => {
  const { id, season, episode } = useParams<{
    id: string;
    season?: string;
    episode?: string;
  }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [similar, setSimilar] = useState<SimilarMovieType[]>([]);
  const [title, setTitle] = useState<string>("");
  const [posterPath, setPosterPath] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  // TV-specific state
  const [series, setSeries] = useState<SeriesDetailsType | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(
    season ? Number(season) : 1
  );

  // Episode pagination
  const [episodePage, setEpisodePage] = useState(0);
  const EPISODES_PER_PAGE = 6;

  // ✅ Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // ✅ Detect movie or TV
  const isTv = location.pathname.startsWith("/live/tv");
  const isMovie = !isTv;

  // ✅ Fetch details + similar
  useEffect(() => {
    if (!id) return;

    if (isMovie) {
      fetchMovieDetails(Number(id))
        .then((movie) => {
          setTitle(movie.title || movie.name || "Untitled");
          setPosterPath(movie.poster_path || "");
        })
        .catch((err) => console.error(err));

      fetchSimilarMovies(Number(id))
        .then((movies) => {
          const cleaned = movies
            .filter((m) => m.poster_path)
            .map((m) => ({
              id: m.id,
              title: m.title || m.name,
              poster_path: m.poster_path!,
              release_date: m.release_date || m.first_air_date || "Unknown",
            }));
          setSimilar(cleaned);
        })
        .catch((err) => console.error(err));
    }

    if (isTv) {
      fetchSeriesDetails(Number(id))
        .then((details) => {
          setSeries(details);
          if (season) {
            setSelectedSeason(Number(season));
          } else if (details.seasons?.length) {
            setSelectedSeason(details.seasons[0].season_number);
          }
          setTitle(details.name || "Untitled");
        })
        .catch((err) => console.error(err));

      fetchSimilarSeries(Number(id))
        .then((shows) => {
          const cleaned = shows
            .filter((s) => s.poster_path)
            .map((s) => ({
              id: s.id,
              title: s.title || s.name,
              poster_path: s.poster_path!,
              release_date: s.release_date || s.first_air_date || "Unknown",
            }));
          setSimilar(cleaned);
        })
        .catch((err) => console.error(err));
    }
  }, [id, isMovie, isTv, season]);

  // ✅ Fetch episodes when season changes
  useEffect(() => {
    if (!isTv || !id || !selectedSeason) return;
    fetchSeasonEpisodes(Number(id), selectedSeason).then((eps) =>
      setEpisodes(eps || [])
    );
    setEpisodePage(0); // reset page when season changes
  }, [id, isTv, selectedSeason]);

  // ✅ Save last watched
  useEffect(() => {
    if (!id || !user) return;
    if (!title || !posterPath) return;

    saveLastWatched({
      movieId: id,
      title,
      poster_path: posterPath,
    }).catch((err) => console.error("Failed to save watch progress:", err));
  }, [id, user, title, posterPath]);

  // ✅ Build embed URL
  let embedUrl = "";
  if (isMovie) {
    embedUrl = `https://vidsrc.xyz/embed/movie/${id}?autoplay=1`;
  } else if (isTv) {
    if (season && episode) {
      embedUrl = `https://vidsrc.xyz/embed/tv/${id}/${season}-${episode}?autoplay=1&autonext=1`;
    } else {
      embedUrl = `https://vidsrc.xyz/embed/tv/${id}?autoplay=1`;
    }
  }

  // Paginate episodes
  const paginatedEpisodes = episodes.slice(
    episodePage * EPISODES_PER_PAGE,
    (episodePage + 1) * EPISODES_PER_PAGE
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100 font-sans">
      {/* Navbar */}
      <div className="px-4 sm:px-6 lg:px-12 xl:px-20">
        <Navbar />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* 🎬 Title */}
        <div className="bg-gray-950 py-6 text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-100">
            🎬 You are watching <span className="text-red-500">{title}</span>
          </h1>
        </div>

        {/* Video Player */}
        <div className="flex justify-center bg-black">
          <div className="relative w-[90%] md:w-[80%] aspect-video rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={embedUrl}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full border-none"
            />
          </div>
        </div>

        {/* ✅ Season & Episodes (TV only) */}
        {isTv && series && (
          <div className="px-4 sm:px-6 lg:px-12 xl:px-20 py-10">
            {/* Season selector */}
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold">Episodes</h2>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(Number(e.target.value))}
                className="bg-gray-800 text-white rounded px-3 py-1 text-sm"
              >
                {series.seasons.map((season) => (
                  <option key={season.season_number} value={season.season_number}>
                    {season.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Episodes grid with navigation */}
            <div className="relative">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {paginatedEpisodes.map((ep) => (
                  <div
                    key={ep.id}
                    className="relative bg-gray-900 rounded-lg overflow-hidden group cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/live/tv/${id}/season/${selectedSeason}/episode/${ep.episode_number}`
                      )
                    }
                  >
                    {/* Thumbnail */}
                    <img
                      src={
                        ep.still_path
                          ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
                          : "https://via.placeholder.com/300x169?text=No+Image"
                      }
                      alt={ep.name}
                      className="w-full aspect-video object-cover group-hover:opacity-80 transition"
                    />

                    {/* Overlay Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black/40 rounded-full flex items-center justify-center border border-white/40">
                        <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                    </div>

                    {/* Episode details */}
                    <div className="p-2 text-xs sm:text-sm">
                      <p className="font-semibold truncate">{ep.name}</p>
                      <p className="text-gray-400">Ep {ep.episode_number}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Left Arrow */}
              {episodePage > 0 && (
                <button
                  onClick={() => setEpisodePage((prev) => Math.max(prev - 1, 0))}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black p-2 sm:p-3 rounded-full"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
              )}

              {/* Right Arrow */}
              {(episodePage + 1) * EPISODES_PER_PAGE < episodes.length && (
                <button
                  onClick={() =>
                    setEpisodePage((prev) =>
                      (prev + 1) * EPISODES_PER_PAGE < episodes.length
                        ? prev + 1
                        : prev
                    )
                  }
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black p-2 sm:p-3 rounded-full"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ✅ Continue Watching Section */}
        {user && <ContinueWatching />}

        {/* Similar Movies/Shows */}
        <div className="px-4 sm:px-6 lg:px-12 xl:px-20 py-8 bg-gray-950">
          <h2 className="text-lg sm:text-xl font-semibold mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similar.map((rel) => (
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
                  <p className="text-gray-400">
                    {rel.release_date?.slice(0, 4)}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() =>
                        isMovie
                          ? navigate(`/live/${rel.id}`)
                          : navigate(`/live/tv/${rel.id}`)
                      }
                      className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-1"
                    >
                      <Play size={12} /> Play
                    </button>
                    <button
                      onClick={() =>
                        isMovie
                          ? navigate(`/movie/${rel.id}`)
                          : navigate(`/tv/${rel.id}`)
                      }
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
      </main>

      <Footer />
    </div>
  );
};

export default Live;
