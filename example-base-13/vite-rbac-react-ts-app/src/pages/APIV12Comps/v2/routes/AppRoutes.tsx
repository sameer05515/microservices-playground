import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import AdminPage from "../pages/AdminPage";
import Login from "../pages/Login";

const AppRoutes = () => {
  return (
    // <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    // </Router>
  );
};

export default AppRoutes;
