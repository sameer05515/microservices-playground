import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_V12_OBJECT_KEY } from "../hooks/useAuth";
import LocalSessionManager from "../../../../common/utils/LocalSessionManager/v3";

const Login = () => {
  const [role, setRole] = useState<"admin" | "user">("user");
  const navigate = useNavigate();

  const handleLogin = () => {
    const user = { id: "user123", role };
    // localStorage.setItem(APP_V12_OBJECT_KEY, JSON.stringify(user));
    LocalSessionManager.writeApplicationObject(user, APP_V12_OBJECT_KEY);
    navigate("/"); // Redirect to home
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-2xl font-bold text-green-600">🔑 Login Page</h1>
      <select
        className="border p-2 rounded-md"
        value={role}
        onChange={(e) => setRole(e.target.value as "admin" | "user")}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleLogin}>
        Login as {role.toUpperCase()}
      </button>
    </div>
  );
};

export default Login;
