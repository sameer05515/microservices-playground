"use client";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      setMessage("Login Successful! Token saved.");
    } else {
      setMessage(data.message);
    }
  };

  const fetchProtectedData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setMessage("No token found. Please log in first.");

    const res = await fetch("/api/protected", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div>
      <h1>Next.js RBAC Demo</h1>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <button onClick={fetchProtectedData}>Fetch Protected Data</button>
      <p>{message}</p>
    </div>
  );
}
