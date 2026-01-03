import { NavLink,Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { exportAllData } from "../services/exportService";

export default function Dashboard() {

    const { logout } = useAuth();

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

    return (
        <div className="dashboard">

            <h1>Dashboard</h1>

            <p>
                You are successfully authenticated.
            </p>

            <div className="actions">

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

                <Link to="/todos">
                    My Todos
                </Link>

                <Link to="/change-password">
                    Change Password
                </Link>

                <Link to="/security-questions">
                    Security Questions
                </Link>

                <button onClick={logout}>
                    Logout
                </button>

            </div>

        </div>
    );
}