import Avatar from "./Avatar/v1";

export default function Header() {
    return (
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Welcome</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Admin</span>
          {/* <img src="https://via.placeholder.com/32" alt="Profile" className="w-8 h-8 rounded-full" /> */}
          <Avatar username="Premendra Kumar"/>
        </div>
      </header>
    );
  }
  