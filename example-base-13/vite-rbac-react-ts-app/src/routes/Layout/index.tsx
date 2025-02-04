import Sidebar from "./Sidebar/v1";
import Header from "./Header/v1";
import { Outlet } from "react-router-dom";

export default function Layout(/**{ children }: { children: React.ReactNode }*/) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />

        {/* Main Section */}
        <main className="p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
