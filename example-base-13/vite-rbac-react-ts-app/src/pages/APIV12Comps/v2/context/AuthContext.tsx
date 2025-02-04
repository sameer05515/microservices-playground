import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// 🔥 Define User Type (With Roles)
interface User {
  id: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// 🔥 Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Check if User is Logged In
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("http://localhost:3005/api/v13/auth/me", { withCredentials: true });
        setUser(data.user);
      } catch (error) {
        setUser(null);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // 🔥 Login Function
  const login = async (email: string, password: string) => {
    await axios.post("http://localhost:3005/api/v13/auth/login", { email, password }, { withCredentials: true });

    const { data } = await axios.get("http://localhost:3005/api/v13/auth/me", { withCredentials: true });
    setUser(data.user);
  };

  // 🔥 Logout Function
  const logout = async () => {
    await axios.post("http://localhost:3005/api/v13/auth/logout", {}, { withCredentials: true });
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
