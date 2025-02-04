import { signup, login, getProtectedData, logout } from "./auth-v8/apiClient.itr002.mjs";

const signUpRequired = false;

// Step 1: Sign up a user, One time activity, hence execution of this route is masked
if (signUpRequired) {
  await signup("testuser@example.com", "Test@123");
}

// Step 2: Log in and store token in a file
await login("testuser@example.com", "Test@123");

// Step 3: Access protected API
await getProtectedData();

// Step 4: Logout and clear the token
logout();
