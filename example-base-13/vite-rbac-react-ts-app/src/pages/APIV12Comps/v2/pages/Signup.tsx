import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Placeholder for backend API call

const Signup = () => {
  const navigate = useNavigate();

  // State for form inputs
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    roles: [], // Multi-role support 🔥 (Can be ["admin", "user"])
  });

  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 🔥 API CALL (Replace with real backend endpoint)
      const response = await axios.post("/api/v1/auth/signup", userData);
      console.log("Signup successful!", response.data);

      // Redirect to login after successful signup
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Signup</h2>
      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            name="username"
            className="form-control"
            value={userData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={userData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            name="roles"
            className="form-select"
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Signup</button>
      </form>

      <p className="mt-3">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Signup;
