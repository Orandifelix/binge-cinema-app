import Footer from "../Footer"
import Navbar from "../Navbar"

const BrowseType = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-900 font-sans">
      {/* Navbar */}
      <div className="px-18">
      <Navbar />
     </div>
     <div>
        60 Movies of tthe type picked 
     </div>
      
      <Footer />
    </div>
  )
}

export default BrowseType


