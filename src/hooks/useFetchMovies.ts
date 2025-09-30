// types
export interface Movie {
  id: number;
  title: string;
  year: string;
  genre: string;
  rating: string;
  backdrop: string;
  media_type: "movie" | "tv";
}

// hook
import { useEffect, useState } from "react";

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
          title: m.title || m.name || "Unknown",
          year: (m.release_date || m.first_air_date || "N/A").split("-")[0],
          genre: "N/A",
          rating: m.vote_average?.toFixed(1) || "0.0",
          backdrop: m.backdrop_path
            ? `https://image.tmdb.org/t/p/original${m.backdrop_path}`
            : "",
          media_type: m.media_type || (m.title ? "movie" : "tv"),
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

export default useFetchMovies;

