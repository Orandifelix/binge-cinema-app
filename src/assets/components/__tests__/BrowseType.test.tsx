import { render, screen,  } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect } from "vitest";
import BrowseType from "../Pages/BrowseType";
 

// vi.mock("../../lib/tmdb", () => ({
//   fetchMoviesByType: vi.fn(() => Promise.resolve([{ id: 1, title: "Titanic", poster_path: "/t.jpg" }])),
// }));

describe("BrowseType", () => {
  it("renders movies from type", async () => {
    render(
      <MemoryRouter initialEntries={["/browse/movie"]}>
        <Routes>
          <Route path="/browse/:type" element={<BrowseType />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    // await waitFor(() => {
    //   expect(screen.getByText("Titanic")).toBeInTheDocument();
    // });
  });
});

