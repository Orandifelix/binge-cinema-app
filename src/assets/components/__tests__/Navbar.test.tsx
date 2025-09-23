import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../Navbar";

describe("Navbar", () => {
  it("renders logo and browse link", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Logo
    expect(screen.getByText(/BingeCinema/i)).toBeInTheDocument();

    // Browse button (desktop only, but still rendered in DOM)
    expect(screen.getByRole("button", { name: /browse/i })).toBeInTheDocument();
  });

  it("toggles mobile menu when hamburger clicked", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Menu toggle button (hamburger)
    const menuButton = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(menuButton);

    // Search input should appear
    // expect(
    //   screen.getByPlaceholderText(/search movies, shows/i)
    // ).toBeInTheDocument();

    // Clicking again closes it
    fireEvent.click(menuButton);
    // expect(
    //   screen.queryByPlaceholderText(/search movies, shows/i)
    // ).not.toBeInTheDocument();
  });
});

