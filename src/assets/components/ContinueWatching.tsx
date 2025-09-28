import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Info } from "lucide-react";
import { auth } from "../../firebase";
import { getLastWatched, type LastWatched } from "../../services/watchedService";

const ContinueWatching: React.FC = () => {
  const [lastWatched, setLastWatched] = useState<LastWatched | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setLastWatched(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getLastWatched();
        console.log("📺 Last watched fetched:", data);
        setLastWatched(data);
      } catch (err) {
        console.error("Failed to fetch last watched:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) return <div className="px-4 py-6 text-gray-300">Loading…</div>;
  if (!lastWatched) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-12 xl:px-20 py-8 bg-gray-950">
      {/* Section Title */}
      <h2 className="text-lg sm:text-xl font-semibold mb-6">
        Continue Watching
      </h2>

      {/* {/* cards for the layout* - continue watching  movies/*} */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition">
          <img
            src={
              lastWatched.poster_path
                ? `https://image.tmdb.org/t/p/w300${lastWatched.poster_path}`
                : "/fallback.png"
            }
            alt={lastWatched.title}
            className="w-full aspect-[2/3] object-cover"
          />
          <div className="p-2 text-xs sm:text-sm">
            <p className="font-semibold truncate">{lastWatched.title}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => navigate(`/movie/${lastWatched.movieId}`)}
                className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-1"
              >
                <Play size={12} /> Resume
              </button>
              <button
                onClick={() => navigate(`/movie/${lastWatched.movieId}`)}
                className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-800 rounded-md flex items-center gap-1"
              >
                <Info size={12} /> Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContinueWatching;



