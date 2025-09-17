import './App.css'
import Navbar from './assets/components/Navbar';

function App() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <Navbar />
      <h1 className="text-4xl font-bold text-blue-400">
        🚀 Tailwind 4 is working!
      </h1>
    </div>
  );
}

export default App;

