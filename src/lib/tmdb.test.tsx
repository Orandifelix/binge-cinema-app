import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import { fetchMovieTrailer } from "../lib/tmdb";

let mockedFetch: ReturnType<typeof vi.fn>;

beforeEach(() => {
  mockedFetch = vi.fn();
  // Cast to global fetch
  global.fetch = mockedFetch as unknown as typeof fetch;
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("fetchMovieTrailer", () => {
  it("returns trailer url when available", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [{ type: "Trailer", site: "YouTube", key: "abc123" }],
      }),
    } as unknown as Response);

    const url = await fetchMovieTrailer(1);
    expect(url).toBe("https://www.youtube.com/embed/abc123");
  });

  it("returns null when no trailer", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    } as unknown as Response);

    const url = await fetchMovieTrailer(1);
    expect(url).toBeNull();
  });
});
