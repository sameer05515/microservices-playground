import Link from "next/link";
import { redirect } from "next/navigation";

export default function RBACV2({ searchParams }: { searchParams: { message?: string } }) {
  const message = searchParams.message || "";

  async function handleLogin(formData: FormData) {
    "use server"; // Runs on the server side

    const email = formData.get("email");
    const password = formData.get("password");

    const res = await fetch("http://localhost:3000/api/v1/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      return redirect(`?message=${encodeURIComponent("✅ Login Successful!")}`);
    }
    return redirect(`?message=${encodeURIComponent(`❌ ${data.message}`)}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-md">
        <h1 className="text-center text-2xl font-bold text-gray-800">🔒 RBAC v2</h1>

        <form action={handleLogin} className="space-y-4">
          <input type="email" name="email" placeholder="Enter Email" className="w-full rounded-md border p-3" required />
          <input type="password" name="password" placeholder="Enter Password" className="w-full rounded-md border p-3" required />

          <button type="submit" className="w-full rounded-md bg-blue-500 p-3 text-white">🔑 Login</button>
        </form>

        {message && <p className="mt-4 rounded-md bg-gray-200 p-3 text-center text-gray-800">{message}</p>}

        <Link href="/v1/protected" className="block w-full text-center rounded-md bg-green-500 p-3 text-white mt-4">
          🔍 Fetch Protected Data
        </Link>
      </div>
    </div>
  );
}
