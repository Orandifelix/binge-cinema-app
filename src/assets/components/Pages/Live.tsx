import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

import Navbar from "../Navbar";
import Footer from "../Footer";
import ContinueWatching from "../ContinueWatching";
import SimilarSuggestions from "../similar/SimilarSuggestions";

import {
  fetchMovieDetails,
  fetchSeriesDetails,
  fetchSeasonEpisodes,
} from "../../../lib/tmdb";

import { auth } from "../../../firebase";
import { saveLastWatched } from "../../../services/watchedService";


// 🔹 Types
interface Episode {
  id: number;
  name: string;
  still_path: string | null;
  episode_number: number;
}

interface SeriesDetails {
  id: number;
  name: string;
  seasons: { season_number: number; name: string }[];
}


const EPISODES_PER_PAGE = 6;

const Live = () => {
  const { id, season, episode } = useParams<{
    id: string;
    season?: string;
    episode?: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<User | null>(null);
  const [title, setTitle] = useState("");
  const [posterPath, setPosterPath] = useState("");
  const [series, setSeries] = useState<SeriesDetails | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(
    season ? Number(season) : 1
  );
  const [episodePage, setEpisodePage] = useState(0);

  const isTv = location.pathname.startsWith("/live/tv");
  const isMovie = !isTv;

  // ✅ Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  // ✅ Fetch details (movie or series)
  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      try {
        if (isMovie) {
          const movie = await fetchMovieDetails(Number(id));
          setTitle(movie.title || movie.name || "Untitled");
          setPosterPath(movie.poster_path || "");
        } else {
          const details = await fetchSeriesDetails(Number(id));
          setSeries(details);
          setSelectedSeason(season ? Number(season) : details.seasons?.[0]?.season_number ?? 1);
          setTitle(details.name || "Untitled");
        }
      } catch (err) {
        console.error("Error fetching details:", err);
      }
    };

    fetchDetails();
  }, [id, isMovie, isTv, season]);

  // ✅ Fetch episodes (TV only)
  useEffect(() => {
    if (!isTv || !id || !selectedSeason) return;
    fetchSeasonEpisodes(Number(id), selectedSeason)
      .then((eps) => setEpisodes(eps || []))
      .catch((err) => console.error("Error fetching episodes:", err));
    setEpisodePage(0);
  }, [id, isTv, selectedSeason]);

  // ✅ Save last watched
  useEffect(() => {
    if (id && user && title && posterPath) {
      saveLastWatched({ movieId: id, title, poster_path: posterPath }).catch((err) =>
        console.error("Failed to save watch progress:", err)
      );
    }
  }, [id, user, title, posterPath]);

  // ✅ Embed URL (secure)
  const embedUrl = useMemo(() => {
    const MOVIE_BASE_URL = import.meta.env.VITE_LIVE_MOVIE_URL as string;
    const TV_BASE_URL = import.meta.env.VITE_LIVE_TV_URL as string;

    if (isMovie) return `${MOVIE_BASE_URL}${id}?autoplay=1`;
    if (season && episode)
      return `${TV_BASE_URL}${id}/${season}-${episode}?autoplay=1&autonext=1`;
    return `${TV_BASE_URL}${id}?autoplay=1`;
  }, [id, isMovie, season, episode]);

  // ✅ Paginated episodes
  const paginatedEpisodes = useMemo(
    () =>
      episodes.slice(
        episodePage * EPISODES_PER_PAGE,
        (episodePage + 1) * EPISODES_PER_PAGE
      ),
    [episodes, episodePage]
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="px-4 sm:px-6 lg:px-12 xl:px-20">
        <Navbar />
      </div>

      <main className="flex-1 overflow-y-auto">
        {/* Title */}
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

        {/* TV Episodes */}
        {isTv && series && (
          <section className="px-6 lg:px-12 py-10">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold">Episodes</h2>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(Number(e.target.value))}
                className="bg-gray-800 text-white rounded px-3 py-1 text-sm"
              >
                {series.seasons.map((s) => (
                  <option key={s.season_number} value={s.season_number}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Episodes grid */}
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
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="p-2 text-xs sm:text-sm">
                      <p className="font-semibold truncate">{ep.name}</p>
                      <p className="text-gray-400">Ep {ep.episode_number}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Episode navigation */}
              {episodePage > 0 && (
                <button
                  onClick={() => setEpisodePage((p) => Math.max(p - 1, 0))}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black p-2 sm:p-3 rounded-full"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
              )}
              {(episodePage + 1) * EPISODES_PER_PAGE < episodes.length && (
                <button
                  onClick={() =>
                    setEpisodePage((p) =>
                      (p + 1) * EPISODES_PER_PAGE < episodes.length ? p + 1 : p
                    )
                  }
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black p-2 sm:p-3 rounded-full"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              )}
            </div>
          </section>
        )}

        {/* Continue Watching */}
        {user && <ContinueWatching />}

        {/* Similar Suggestions */}
      {/* Related movies */}
      <div className="flex items-center mb-8 px-4 sm:px-6 md:px-12 lg:px-18">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mr-4">
          You may also like
        </h2>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-red-600 to-transparent"></div>
      </div>

      {/* ✅ Always pass correct type */}
      <div className="px-4 sm:px-6 md:px-12 lg:px-18">
          <SimilarSuggestions type={isTv ? "tv" : "movie"} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Live;
