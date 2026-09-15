import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { exportAllData } from "../services/exportService";

function Header() {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    const handleExport = async () => {

        try {

            const blob = await exportAllData();

            const url =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                "question-bank.json";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error(
                "Export failed:",
                error
            );

            alert(
                "Failed to export questions and tags."
            );
        }
    };

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
                            to="/questions"
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            Questions
                        </NavLink>

                        <NavLink
                            to="/tags"
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            Tags
                        </NavLink>

                        <button
                            type="button"
                            className="export-button"
                            onClick={handleExport}
                        >
                            ↓ Export JSON
                        </button>

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