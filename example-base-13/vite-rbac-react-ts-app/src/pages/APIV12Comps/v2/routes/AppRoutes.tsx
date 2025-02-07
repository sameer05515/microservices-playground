import { Routes, Route } from "react-router-dom";
import AdminPage from "../pages/AdminPage";
import Login from "../pages/Login";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import LogoutButton from "../pages/LogoutButton";
import Unauthorized from "../pages/Unauthorized";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Signup from "../pages/Signup";

const AppRoutes = () => {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/sign-up" element={<Signup />} />

          {/* 🔐 Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          {/* 🔥 Logout Button */}
          <Route path="/logout" element={<LogoutButton />} />
        </Routes>
      </AuthProvider>
    </>
  );
};

export default AppRoutes;
