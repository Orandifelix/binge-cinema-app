import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PlayModal from "../Landing/Play_modal";
 
describe("PlayModal", () => {
  it("does not render when trailerOpen is false", () => {
    render(<PlayModal trailerOpen={false} trailerUrl="https://example.com" onClose={() => {}} />);
    expect(screen.queryByTitle("Trailer")).toBeNull();
  });

  it("renders iframe when trailerOpen is true", () => {
    render(<PlayModal trailerOpen={true} trailerUrl="https://youtube.com/embed/123" onClose={() => {}} />);
    const iframe = screen.getByTitle("Trailer");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", "https://youtube.com/embed/123");
  });

  it("calls onClose when close button is clicked", () => {
    const onCloseMock = vi.fn();
    render(<PlayModal trailerOpen={true} trailerUrl="https://youtube.com/embed/abc" onClose={onCloseMock} />);

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});

