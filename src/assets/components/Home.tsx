import MovieCard from "./Home/MovieCard";
import type { Movie } from "./Home/MovieCard"; // <-- type-only import (important)

const Home: React.FC = () => {
  const sections = [
    { title: "🎬 Movies", label: "Movie" },
    { title: "📺 TV Shows", label: "Show" },
    { title: "⭐ Top IMDB", label: "Top" },
    { title: "🎞 Latest Movies", label: "Latest" },
    { title: "📡 Latest TV Shows", label: "Show" },
    { title: "⏳ Coming Soon", label: "Coming" },
  ];

  // Dummy movies typed with the Movie interface
  const dummyMovies: Movie[] = [
    {
      id: 1,
      title: "Dark Waters",
      year: "2023",
      genre: "Action",
      rating: "9.0",
      backdrop:
        "https://image.tmdb.org/t/p/original/x747ZvF0CcYYTTpPRCoUrxA2cYy.jpg",
    },
    {
      id: 2,
      title: "Midnight Hunter",
      year: "2024",
      genre: "Thriller",
      rating: "8.8",
      backdrop:
        "https://image.tmdb.org/t/p/original/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg",
    },
    {
      id: 3,
      title: "Neon Dreams",
      year: "2022",
      genre: "Sci-Fi",
      rating: "8.5",
      backdrop:
        "https://image.tmdb.org/t/p/original/fuVuDYrs8sxvEolnYr0wCSvtyTi.jpg",
    },
    // ...you can add more items here
  ];

  return (
    <div className="h-auto bg-gray-950 text-white py-6 space-y-8">
      {sections.map((section, idx) => (
        <section key={idx}>
          <div className="px-4"> 
            <h1
              className="px-2 lg:px-22 text-xl sm:text-2xl font-bold mb-4 
                        border-l-4 pl-3 text-white"
              style={{
                borderImage: "linear-gradient(to bottom, #FFD700, #FFA500) 1",
              }}
            >
              {section.title}
            </h1>
         </div>
          <div className="px-2 lg:px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Use unique keys - combine id + index if needed */}
            {dummyMovies.map((movie, i) => (
              <MovieCard key={`${movie.id ?? i}-${i}`} movie={movie} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home;
