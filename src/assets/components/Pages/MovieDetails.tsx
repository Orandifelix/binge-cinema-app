import Navbar from "../Navbar";
import Footer from "../Footer";
import { Play, Clock, Star } from "lucide-react";

const MovieDetails = () => {
  // Mock main movie data
  const movie = {
    title: "The Dark Knight",
    year: 2008,
    duration: "152 min",
    imdb: "9.0",
    overview:
      "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and DA Harvey Dent, he sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves effective, but they soon find themselves prey to a rising criminal mastermind known as The Joker.",
    poster:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
    releaseDate: "2008-07-18",
    genres: ["Action", "Crime", "Drama"],
  };

  // Mock related movies
  const relatedMovies = Array.from({ length: 18 }).map((_, i) => ({
    id: i + 1,
    title: `Related Movie ${i + 1}`,
    type: i % 2 === 0 ? "Movie" : "TV",
    year: 2023 - (i % 5),
    poster: `https://picsum.photos/200/300?random=${i + 1}`,
  }));

  return (
    <div className="bg-gray-950 text-white min-h-screen">
       <Navbar />

      {/* Hero section */}
      <div className="px-18"> 
      <div
        className="relative w-full bg-cover bg-center  "
        style={{ backgroundImage: `url(${movie.backdrop})` }}
      >
        <div className="bg-gray-950 bg-opacity-70 flex flex-col md:flex-row gap-6 p-6 md:p-12 max-w-6xl mx-auto">
          {/* Poster */}
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-48 md:w-64 rounded-lg shadow-lg"
          />

          {/* Info */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>

            {/* Quick actions */}
            <div className="flex gap-4 text-sm sm:text-base">
              <button className="flex items-center gap-1 px-3 py-1 bg-red-600 rounded-md hover:bg-red-700">
                <Play size={16} /> Trailer
              </button>
              <span className="flex items-center gap-1">
                <Star className="text-yellow-400" size={16} /> {movie.imdb}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={16} /> {movie.duration}
              </span>
            </div>

            {/* Overview */}
            <p className="text-gray-300">{movie.overview}</p>

            {/* Metadata */}
            <div className="text-sm text-gray-400 space-y-1">
              <p>
                <span className="font-semibold">Released:</span>{" "}
                {movie.releaseDate}
              </p>
              <p>
                <span className="font-semibold">Genres:</span>{" "}
                {movie.genres.join(", ")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related movies */}
      <div className="px-8 py-16">
        <h2 className="text-xl font-semibold mb-4">You may also like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {relatedMovies.map((rel) => (
            <div
              key={rel.id}
              className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition"
            >
              <img src={rel.poster} alt={rel.title} className="w-full h-40 object-cover" />
              <div className="p-2 text-sm">
                <p className="font-semibold">{rel.title}</p>
                <p className="text-gray-400">{rel.type} • {rel.year}</p>
                <button className="mt-1 text-xs px-2 py-1 bg-red-600 hover:bg-red-700 rounded-md">
                  Watch now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default MovieDetails;
