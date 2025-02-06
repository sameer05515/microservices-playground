import { useState } from "react";

export default function About() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          About This Project
        </h1>
        <p className="text-lg text-gray-600">
          Welcome to <strong className="text-blue-600">vite-rbac-react-ts-app</strong>. This project is focused on 
          learning & integrating **RBAC (Role-Based Access Control)** with a **React + Vite + TypeScript** stack.
        </p>

        <h2 className="text-xl font-semibold mt-6 text-gray-700">
          🔥 Our Focus Areas
        </h2>
        <ul className="list-disc pl-6 text-gray-600">
          <li>⚡ <strong>Axios Config Usage</strong> - Handling API requests efficiently.</li>
          <li>🔐 <strong>RBAC with Axios</strong> - Secure API calls with role-based permissions.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 text-gray-700">
          📌 Implementation Plan
        </h2>

        <div className="space-y-4 mt-4">
          {/* Roadmap Item: Login & Signup */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <button
              onClick={() => toggleExpand("auth")}
              className="w-full text-left text-blue-600 font-medium flex justify-between"
            >
              ✅ Implemented Login & Signup with JWT
              <span>{expanded["auth"] ? "🔽" : "▶️"}</span>
            </button>
            {expanded["auth"] && (
              <ul className="mt-2 text-gray-600 list-disc pl-6">
                <li>✅ Protect routes with authentication.</li>
                <li>🎯 Implement refresh tokens securely.</li>
                <li>📌 Blocklist revoked refresh tokens to prevent misuse.</li>
              </ul>
            )}
          </div>

          {/* Roadmap Item: RBAC */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <button
              onClick={() => toggleExpand("rbac")}
              className="w-full text-left text-blue-600 font-medium flex justify-between"
            >
              🎯 Implement RBAC: Role-Based Access Control
              <span>{expanded["rbac"] ? "🔽" : "▶️"}</span>
            </button>
            {expanded["rbac"] && (
              <ul className="mt-2 text-gray-600 list-disc pl-6">
                <li>✅ Understanding RBAC fundamentals.</li>
                <li>✅ Implementing RBAC in Express.js.</li>
                <li>✅ Dynamic roles from MongoDB.</li>
                <li>🎯 Protect frontend UI based on roles.</li>
                <li>🎯 Implement group-based permissions & role hierarchies.</li>
              </ul>
            )}
          </div>

          {/* Roadmap Item: Performance Optimization */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <button
              onClick={() => toggleExpand("optimization")}
              className="w-full text-left text-blue-600 font-medium flex justify-between"
            >
              🎯 Performance: Rate Limiting & Caching
              <span>{expanded["optimization"] ? "🔽" : "▶️"}</span>
            </button>
            {expanded["optimization"] && (
              <ul className="mt-2 text-gray-600 list-disc pl-6">
                <li>🎯 Implement API rate-limiting.</li>
                <li>🎯 Optimize backend responses with caching.</li>
                <li>🎯 Improve REST API best practices.</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
