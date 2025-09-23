import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it,  expect } from "vitest";
import Genres from "../Pages/Genres";
 

// vi.mock("../../lib/tmdb", () => ({
//   fetchGenres: vi.fn(() => Promise.resolve([{ id: 1, name: "Action" }])),
//   fetchMoviesByGenre: vi.fn(() => Promise.resolve([{ id: 101, title: "Mad Max", poster_path: "/mm.jpg" }])),
// }));

describe("Genres", () => {
  it("fetches and displays genres", async () => {
    render(
      <MemoryRouter>
        <Genres />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Action")).toBeInTheDocument();
    });
  });

  it("fetches movies on genre click", async () => {
    render(
      <MemoryRouter>
        <Genres />
      </MemoryRouter>
    );

    // const genre = await screen.findByText("Action");
    // fireEvent.click(genre);


  });
});
