import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import SearchPage from "../Pages/SearchPage";

// Vitest mock
let mockedFetch: ReturnType<typeof vi.fn>;

beforeEach(() => {
  mockedFetch = vi.fn();
  // Telling TypeScript this is the global fetch
  global.fetch = mockedFetch as unknown as typeof fetch;
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("SearchPage", () => {
  it("shows loading and then renders movies", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [
          { id: 1, title: "Inception", poster_path: "/poster.jpg", release_date: "2010-07-16" },
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
