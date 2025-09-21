import Footer from "./assets/components/Footer"
import Home from "./assets/components/Home"
import Landing from "./assets/components/Landing"
import Navbar from "./assets/components/Navbar"

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-900 font-sans">
      {/* Navbar */}
      <div className="px-18">
      <Navbar />
     </div>
      {/* Main content */}
      <main className="flex-1  overflow-y-auto">
        <Landing />
        <div className="px-18 bg-gray-950">
        <Home />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
