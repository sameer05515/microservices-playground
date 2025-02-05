import { signup, login, getProtectedData, logout } from "./auth-v8/apiClient.itr002.mjs";

const signUpRequired = false;
const loginRequired = false;
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
