// import { signup, login } from "./auth-v8/authService.itr001.mjs";
//==============================================================

// import { apiClient } from "./apiClient.itr001.mjs";

import axios from "axios";

let tokenStorage/**: string | null*/ = null; // Temporary storage

const API_BASE_URL = "http://localhost:3005/api/v8/auth"; // Adjust the base URL as needed

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach Authorization header if token is present
apiClient.interceptors.request.use((config) => {
  // const token = localStorage.getItem("authToken"); // Modify as per your storage mechanism
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  // return config;

  if (tokenStorage) {
    config.headers.Authorization = `Bearer ${tokenStorage}`;
  }
  return config;
});


// Function to set token manually
export const setAuthToken = (token/**: string*/) => {
  tokenStorage = token;
};

// interface AuthResponse {
//   token: string;
//   message: string;
// }

export const signup = async (name = "", email /**: string*/, password /**: string*/) /**: Promise<AuthResponse>*/ => {
  try {
    const response = await apiClient.post(/**<AuthResponse>*/ "/signup", { name, email, password });
    return response.data;
  } catch (error) {
    throw new Error(`Signup failed: ${error /**as any*/.response?.data?.message || error.message}`);
  }
};

export const login = async (email /**: string*/, password /**: string*/) /**: Promise<AuthResponse>*/ => {
  try {
    const response = await apiClient.post(/**<AuthResponse>*/ "/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(`Login failed: ${error /**as any*/.response?.data?.message || error.message}`);
  }
};











//====================================================================

const testAuth = async () => {
  try {
    // console.log("🔹 Signing up user...");
    // const signupResponse = await signup("Premendra Kumar","testuser@example.com", "Test@123");
    // console.log("✅ Signup Successful:", signupResponse);

    console.log("\n🔹 Logging in user...");
    const loginResponse = await login("testuser@example.com", "Test@123");
    console.log("✅ Login Successful:", loginResponse);

    console.log("\n🔹 Token:", loginResponse.token);
  } catch (error) {
    console.error("❌ Error:", error /** as any*/.message, error.error);
  }
};

testAuth();
