import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";
import { fetchSimilarMovies, fetchMovieDetails } from "../../../lib/tmdb";  
import { Play, Info } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../../../firebase";
interface SimilarMovieType {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

const Live = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [similar, setSimilar] = useState<SimilarMovieType[]>([]);
  const [title, setTitle] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);  


  // ✅ Tracking login state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // ✅ Fetching similar movies
  useEffect(() => {
    if (!id) return;
    fetchSimilarMovies(Number(id))
      .then((movies) => {
        const cleaned = movies
          .filter((m) => m.poster_path) 
          .map((m) => ({
            id: m.id,
            title: m.title,
            poster_path: m.poster_path!,
            release_date: m.release_date || "Unknown",
          }));
        setSimilar(cleaned);
      })
      .catch((err) => console.error(err));
  }, [id]);

  // ✅ Fetching main movie details
  useEffect(() => {
    if (!id) return;
    fetchMovieDetails(Number(id))
      .then((movie) => setTitle(movie.title))
      .catch((err) => console.error(err));
  }, [id]);

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">
        Invalid movie ID
      </div>
    );
  }

  const embedUrl = `${import.meta.env.VITE_LIVE_BASE_URL}${id}&autoplay=1`;

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100 font-sans">
      {/* Navbar */}
      <div className="px-4 sm:px-6 lg:px-12 xl:px-20">
        <Navbar />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* 🎬 Player Section with Title */}
        <div className="bg-gray-950 py-6 text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-100">
            🎬 You are watching <span className="text-red-500">{title}</span>
          </h1>
        </div>

        {/* Video Player */}
        <div className="flex justify-center bg-black">
          <div className="relative w-[80%] aspect-video rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={embedUrl}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full border-none"
            />
          </div>
        </div>

        {/* ✅ Show only if user is logged in */}
        {user && (
          <div className="px-4 sm:px-6 lg:px-12 xl:px-20 py-8 bg-gray-950">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Continue Watching
            </h2>
            <p className="text-gray-400">Your progress will show here.</p>
          </div>
        )}

        {/* Related movies */}
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
      </main>

      <Footer />
    </div>
  );
};

export default Live;

