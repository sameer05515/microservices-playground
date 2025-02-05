import Link from "next/link";
import { redirect } from "next/navigation";

export default async function RBACV2({ searchParams }: { searchParams: { message?: string } }) {
  const message = searchParams.message || "";

  // Handle the login logic on the server side using "POST"
  async function handleLogin(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    const res = await fetch("http://localhost:3000/api/v1/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    // Use `redirect` after successful login to show the message in the query params
    if (res.ok) {
      return redirect(`/v3?message=${encodeURIComponent("✅ Login Successful!")}`);
    }
    return redirect(`/v3?message=${encodeURIComponent(`❌ ${data.message}`)}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-md">
        <h1 className="text-center text-2xl font-bold text-gray-800">🔒 RBAC v2</h1>

        {/* Form with action pointing to the `handleLogin` function */}
        <form action={handleLogin} method="POST" className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            className="w-full rounded-md border p-3"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            className="w-full rounded-md border p-3"
            required
          />

          <button type="submit" className="w-full rounded-md bg-blue-500 p-3 text-white">
            🔑 Login
          </button>
        </form>

        {/* Display success/error message if it exists */}
        {message && <p className="mt-4 rounded-md bg-gray-200 p-3 text-center text-gray-800">{message}</p>}

        {/* Link to fetch protected data */}
        <Link
          href="/v1/protected"
          className="block w-full text-center rounded-md bg-green-500 p-3 text-white mt-4"
        >
          🔍 Fetch Protected Data
        </Link>
      </div>
    </div>
  );
}
