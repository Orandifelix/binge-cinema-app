import Footer from "../Footer";
import Navbar from "../Navbar";

const BrowseType = () => {
  // Mock movies for layout
  const movies = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    title: `Movie ${i + 1}`,
    year: 2020 + (i % 4),
    poster: `https://picsum.photos/300/450?random=${i + 1}`,
  }));

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white font-sans">
        <div className="px-18">
      <Navbar /></div>

      <main className="flex-1 px-24 py-8">
        {/* Section title */}
        <h1 className="text-2xl font-bold mb-6">
          60 Movies of the type picked
        </h1>

        {/* Movies grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-gray-900 rounded-lg overflow-hidden shadow-md hover:scale-105 transition"
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-60 object-cover"
              />
              <div className="p-3 text-sm">
                <p className="font-semibold">{movie.title}</p>
                <p className="text-gray-400">{movie.year}</p>
                <button className="mt-2 text-xs px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md">
                  Watch now
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BrowseType;



