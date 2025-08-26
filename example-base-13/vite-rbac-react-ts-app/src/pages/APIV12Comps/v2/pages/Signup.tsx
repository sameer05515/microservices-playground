import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Placeholder for backend API call

const Signup = () => {
  const navigate = useNavigate();

  // State for form inputs
  const [userData, setUserData] = useState({
    username: "",
    email:"",
    password: "",
    roles: "", // Single selection dropdown (Can be enhanced to multiple selection)
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
      const response = await axios.post("http://localhost:3005/api/v13/auth/register", userData);
      console.log("Signup successful!", response.data);

      // Redirect to login after successful signup
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-700">Sign Up</h2>

        {error && <p className="mb-4 rounded-md bg-red-100 p-2 text-center text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring"
              value={userData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="text"
              name="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring"
              value={userData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring"
              value={userData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
            <select
              name="roles"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring"
              value={userData.roles}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
