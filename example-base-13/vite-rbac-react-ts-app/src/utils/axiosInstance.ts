import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3005", // Your server's base URL /api/v1
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
