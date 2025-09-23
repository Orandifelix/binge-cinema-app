// src/assets/components/Pages/BrowseType.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { fetchMoviesByType } from "../../../lib/tmdb";

const BrowseType = () => {
  const { type } = useParams<{ type: string }>();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!type) return;
    setLoading(true);
    fetchMoviesByType(type, 60)
      .then((m) => setMovies(m))
      .catch((err) => console.error("fetchMoviesByType:", err))
      .finally(() => setLoading(false));
  }, [type]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <div className="px-18"><Navbar /></div>

      <main className="flex-1 px-6 md:px-24 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {type ? `Showing ${type.replace("_", " ")}` : "Browse"}
        </h1>

        {loading ? (
          <div className="py-12 text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {movies.map((m: any) => (
              <div key={m.id} className="bg-gray-800 rounded-lg overflow-hidden shadow hover:scale-105 transition">
                <img
                  src={m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : (m.backdrop_path ? `https://image.tmdb.org/t/p/w500${m.backdrop_path}` : "")}
                  alt={m.title ?? m.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-2 text-sm">
                  <div className="font-semibold truncate">{m.title ?? m.name}</div>
                  <div className="text-gray-400 text-xs">{(m.release_date ?? m.first_air_date)?.slice(0,4) ?? ""}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BrowseType;



