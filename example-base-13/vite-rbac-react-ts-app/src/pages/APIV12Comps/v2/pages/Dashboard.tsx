import { useAuthContext as useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-blue-600 mb-4">🎉 Welcome, {user.id}!</h2>
        <p className="text-lg text-gray-700">This is your dashboard. You have access to all your data here.</p>
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-semibold text-gray-800">Role:</span> {user.roles.join(", ")}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
