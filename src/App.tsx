import Navbar from "./assets/components/Navbar"

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900 font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          Welcome to BingeCinema 🎬
        </h2>
        <p>
          Here we’ll render movie sections, recommendations, and more.
        </p>
      </main>
    </div>
  )
}

export default App
