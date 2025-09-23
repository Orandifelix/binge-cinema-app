import { describe, it, vi, expect } from "vitest";
import { fetchMovieTrailer } from "../lib/tmdb";

global.fetch = vi.fn();

describe("fetchMovieTrailer", () => {
  it("returns trailer url when available", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [{ type: "Trailer", site: "YouTube", key: "abc123" }] }),
    });

    const url = await fetchMovieTrailer(1);
    expect(url).toBe("https://www.youtube.com/embed/abc123");
  });

  it("returns null when no trailer", async () => {
    (fetch as any).mockResolvedValueOnce({ ok: true, json: async () => ({ results: [] }) });
    const url = await fetchMovieTrailer(1);
    expect(url).toBeNull();
  });
});
