import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

const RequireAuth = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user, roles } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!roles.some(role => allowedRoles.includes(role))) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

export default RequireAuth;
