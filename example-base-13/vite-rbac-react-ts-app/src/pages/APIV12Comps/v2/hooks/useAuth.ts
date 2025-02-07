import { useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: string;
  roles: string[]; // Now supports multiple roles
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/v13/auth/me"); // Fetch user session
        setUser(response.data);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await axios.post("/api/v13/auth/logout"); // Backend logout call
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return { user, roles: user?.roles || [], logout };
};
