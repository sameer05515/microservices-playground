import { useState, useEffect } from "react";

interface User {
  id: string;
  role: "admin" | "user"; // Add more roles as needed
}

export const APP_V12_OBJECT_KEY = "appv12-user";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(APP_V12_OBJECT_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return { user, role: user?.role };
};
