import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { auth } from "../../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import type { User } from "firebase/auth";  

const Account = () => {
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Track logged in user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // Save username to Firebase profile
      await updateProfile(userCred.user, {
        displayName: username,
      });

      setOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div>
      {/* If user logged in, show their username/email + logout */}
      {user ? (
        <div className="flex items-center space-x-3">
          <span className="text-sm font-semibold text-gray-600">
            {user.displayName || user.email}
          </span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      ) : (
        // Account button (opens modal)
        <button
          onClick={() => setOpen(true)}
          className="flex items-center space-x-2 px-3 py-1.5 
             bg-white text-gray-900 font-semibold rounded-md text-sm 
             shadow-md hover:shadow-xl hover:scale-105 active:scale-95 
             border border-gray-200 
             transition-all duration-200 ease-in-out
             focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
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
          <span>Account</span>
        </button>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          {/* Card */}
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>

            {/* Tabs */}
            <div className="flex justify-center mb-6 space-x-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`text-sm font-semibold ${
                  isLogin ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`text-sm font-semibold ${
                  !isLogin ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"
                }`}
              >
                Signup
              </button>
            </div>

            {/* Error */}
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            {/* Form */}
            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
