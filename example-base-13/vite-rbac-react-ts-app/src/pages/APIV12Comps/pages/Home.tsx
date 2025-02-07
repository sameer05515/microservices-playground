import { useNavigate } from "react-router-dom";
import { APP_V12_OBJECT_KEY, useAuth } from "../hooks/useAuth";
import { LocalSessionManager } from "../../../common/utils/LocalSessionManager/v2";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-2xl font-bold text-blue-600">🏠 Home Page</h1>
      {user ? (
        <>
          <p className="text-lg">👋 Welcome, {user.id}!</p>
          <p className="text-sm text-gray-500">Your Role: {user.role.toUpperCase()}</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => {
              LocalSessionManager.clearApplicationObject(APP_V12_OBJECT_KEY);
              navigate("/login");
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <p className="text-red-500">🔑 Please log in to access restricted pages.</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => navigate("/login")}
          >
            Go To Login Page
          </button>
        </>
      )}
    </div>
  );
};

export default Home;
