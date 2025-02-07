// import RBACWrapper from "../components/RBACWrapper";

// const AdminPage = () => {
//   return (
//     <RBACWrapper allowedRoles={["admin"]}>
//       <h1 className="text-xl font-bold text-green-600">Welcome, Admin! ✅</h1>
//     </RBACWrapper>
//   );
// };

// export default AdminPage;


// import { useAuth } from "../hooks/useAuth";
import { useAuthContext as useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminPage = () => {
  const { user } = useAuth();

  if (!user || !user.roles.includes("admin")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard 🛠️</h2>
      <p>Welcome, <strong>{user.id}</strong>! You have **admin privileges**.</p>
      <ul>
        <li>Manage users</li>
        <li>View system logs</li>
        <li>Modify application settings</li>
      </ul>
    </div>
  );
};

export default AdminPage;

