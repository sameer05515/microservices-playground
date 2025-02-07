// ====== -------------------------------------------------------------------- =====================
// import { signup, login, getProtectedData, logout } from "./auth-v8/apiClient.itr002.mjs";

import axios from "axios";

//==================================================================================
// import { saveTokenToFile, getTokenFromFile, clearTokenFile } from "./tokenStorage.itr002.mjs";

import fs from "fs";
import path from "path";

// Get the directory name using `import.meta.url`
const __dirname = "D:\\my-temp\\"; // new URL(".", import.meta.url).pathname;
const TEMP_DIR = "D:\\my-temp\\"; //path.join(__dirname, "temp");
const TOKEN_FILE_PATH = path.join(TEMP_DIR, "token.temp");

// const TOKEN_FILE_PATH = path.join(__dirname, "token.temp");

export const saveTokenToFile = (token /**: string*/) => {
  // Check if the directory exists; if not, create it
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
  }
  fs.writeFileSync(TOKEN_FILE_PATH, token, { encoding: "utf-8" });
};

export const getTokenFromFile = () /**: string | null*/ => {
  try {
    return fs.readFileSync(TOKEN_FILE_PATH, { encoding: "utf-8" });
  } catch (error) {
    return null;
  }
};

export const clearTokenFile = () => {
  if (fs.existsSync(TOKEN_FILE_PATH)) {
    fs.unlinkSync(TOKEN_FILE_PATH);
    // console.log("clear ho jayega!!");
  }
};

//==========================================================================================================

const API_BASE_URL = "http://localhost:3005/api/v8";

export const signup = async (email /** : string */, password /** : string */) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, { email, password });
    console.log("✅ Signup successful:", response.data);
  } catch (error /** : any */) {
    console.error("❌ Signup failed:", error.response?.data || error.message);
  }
};

export const login = async (email /** : string */, password /** : string */) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });

    const { token } = response.data;
    saveTokenToFile(token); // Store the token in a temporary file

    console.log("✅ Login successful:", response.data);
  } catch (error /** : any */) {
    console.error("❌ Login failed:", error.response?.data || error.message);
  }
};

export const getProtectedData = async (route = "/hello") => {
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
  } catch (error /** : any */) {
    console.error("❌ Failed to fetch protected data:", error.response?.data || error.message);
  }
};

export const logout = () => {
  clearTokenFile();
  console.log("✅ Logged out successfully.");
};

// ====== -------------------------------------------------------------------- =====================


// USAGE EXAMPLE
const signUpRequired = false;
const loginRequired = true;
const shouldLogout = false;

// Step 1: Sign up a user, One time activity, hence execution of this route is masked
if (signUpRequired) {
  await signup("testuser@example.com", "Test@123");
}

// Step 2: Log in and store token in a file, also this is conditional one.
if (loginRequired) {
  await login("testuser@example.com", "Test@123");
}

// Step 3: Access protected API
await getProtectedData("/hello");

await getProtectedData("/hello2");

// Step 4: Logout and clear the token
if (shouldLogout) {
  logout();
}
