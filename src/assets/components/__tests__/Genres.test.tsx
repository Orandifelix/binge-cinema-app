import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";   
import Genres from "../../components/Pages/Genres";
import type { Movie } from "../../../hooks/useFetchMovies";

// mock tmdb
vi.mock("../../../lib/tmdb", () => ({
  fetchGenres: vi.fn(),
  fetchMoviesByGenre: vi.fn(),
  fetchSeriesByGenre: vi.fn(),
}));

import {
  fetchGenres,
  fetchMoviesByGenre,
  fetchSeriesByGenre,
} from "../../../lib/tmdb";

vi.mock("../../components/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));
vi.mock("../../components/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));
vi.mock("../../components/Home/MovieCard", () => ({
  default: ({ movie }: { movie: Movie }) => (
    <div data-testid="movie-card">{movie?.title}</div>
  ),
}));

describe("Genres Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and displays movies + tv when genre is clicked", async () => {
    (fetchGenres as ReturnType<typeof vi.fn>).mockResolvedValue([{ id: 1, name: "Action" }]);
    (fetchMoviesByGenre as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: 101, title: "Mad Max", poster_path: "/poster.jpg", release_date: "2015-05-15", vote_average: 7.8, media_type: "movie" },
    ]);
    (fetchSeriesByGenre as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: 202, name: "Breaking Bad", poster_path: "/poster.jpg", first_air_date: "2008-01-20", vote_average: 9.5, media_type: "tv" },
    ]);

    render(
      <MemoryRouter>
        <Genres />
      </MemoryRouter>
    );

    fireEvent.click(await screen.findByText("Action"));

    await waitFor(() => {
      expect(screen.getByText("Mad Max")).toBeInTheDocument();
      expect(screen.getByText("Breaking Bad")).toBeInTheDocument();
    });
  });
});
