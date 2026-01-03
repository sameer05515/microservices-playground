import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { changePassword } from "../api/authApi";

export default function ChangePassword() {

    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");
        setLoading(true);

        try {

            await changePassword({
                currentPassword,
                newPassword,
            });

            setMessage(
                "Password changed successfully"
            );

            setCurrentPassword("");
            setNewPassword("");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to change password"
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="auth-container">

            <form
                className="auth-form"
                onSubmit={handleSubmit}
            >

                <h1>Change Password</h1>

                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="success">
                        {message}
                    </div>
                )}

                <input
                    type="password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) =>
                        setCurrentPassword(
                            e.target.value
                        )
                    }
                    required
                />

                <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) =>
                        setNewPassword(
                            e.target.value
                        )
                    }
                    minLength={8}
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Changing..."
                        : "Change Password"}
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                >
                    Back
                </button>

            </form>

        </div>
    );
}