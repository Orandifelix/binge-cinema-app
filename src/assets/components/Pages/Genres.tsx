import Footer from "../Footer";
import Navbar from "../Navbar";

const Genres = () => {
  const genres = [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Romance",
    "Crime",
    "Sci-Fi & Fantasy",
    "Thriller",
    "Western",
    "Documentary",
    "Adventure",
    "Animations",
    "Biography",
    "War & Politics",
    "Music",
    "Mystery",
    "Family",
    "Reality",
    "Kids",
    "History",
    "Soap",
    "War",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white font-sans">
        <div className="px-20"> 
      <Navbar />
        </div>
      <main className="flex-1 px-24 py-8">
        <h1 className="text-2xl font-bold mb-6">Browse by Genre</h1>

        {/* Genres as clickable words */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-10">
          {genres.map((genre, index) => (
            <span
              key={index}
              className="cursor-pointer text-gray-300 hover:text-red-500 hover:underline text-lg transition"
              onClick={() => console.log(`Selected: ${genre}`)}
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Movies placeholder */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            40 Movies of the type picked
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-900 h-40 rounded-lg flex items-center justify-center text-gray-500"
              >
                Poster {i + 1}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Genres;




 