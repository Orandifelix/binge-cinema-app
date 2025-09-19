
const Account = () => {
  return (
    <div>
        <button className="flex items-center space-x-2 px-3 py-1.5 
           bg-white text-gray-900 font-semibold rounded-md text-sm 
           shadow-md hover:shadow-xl hover:scale-105 active:scale-95 
           border border-gray-200 
           transition-all duration-200 ease-in-out
           focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A9 9 0 1119.88 17.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
    </div>
  )
}

export default Account
