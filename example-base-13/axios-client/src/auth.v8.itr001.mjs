import { signup, login } from "./auth-v8/authService.mjs";

const testAuth = async () => {
  try {
    console.log("🔹 Signing up user...");
    const signupResponse = await signup("Premendra Kumar","testuser@example.com", "Test@123");
    console.log("✅ Signup Successful:", signupResponse);

    console.log("\n🔹 Logging in user...");
    const loginResponse = await login("testuser@example.com", "Test@123");
    console.log("✅ Login Successful:", loginResponse);

    console.log("\n🔹 Token:", loginResponse.token);
  } catch (error) {
    console.error("❌ Error:", error /** as any*/.message, error.error);
  }
};

testAuth();
