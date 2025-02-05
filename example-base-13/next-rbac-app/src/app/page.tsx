export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-md">
        <h1 className="text-center text-2xl font-bold text-gray-800">🔒 Next.js RBAC Home</h1>
        <p className="text-center text-gray-600">Choose a version to explore RBAC implementations:</p>

        <div className="space-y-4">
          <a
            href="/v1"
            className="block w-full rounded-md bg-blue-500 p-3 text-center text-white transition-all hover:bg-blue-600"
          >
            🔹 RBAC v1 (Basic Role-Based Access)
          </a>

          <a
            href="/v2"
            className="block w-full rounded-md bg-blue-500 p-3 text-center text-white transition-all hover:bg-blue-600"
          >
            🔹 RBAC v2 (Basic Role-Based Access, using api/v1 routes and without {"use client"} in top of file 🤣)
          </a>

          {/* <a
            href="/v3"
            className="block w-full rounded-md bg-blue-500 p-3 text-center text-white transition-all hover:bg-blue-600"
          >
            🔹 RBAC v3 (Basic Role-Based Access, using api/v1 routes and without {"use client"} in top of file 🤣 and
            without issue faced in v2)
          </a> */}
          {/* Add more versions later */}
        </div>
      </div>
    </div>
  );
}

// "use client";
// import { useState } from "react";

// export default function Home() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const handleLogin = async () => {
//     const res = await fetch("/api/auth", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();
//     if (res.ok) {
//       localStorage.setItem("token", data.token);
//       setMessage("✅ Login Successful! Token saved.");
//     } else {
//       setMessage(`❌ ${data.message}`);
//     }
//   };

//   const fetchProtectedData = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return setMessage("⚠️ No token found. Please log in first.");

//     const res = await fetch("/api/protected", {
//       method: "GET",
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const data = await res.json();
//     setMessage(data.message);
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
//       <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-md">
//         <h1 className="text-center text-2xl font-bold text-gray-800">🔒 Next.js RBAC Demo</h1>

//         <div className="space-y-4">
//           <input
//             type="email"
//             placeholder="Enter Email"
//             className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <input
//             type="password"
//             placeholder="Enter Password"
//             className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <button
//             className="w-full rounded-md bg-blue-500 p-3 text-white transition-all hover:bg-blue-600"
//             onClick={handleLogin}
//           >
//             🔑 Login
//           </button>

//           <button
//             className="w-full rounded-md bg-green-500 p-3 text-white transition-all hover:bg-green-600"
//             onClick={fetchProtectedData}
//           >
//             🔍 Fetch Protected Data
//           </button>
//         </div>

//         {message && (
//           <p className="mt-4 rounded-md bg-gray-200 p-3 text-center text-gray-800">{message}</p>
//         )}
//       </div>
//     </div>
//   );
// }
