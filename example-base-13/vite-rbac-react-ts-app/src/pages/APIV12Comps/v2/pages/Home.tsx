import { useAuthContext as useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">🏡 Welcome to the Application</h1>

        {user ? (
          <>
            <p className="text-lg font-medium text-gray-700">
              Hello, <span className="font-bold text-blue-500">{user.id}</span>! You are logged in.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Your roles: <span className="font-semibold text-gray-800">{user.roles.join(", ")}</span>
            </p>

            <div className="flex gap-4 mt-6">
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Go to Dashboard
              </Link>
              {user.roles.includes("admin") && (
                <Link
                  to="/admin"
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="text-red-500 text-lg">🔑 You are not logged in.</p>
            <Link
              to="/login"
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
