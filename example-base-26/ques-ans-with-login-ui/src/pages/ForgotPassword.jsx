import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    getForgotPasswordQuestions,
    verifySecurityAnswers,
    resetPassword,
} from "../api/authApi";

export default function ForgotPassword() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLoadQuestions = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await getForgotPasswordQuestions(email);
            setQuestions(response.questions || []);
            setAnswers(
                (response.questions || []).map((question) => ({
                    questionId: question.questionId,
                    answer: "",
                }))
            );
            setStep(2);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to process password recovery request"
            );
        } finally {
            setLoading(false);
        }
    };

    const updateAnswer = (index, value) => {
        setAnswers((current) =>
            current.map((item, i) =>
                i === index ? { ...item, answer: value } : item
            )
        );
    };

    const handleVerifyAnswers = async (event) => {
        event.preventDefault();
        setError("");

        if (!answers.every((item) => item.answer.trim())) {
            setError("Please provide both answers.");
            return;
        }

        setLoading(true);

        try {
            const response = await verifySecurityAnswers(email, answers);
            setResetToken(response.resetToken);
            setStep(3);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Invalid security answers"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();
        setError("");

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await resetPassword(resetToken, newPassword);
            navigate("/login?reset=success", { replace: true });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to reset password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form
                className="auth-form forgot-password-form"
                onSubmit={
                    step === 1
                        ? handleLoadQuestions
                        : step === 2
                            ? handleVerifyAnswers
                            : handleResetPassword
                }
            >
                <h1>Forgot Password</h1>

                {error && <div className="error">{error}</div>}

                {step === 1 && (
                    <>
                        <p className="security-questions-help">
                            Enter your email to retrieve your security questions.
                        </p>

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? "Loading..." : "Continue"}
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <p className="security-questions-help">
                            Answer both security questions to continue.
                        </p>

                        {questions.map((question, index) => (
                            <div className="security-question-item" key={question.questionId}>
                                <label>{question.question}</label>
                                <input
                                    type="text"
                                    value={answers[index]?.answer || ""}
                                    onChange={(e) => updateAnswer(index, e.target.value)}
                                    autoComplete="off"
                                    required
                                />
                            </div>
                        ))}

                        <button type="submit" disabled={loading}>
                            {loading ? "Verifying..." : "Verify Answers"}
                        </button>

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() => {
                                setStep(1);
                                setError("");
                            }}
                        >
                            Back
                        </button>
                    </>
                )}

                {step === 3 && (
                    <>
                        <p className="security-questions-help">
                            Create a new password. This reset link expires in 10 minutes.
                        </p>

                        <input
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            minLength={8}
                            autoComplete="new-password"
                            required
                        />

                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            minLength={8}
                            autoComplete="new-password"
                            required
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </>
                )}

                <p>
                    Remember your password? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}
