import { apiClient } from "./apiClient.mjs";

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
