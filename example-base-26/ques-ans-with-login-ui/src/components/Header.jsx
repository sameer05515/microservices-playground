import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    const handleLogout = async () => {
        await logout();

        navigate("/login", {
            replace: true,
        });
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <header className="app-header">

            <div
                className="app-logo"
                onClick={() => navigate("/dashboard")}
            >
                QuesAns
            </div>

            <nav className="app-nav">

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""}`
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/todos"
                    className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""}`
                    }
                >
                    Todos
                </NavLink>

                <NavLink
                    to="/change-password"
                    className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""}`
                    }
                >
                    Change Password
                </NavLink>

            </nav>

            <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
            >
                Logout
            </button>

        </header>
    );
}

export default Header;