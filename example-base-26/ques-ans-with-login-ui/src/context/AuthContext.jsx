import {
    createContext,
    useContext,
    useState,
} from "react";

import {
    login as loginApi,
    logout as logoutApi,
    signup as signupApi,
} from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [token, setToken] = useState(
        () => localStorage.getItem("accessToken")
    );

    const login = async (email, password) => {

        const response = await loginApi({
            email,
            password,
        });

        localStorage.setItem(
            "accessToken",
            response.accessToken
        );

        setToken(response.accessToken);
    };

    const signup = async (
        name,
        email,
        password
    ) => {

        const response = await signupApi({
            name,
            email,
            password,
        });

        localStorage.setItem(
            "accessToken",
            response.accessToken
        );

        setToken(response.accessToken);
    };

    const logout = async () => {

        try {
            await logoutApi();
        } finally {

            localStorage.removeItem("accessToken");

            setToken(null);
        }
    };

    const isAuthenticated = Boolean(token);

    return (
        <AuthContext.Provider
            value={{
                token,
                isAuthenticated,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}