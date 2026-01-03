import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Dashboard() {

    const { logout } = useAuth();

    return (
        <div className="dashboard">

            <h1>Dashboard</h1>

            <p>
                You are successfully authenticated.
            </p>

            <div className="actions">

                <Link to="/change-password">
                    Change Password
                </Link>

                <button onClick={logout}>
                    Logout
                </button>

            </div>

        </div>
    );
}