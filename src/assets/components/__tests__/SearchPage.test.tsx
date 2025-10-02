import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import SearchPage from "../Pages/SearchPage";

// Vitest mock for fetch
let mockedFetch: ReturnType<typeof vi.fn>;

beforeEach(() => {
  mockedFetch = vi.fn();
  global.fetch = mockedFetch as unknown as typeof fetch;
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("SearchPage", () => {
  it("shows loading and then renders a movie", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [
          {
            id: 1,
            title: "Inception",
            poster_path: "/poster.jpg",
            release_date: "2010-07-16",
            media_type: "movie",
          },
        ],
      }),
    } as unknown as Response);

    render(
      <MemoryRouter initialEntries={["/search?q=Inception"]}>
        <SearchPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Inception")).toBeInTheDocument();
    });
  });

  it("shows loading and then renders a TV show", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [
          {
            id: 2,
            name: "Breaking Bad",
            poster_path: "/bb.jpg",
            first_air_date: "2008-01-20",
            media_type: "tv",
          },
        ],
      }),
    } as unknown as Response);

    render(
      <MemoryRouter initialEntries={["/search?q=Breaking+Bad"]}>
        <SearchPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Breaking Bad")).toBeInTheDocument();
    });
  });

  it("shows no results if empty array returned", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    } as unknown as Response);

    render(
      <MemoryRouter initialEntries={["/search?q=Nothing"]}>
        <SearchPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No results/i)).toBeInTheDocument();
    });
  });
});

