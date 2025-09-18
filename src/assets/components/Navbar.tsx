import { useState } from "react";
import Browse from "./Nav/Browse";
import Search from "./Nav/Search";
import Account from "./Nav/Account";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 md:px-6">
      
        <div className="flex items-center space-x-3">
          <Browse />
        </div>
        <h1 className="text-lg font-bold italic text-gray-900">
            BingeCinema
          </h1>
        <Search />
        <div className="flex items-center space-x-3">
          <Account />

          {/* Hamburger (mobile only) */}
          <button
            className="md:hidden p-1.5 hover:bg-gray-200 rounded-md"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-2 space-y-2">
          <input
            type="text"
            placeholder="Search Movies, Shows..."
            className="w-full pl-10 pr-4 py-1.5 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <button className="w-full text-left p-2 rounded-md hover:bg-gray-100">
            Account
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;



