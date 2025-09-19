import React from "react";
import { Github, Twitter, Youtube } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        
        {/* Left: Logo / App Name */}
        <div className="text-lg font-bold text-white">
          🎬 BingeCinema
        </div>

        {/* Middle: Navigation */}
        <nav className="flex space-x-6 text-sm">
          <a href="#" className="hover:text-white transition-colors">Movies</a>
          <a href="#" className="hover:text-white transition-colors">TV Shows</a>
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </nav>

        {/* Right: Social Icons */}
        <div className="flex space-x-4">
          <a href="#" className="hover:text-white transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-white transition-colors">
            <Youtube className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Bottom: Copy */}
    <div className="mt-6 text-center text-xs text-gray-500">
    © {new Date().getFullYear()} BingeCinema. All rights reserved.
    </div>

    </footer>
  );
};

export default Footer;
