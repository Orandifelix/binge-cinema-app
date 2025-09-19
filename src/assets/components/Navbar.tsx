import { useState } from "react";
import Browse from "./Nav/Browse";
import Search from "./Nav/Search";
import Account from "./Nav/Account";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-gray-900 text-gray-400 shadow-sm sticky top-0 z-50">
      <div className="max-w-8xl mx-auto h-16 flex items-center justify-between px-6">
        
        {/* Left - Browse */}
        <div className="flex items-center space-x-3">
        <div className="hidden md:block">
  <Browse />
</div>
        </div>

        {/* Center - Logo */}
        <h1
        className="text-lg font-bold italic text-white cursor-pointer
                  transition-all duration-200
                  hover:text-indigo-400 hover:scale-105 hover:drop-shadow-lg"
        >
        🎬 BingeCinema
        </h1>

        {/* Center - Search */}
        <Search />

        {/* Right - Account + Hamburger */}
        <div className="flex items-center space-x-3">
        <div className="hidden md:block">
    <Account />
  </div>

          {/* Hamburger (mobile only) */}
          <button
            className="md:hidden p-1.5 rounded-md bg-white text-gray-900 hover:bg-gray-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
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
        <div className="md:hidden bg-gray-900 text-gray-400 border-t border-gray-700 px-4 py-2 space-y-2">
          <input
            type="text"
            placeholder="Search Movies, Shows..."
            className="w-full pl-10 pr-4 py-1.5 rounded-full bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <button className="w-full text-left p-2 rounded-md bg-white text-gray-900 hover:bg-gray-200">
            Account
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;




