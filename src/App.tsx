import { Routes, Route } from "react-router-dom";

import BrowseType from "./assets/components/Pages/BrowseType";
import Genres from "./assets/components/Pages/Genres";
import Mainpage from "./assets/components/Pages/Mainpage";
import MovieDetails from "./assets/components/Pages/MovieDetails";
import SearchPage from "./assets/components/Pages/SearchPage";
import Live from "./assets/components/Pages/Live";
import SeriesDetails from "./assets/components/Pages/SeriesDetails";

const App = () => {
  return (
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
      <Route path="/live/movie/:id" element={<Live />} />
      <Route path="/live/tv/:id" element={<Live />} />
      <Route
        path="/live/tv/:id/season/:season/episode/:episode"
        element={<Live />}
      />

      {/* Search page */}
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  );
};

export default App;
