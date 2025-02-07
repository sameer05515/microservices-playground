// import { useNavigate } from "react-router-dom";
// import { useAuthContext as useAuth } from "../context/AuthContext";
// import LocalSessionManager from "../../../../common/utils/LocalSessionManager/v3";

// const Home = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   return (
//     <div className="flex flex-col items-center gap-4 p-6">
//       <h1 className="text-2xl font-bold text-blue-600">🏠 Home Page</h1>
//       {user && user.id  ? (
//         <>
//           <p className="text-lg">👋 Welcome, {user.id}!</p>
//           <p className="text-sm text-gray-500">Your Role: {user.role?.toUpperCase()}</p>
//           <button
//             className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//             onClick={() => {
//               LocalSessionManager.clearApplicationObject(APP_V12_OBJECT_KEY);
//               navigate("/login");
//             }}
//           >
//             Logout
//           </button>
//         </>
//       ) : (
//         <>
//           <p className="text-red-500">🔑 Please log in to access restricted pages.</p>
//           <button
//             className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//             onClick={() => navigate("/login")}
//           >
//             Go To Login Page
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default Home;



// import { useAuth } from "../hooks/useAuth";
import { useAuthContext as useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container mt-4">
      <h2>Welcome to the Application 🏡</h2>
      {user ? (
        <>
          <p>Hello, <strong>{user.id}</strong>! You are logged in.</p>
          <p>Your roles: <strong>{user.roles.join(", ")}</strong></p>

          <div className="mt-3">
            <Link to="/dashboard" className="btn btn-primary me-2">Go to Dashboard</Link>
            {user.roles.includes("admin") && (
              <Link to="/admin" className="btn btn-warning">Admin Panel</Link>
            )}
          </div>
        </>
      ) : (
        <>
          <p>You are not logged in.</p>
          <Link to="/login" className="btn btn-success">Login</Link>
        </>
      )}
    </div>
  );
};

export default Home;
