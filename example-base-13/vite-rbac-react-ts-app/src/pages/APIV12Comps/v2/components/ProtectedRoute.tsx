import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext as useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />; // 🔐 Redirect if not logged in
  if (!user.roles.some((role) => allowedRoles.includes(role))) return <Navigate to="/unauthorized" />; // 🔐 Redirect if no permission

  return <Outlet />;
};

export default ProtectedRoute;
