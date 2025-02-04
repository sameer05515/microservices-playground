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