import axios from "axios";
import fs from "fs";
import path from "path";

const API_BASE_URL = "http://localhost:3005/api/v8";

class TokenStorage {
  static #TEMP_DIR = "D:\\my-temp\\";
  static #TOKEN_FILE_PATH = path.join(this.#TEMP_DIR, "token.temp");

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
  static signup = async (email /** : string */, password /** : string */) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, { email, password });
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
      console.error("❌ Login failed:", error.response?.data || error.message);
    }
  };

  static getProtectedData = async (route = "/hello") => {
    try {
      const token = TokenStorage.getTokenFromFile();
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

  static logout = () => {
    TokenStorage.clearTokenFile();
    console.log("✅ Logged out successfully.");
  };
}

// class UsageExampleV1{

// }

// USAGE EXAMPLE
const signUpRequired = false;
const loginRequired = false;
const shouldLogout = false;

// Step 1: Sign up a user, One time activity, hence execution of this route is masked
if (signUpRequired) {
  await ApiClient.signup("testuser@example.com", "Test@123");
}

// Step 2: Log in and store token in a file, also this is conditional one.
if (loginRequired) {
  await ApiClient.login("testuser@example.com", "Test@123");
}

// Step 3: Access protected API
await ApiClient.getProtectedData("/hello");

await ApiClient.getProtectedData("/hello2");

// Step 4: Logout and clear the token
if (shouldLogout) {
  ApiClient.logout();
}
