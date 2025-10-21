import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

// Lazy load components for better performance
const BrowseType = lazy(() => import("./assets/components/Pages/BrowseType"));
const Genres = lazy(() => import("./assets/components/Pages/Genres"));
const Mainpage = lazy(() => import("./assets/components/Pages/Mainpage"));
const MovieDetails = lazy(() => import("./assets/components/Pages/MovieDetails"));
const SearchPage = lazy(() => import("./assets/components/Pages/SearchPage"));
const Live = lazy(() => import("./assets/components/Pages/Live"));
const SeriesDetails = lazy(() => import("./assets/components/Pages/SeriesDetails"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
  </div>
);

const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Home (Landing + Home) */}
        <Route path="/" element={<Mainpage />} />

        {/* Browse by type (Movies, TV, etc.) */}
        <Route path="/browse/:type" element={<BrowseType />} />

        {/* Genres page */}
        <Route path="/genres" element={<Genres />} />

        {/* Movie & TV details */}
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/tv/:id" element={<SeriesDetails />} />

        {/* Live Player */}
        <Route path="/live/:id" element={<Live />} /> {/* Movies direct */}
        <Route path="/live/movie/:id" element={<Live />} /> {/* Fallback for old links */}
        <Route path="/live/tv/:id" element={<Live />} /> {/* TV shows */}
        <Route
          path="/live/tv/:id/season/:season/episode/:episode"
          element={<Live />}
        />

        {/* Search page */}
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Suspense>
  );
};

export default App;
