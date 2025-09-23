import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, vi, expect } from "vitest";
import SearchPage from "../Pages/SearchPage";
 

global.fetch = vi.fn();

describe("SearchPage", () => {
  it("shows loading and then renders movies", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [{ id: 1, title: "Inception", poster_path: "/poster.jpg", release_date: "2010-07-16" }],
      }),
    });

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
    (fetch as any).mockResolvedValueOnce({ ok: true, json: async () => ({ results: [] }) });

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
