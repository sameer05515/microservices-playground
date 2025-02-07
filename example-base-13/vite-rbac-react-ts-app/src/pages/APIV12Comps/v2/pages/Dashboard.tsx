// import { useAuth } from "../hooks/useAuth"; // Assuming you have an authentication hook
import { useAuthContext as useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="container mt-4">
      <h2>Welcome, {user.id}! 🎉</h2>
      <p>This is your dashboard. You have access to all your data here.</p>
      <p>
        Role: <strong>{user.roles.join(", ")}</strong>
      </p>
    </div>
  );
};

export default Dashboard;
