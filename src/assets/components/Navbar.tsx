const Navbar = () => {
  return (
    <nav className="w-full sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4">
        
        {/* Left section: Menu + Logo */}
        <div className="flex items-center space-x-4">
          {/* Hamburger */}
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-gray-700"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <h1 className="text-xl font-bold italic text-gray-900">BingeCinema</h1>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-md md:max-w-lg lg:max-w-xl mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Movies, Shows..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-50 border border-gray-300 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-500"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z" />
            </svg>
          </div>
        </div>

        {/* Right: Account */}
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-gray-700"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1119.88 17.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

      </div>
    </nav>
  )
}

export default Navbar

