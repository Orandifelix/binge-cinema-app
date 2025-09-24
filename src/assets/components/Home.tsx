import { useEffect, useState } from "react";
import MovieCard from "./Home/MovieCard";
import type { Movie } from "./Home/MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Sections configuration
const sections = [
  { title: "🎬 Movies", label: "movie" },
  { title: "📺 TV Shows", label: "tv" },
  { title: "⭐ Top Rated", label: "top_rated" },
  { title: "🎞 Latest Movies", label: "latest" },
  { title: "📡 Popular TV Shows", label: "popular" },
  { title: "⏳ Coming Soon", label: "upcoming" },
];

// TMDB API response type
interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  backdrop_path?: string;
}

// Custom hook to fetch movies
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

        const mapped: Movie[] = data.results.map((m: TMDBMovie) => ({
          id: m.id,
          title: m.title || m.name || "Unknown",
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

// Component for a single section
interface SectionProps {
  title: string;
  endpoint: string;
}

const Section: React.FC<SectionProps> = ({ title, endpoint }) => {
  const { movies, loading } = useFetchMovies(endpoint);
  const [currentPage, setCurrentPage] = useState(0);

  const pageSize = 6;
  const totalPages = Math.ceil(movies.length / pageSize);
  const paginatedMovies = movies.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  const handleNext = () => currentPage < totalPages - 1 && setCurrentPage(prev => prev + 1);
  const handlePrev = () => currentPage > 0 && setCurrentPage(prev => prev - 1);

  return (
    <section className="space-y-4">
      {/* Section Title */}
      <div className="px-2 sm:px-4">
        <h1
          className="text-lg sm:text-xl md:text-2xl font-bold border-l-4 pl-3 text-white"
          style={{ borderImage: "linear-gradient(to bottom, #FFD700, #FFA500) 1" }}
        >
          {title}
        </h1>
      </div>

      {/* Movies Grid */}
      <div className="relative">
        {loading ? (
          <p className="px-4 text-gray-400">Loading...</p>
        ) : (
          <>
            <div className="px-2 sm:px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {paginatedMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Prev Button */}
            {currentPage > 0 && (
              <button
                onClick={handlePrev}
                className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 
                           bg-gray-800/70 hover:bg-gray-700 p-1.5 sm:p-2 
                           rounded-full shadow-md"
              >
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </button>
            )}

            {/* Next Button */}
            {currentPage < totalPages - 1 && (
              <button
                onClick={handleNext}
                className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 
                           bg-gray-800/70 hover:bg-gray-700 p-1.5 sm:p-2 
                           rounded-full shadow-md"
              >
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
};


// Home component
const Home: React.FC = () => {
  const sectionEndpoints: Record<string, string> = {
    movie: "trending/movie/week",
    tv: "trending/tv/week",
    top_rated: "movie/top_rated",
    latest: "movie/now_playing",
    popular: "tv/popular",
    upcoming: "movie/upcoming",
  };

  return (
    <div className="h-auto bg-gray-950 text-white py-6 space-y-12">
      {sections.map((section, idx) => (
        <Section
          key={idx}
          title={section.title}
          endpoint={sectionEndpoints[section.label] || "trending/all/week"}
        />
      ))}
    </div>
  );
};

export default Home;
