import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim()) {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [query, navigate]);

  return (
    <div className="flex flex-1 max-w-md mx-4">
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Movies, Shows..."
          className="w-full pl-10 pr-4 py-1.5 rounded-full 
                     bg-gray-100 border border-gray-300 
                     text-gray-900 font-bold text-l placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 
                     text-sm"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-3 top-2.5 w-4 h-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z"
          />
        </svg>
      </div>
    </div>
  );
};

export default Search;

