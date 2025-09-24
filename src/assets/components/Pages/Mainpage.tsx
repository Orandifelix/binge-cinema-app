import Footer from "../Footer"
import Home from "../Home"
import Landing from "../Landing"
import Navbar from "../Navbar"


const Mainpage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100 font-sans">
      {/* Navbar */}
      <div className="px-4 sm:px-6 lg:px-12 xl:px-20">
        <Navbar />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Landing />

        {/* Home Section */}
        <div className="px-4 sm:px-6 lg:px-12 xl:px-20 bg-gray-950">
          <Home />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Mainpage;
