import React from "react";

const Home: React.FC = () => {
  // Sections config 
  const sections = [
    { title: "🎬 Movies", color: "bg-red-500/20", label: "Movie" },
    { title: "📺 TV Shows", color: "bg-blue-500/20", label: "Show" },
    { title: "⭐ Top IMDB", color: "bg-yellow-500/20", label: "Top" },
    { title: "🎞 Latest Movies", color: "bg-green-500/20", label: "Latest" },
    { title: "📡 Latest TV Shows", color: "bg-purple-500/20", label: "Show" },
    { title: "⏳ Coming Soon", color: "bg-pink-500/20", label: "Coming" },
  ];

  return (
    <div className="h-auto bg-gray-950 text-white py-6 space-y-4">
      {sections.map((section, idx) => (
        <section key={idx}>
          {/* Section Title */}
          <h1 className="px-2 lg:px-24 text-xl sm:text-2xl font-bold mb-4">
            {section.title}
          </h1>

          {/* Grid of Cards */}
          <div className="px-2 lg:px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`h-64 ${section.color} rounded-lg flex items-center justify-center text-sm font-semibold`}
              >
                {section.label} {i + 1}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home;

