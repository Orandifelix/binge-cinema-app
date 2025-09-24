
import { useAuth } from "./context/useAuth";  
const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <p>{user?.email}</p>
      <button onClick={logout} className="mt-2 bg-red-600 text-white px-3 py-1 rounded-md">
        Logout
      </button>
    </div>
  );
};

export default Profile;
