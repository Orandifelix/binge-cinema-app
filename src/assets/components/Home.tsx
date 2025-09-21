import { useEffect, useState } from "react";
import MovieCard from "./Home/MovieCard";
import type { Movie } from "./Home/MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const sections = [
  { title: "🎬 Movies", label: "movie" },
  { title: "📺 TV Shows", label: "tv" },
  { title: "⭐ Top Rated", label: "top_rated" },
  { title: "🎞 Latest Movies", label: "latest" },
  { title: "📡 Popular TV Shows", label: "popular" },
  { title: "⏳ Coming Soon", label: "upcoming" },
];

const useFetchMovies = (endpoint: string) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/${endpoint}?language=en-US&page=1`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN}`,
              accept: "application/json",
            },
          }
        );

        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();

        const mapped: Movie[] = data.results.map((m: any) => ({
          id: m.id,
          title: m.title || m.name,
          year: (m.release_date || m.first_air_date || "N/A").split("-")[0],
          genre: "N/A",
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
    <div className="h-auto bg-gray-950 text-white py-6 space-y-12">
      {sections.map((section, idx) => {
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
        const [currentPage, setCurrentPage] = useState(0);
        const pageSize = 6;
        const totalPages = Math.ceil(movies.length / pageSize);

        const paginatedMovies = movies.slice(
          currentPage * pageSize,
          currentPage * pageSize + pageSize
        );

        const handleNext = () => {
          if (currentPage < totalPages - 1) {
            setCurrentPage((prev) => prev + 1);
          }
        };

        const handlePrev = () => {
          if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
          }
        };

        return (
          <section key={idx} className="space-y-4">
            {/* Section Title */}
            <div className="px-4">
              <h1
                className="px-2 lg:px-2 text-xl sm:text-2xl font-bold 
                          border-l-4 pl-3 text-white"
                style={{
                  borderImage: "linear-gradient(to bottom, #FFD700, #FFA500) 1",
                }}
              >
                {section.title}
              </h1>
            </div>

            {/* Movies Row with arrows */}
            <div className="relative">
              {loading ? (
                <p className="px-4">Loading...</p>
              ) : (
                <>
                  <div className="px-2 lg:px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {paginatedMovies.map((movie, i) => (
                      <MovieCard key={`${movie.id}-${i}`} movie={movie} />
                    ))}
                  </div>

                  {/* Left Arrow */}
                  {currentPage > 0 && (
                    <button
                      onClick={handlePrev}
                      className="absolute left-0 top-1/2 -translate-y-1/2 
                                 bg-gray-800/80 hover:bg-gray-700 p-2 rounded-full shadow-lg"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                  )}

                  {/* Right Arrow */}
                  {currentPage < totalPages - 1 && (
                    <button
                      onClick={handleNext}
                      className="absolute right-0 top-1/2 -translate-y-1/2 
                                 bg-gray-800/80 hover:bg-gray-700 p-2 rounded-full shadow-lg"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                  )}
                </>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Home;
