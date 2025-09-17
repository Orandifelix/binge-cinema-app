const Browse = () => {
  return (
    <div>
        <button className="hidden md:flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 text-gray-700"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>Browse</span>
          </button>
    </div>
  )
}

export default Browse
