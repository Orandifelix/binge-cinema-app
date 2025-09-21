import { useEffect, useState } from "react";
import MovieCard from "./Home/MovieCard";
import type { Movie } from "./Home/MovieCard"; // <-- type-only import

const sections = [
  { title: "🎬 Movies", label: "movie" },
  { title: "📺 TV Shows", label: "tv" },
  { title: "⭐ Top Rated", label: "top_rated" },
  { title: "🎞 Latest Movies", label: "latest" },
  { title: "📡 Popular TV Shows", label: "popular" },
  { title: "⏳ Coming Soon", label: "upcoming" },
];

// ✅ Custom hook for fetching movies
const useFetchMovies = (endpoint: string) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/${endpoint}`, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN}`,
            accept: "application/json",
          },
        });

        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();

        // Map results into Movie type
        const mapped: Movie[] = data.results.map((m: any) => ({
          id: m.id,
          title: m.title || m.name, // movie or tv show
          year: (m.release_date || m.first_air_date || "N/A").split("-")[0],
          genre: "N/A", // you can fetch genres separately if needed
          rating: m.vote_average?.toFixed(1) || "0.0",
          backdrop: m.backdrop_path
            ? `https://image.tmdb.org/t/p/original${m.backdrop_path}`
            : "",
        }));

        setMovies(mapped);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { movies, loading };
};

const Home: React.FC = () => {
  return (
    <div className="h-auto bg-gray-950 text-white py-6 space-y-8">
      {sections.map((section, idx) => {
        // choose correct TMDB endpoint per section
        let endpoint = "";
        switch (section.label) {
          case "movie":
            endpoint = "trending/movie/week";
            break;
          case "tv":
            endpoint = "trending/tv/week";
            break;
          case "top_rated":
            endpoint = "movie/top_rated";
            break;
          case "latest":
            endpoint = "movie/now_playing";
            break;
          case "popular":
            endpoint = "tv/popular";
            break;
          case "upcoming":
            endpoint = "movie/upcoming";
            break;
          default:
            endpoint = "trending/all/week";
        }

        const { movies, loading } = useFetchMovies(endpoint);

        return (
          <section key={idx}>
            <div className="px-4">
              <h1
                className="px-2 lg:px-2 text-xl sm:text-2xl font-bold mb-4 
                          border-l-4 pl-3 text-white"
                style={{
                  borderImage: "linear-gradient(to bottom, #FFD700, #FFA500) 1",
                }}
              >
                {section.title}
              </h1>
            </div>

            {loading ? (
              <p className="px-4">Loading...</p>
            ) : (
              <div className="px-2 lg:px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {movies.map((movie, i) => (
                  <MovieCard key={`${movie.id}-${i}`} movie={movie} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default Home;

