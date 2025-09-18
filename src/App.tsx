import Landing from "./assets/components/Landing"
import Navbar from "./assets/components/Navbar"

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900 font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1  overflow-y-auto">
        <Landing />
      </main>
    </div>
  )
}

export default App
