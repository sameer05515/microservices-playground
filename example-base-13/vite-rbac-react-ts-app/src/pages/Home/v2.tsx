import { Link } from "react-router-dom";
import { AvailableLinks } from "../../routes/available-links";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome</h1>
      <nav className="bg-white shadow-lg rounded-lg p-4 w-full max-w-md">
        <ul className="space-y-2">
          {AvailableLinks.map((link) => (
            <li key={link.id} className="text-center">
              <Link
                to={link.linkPath()}
                className="block px-4 py-2 text-lg font-medium text-blue-600 hover:bg-blue-100 rounded-md transition"
              >
                {link.linkHeader}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
