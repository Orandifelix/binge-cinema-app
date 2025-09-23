import { render, screen } from "@testing-library/react";
import Footer from "../Footer";

describe("Footer Component", () => {
  it("renders the app name", () => {
    render(<Footer />);
    expect(screen.getByText("🎬 BingeCinema")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Footer />);
    const navLinks = ["Movies", "TV Shows", "About", "Contact"];
    navLinks.forEach((link) => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });

  it("renders social icons", () => {
    render(<Footer />);
    const icons = screen.getAllByRole("link");
    expect(icons.length).toBeGreaterThanOrEqual(3); 
  });  {/* Closing brace here */}
  
  it("renders the copyright year", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(`© ${year} BingeCinema. All rights reserved.`)).toBeInTheDocument();
  });
});
