import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-2xl font-bold text-blue-600">🏠 Home Page</h1>
      {user ? (
        <>
          <p className="text-lg">👋 Welcome, {user.id}!</p>
          <p className="text-sm text-gray-500">Your Role: {user.role.toUpperCase()}</p>
        </>
      ) : (
        <p className="text-red-500">🔑 Please log in to access restricted pages.</p>
      )}
    </div>
  );
};

export default Home;
