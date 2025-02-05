// RBAC

import axios from "axios";
import fs from "fs";
import path from "path";

const API_BASE_URL = "http://localhost:3005/api/v11";

class TokenStorage {
  static #TEMP_DIR = "D:\\my-temp\\";
  static #TOKEN_FILE_PATH = path.join(this.#TEMP_DIR, "token.v11.temp");

  static #ensureTempDir() {
    if (!fs.existsSync(this.#TEMP_DIR)) {
      fs.mkdirSync(this.#TEMP_DIR, { recursive: true });
    }
  }

  static saveTokenToFile(token) {
    this.#ensureTempDir();
    fs.writeFileSync(this.#TOKEN_FILE_PATH, token, { encoding: "utf-8" });
  }

  static getTokenFromFile() {
    try {
      return fs.readFileSync(this.#TOKEN_FILE_PATH, { encoding: "utf-8" });
    } catch {
      return null;
    }
  }

  static clearTokenFile() {
    if (fs.existsSync(this.#TOKEN_FILE_PATH)) {
      fs.unlinkSync(this.#TOKEN_FILE_PATH);
    }
  }
}

// export default TokenStorage;

class ApiClient {
  static signup = async (name = "", email /** : string */, password /** : string */, role = "user") => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, { name, email, password, role });
      console.log("✅ Signup successful:", response.data);
    } catch (error /** : any */) {
      console.error("❌ Signup failed:", error.response?.data || error.message);
    }
  };

  static login = async (email /** : string */, password /** : string */) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });

      const { token } = response.data;
      TokenStorage.saveTokenToFile(token); // Store the token in a temporary file

      console.log("✅ Login successful:", response.data);
    } catch (error /** : any */) {
      console.error(error);
      console.error("❌ Login failed:", error.response?.data || error.message);
    }
  };

  static getDataFromRoute = async (route = "/protected/hello") => {
    try {
      const token = TokenStorage.getTokenFromFile();
      if (!token) {
        console.error("❌ No token found. Please log in.");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}${route}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Protected Data:", response.data);
    } catch (error /** : any */) {
      console.error(`${route}`,"❌ Failed to fetch protected data:", error.response?.data || error.message);
    }
  };

  static logout = () => {
    TokenStorage.clearTokenFile();
    console.log("✅ Logged out successfully.");
  };
}

// class UsageExampleV1{

// }

// =======================================  USAGE EXAMPLE  =============================
const signUpRequired = false;
const loginRequired = true;
const shouldLogout = false;

const UserRegistry = {
  Admin1: { name: "Admin1 Kumar", email: "admin1@example.com", password: "Test@123", role: "admin" },
  User1: { name: "User1 Kumar", email: "user1@example.com", password: "Test@123", role: "user" },
};

const selectedUser = UserRegistry.Admin1;

// Step 1: Sign up a user, One time activity, hence execution of this route is masked
if (signUpRequired) {
  await ApiClient.signup(selectedUser.name, selectedUser.email, selectedUser.password, selectedUser.role);
}

// Step 2: Log in and store token in a file, also this is conditional one.
if (loginRequired) {
  await ApiClient.login(selectedUser.email, selectedUser.password);
}

// Step 3: Access protected and public API
// await ApiClient.getDataFromRoute("/protected/hello");

// await ApiClient.getDataFromRoute("/protected/hello2");

// await ApiClient.getDataFromRoute("/public");

await ApiClient.getDataFromRoute("/protected/admin-data");

await ApiClient.getDataFromRoute("/protected/user-data");

// Step 4: Logout and clear the token
if (shouldLogout) {
  ApiClient.logout();
}
