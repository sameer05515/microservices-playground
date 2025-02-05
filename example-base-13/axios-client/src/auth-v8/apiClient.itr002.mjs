import axios from "axios";
import { saveTokenToFile, getTokenFromFile, clearTokenFile } from "./tokenStorage.itr002.mjs";

const API_BASE_URL = "http://localhost:3005/api/v8";

export const signup = async (email/** : string */, password/** : string */) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, { email, password });
    console.log("✅ Signup successful:", response.data);
  } catch (error/** : any */) {
    console.error("❌ Signup failed:", error.response?.data || error.message);
  }
};

export const login = async (email/** : string */, password/** : string */) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });

    const { token } = response.data;
    saveTokenToFile(token); // Store the token in a temporary file

    console.log("✅ Login successful:", response.data);
  } catch (error/** : any */) {
    console.error("❌ Login failed:", error.response?.data || error.message);
  }
};

export const getProtectedData = async (route="/hello") => {
  try {
    const token = getTokenFromFile();
    if (!token) {
      console.error("❌ No token found. Please log in.");
      return;
    }

    const response = await axios.get(`${API_BASE_URL}/protected${route}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("✅ Protected Data:", response.data);
  } catch (error/** : any */) {
    console.error("❌ Failed to fetch protected data:", error.response?.data || error.message);
  }
};

export const logout = () => {
  clearTokenFile();
  console.log("✅ Logged out successfully.");
};
