import { useState, useEffect } from "react";
// import { LocalSessionManager } from "../../../common/utils/LocalSessionManager/v1";
import LocalSessionManager from "../../../../common/utils/LocalSessionManager/v3";

interface User {
  id: string;
  role: "admin" | "user"; // Add more roles as needed
}

export const APP_V12_OBJECT_KEY = "appv12-user";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // const storedUser = localStorage.getItem(APP_V12_OBJECT_KEY);
    const storedUser = LocalSessionManager.readApplicationObject<User>(APP_V12_OBJECT_KEY);
    
    // 🔥 Directly set the user since it's already parsed
    // if (storedUser && "id" in storedUser && "role" in storedUser) {
    //   setUser(storedUser as User);
    // }

    // ✅ Convert to `unknown` first, then assert as `User`
    // if (storedUser && typeof storedUser === "object" && "id" in storedUser && "role" in storedUser) {
    //   setUser(storedUser as unknown as User);
    // }

    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return { user, role: user?.role };
};
