import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Genres from "../Pages/Genres";

// ✅ Mock TMDB module
vi.mock("../../../lib/tmdb", () => ({
  fetchGenres: vi.fn(() =>
    Promise.resolve([{ id: 1, name: "Action" }, { id: 2, name: "Drama" }])
  ),
  fetchMoviesByGenre: vi.fn(() =>
    Promise.resolve([{ id: 101, title: "Mad Max", poster_path: "/mm.jpg" }])
  ),
}));

describe("Genres", () => {
  it("fetches and displays genres", async () => {
    render(
      <MemoryRouter>
        <Genres />
      </MemoryRouter>
    );

    // Should show the mocked "Action" genre
    expect(await screen.findByText("Action")).toBeInTheDocument();
    expect(await screen.findByText("Drama")).toBeInTheDocument();
  });

  it("fetches movies on genre click", async () => {
    render(
      <MemoryRouter>
        <Genres />
      </MemoryRouter>
    );

    // Click on Action genre
    const genre = await screen.findByText("Action");
    fireEvent.click(genre);

    // Wait for the mocked movie to appear
    expect(await screen.findByText("Mad Max")).toBeInTheDocument();
  });
});
