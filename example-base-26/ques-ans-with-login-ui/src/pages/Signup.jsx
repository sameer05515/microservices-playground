import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getSecurityQuestions } from "../api/authApi";

export default function Signup() {
    const navigate = useNavigate();
    const { signup } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [questions, setQuestions] = useState([]);
    const [securityQuestions, setSecurityQuestions] = useState([
        { questionId: "", answer: "" },
        { questionId: "", answer: "" },
    ]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getSecurityQuestions()
            .then(setQuestions)
            .catch(() => setError("Unable to load security questions"));
    }, []);

    const updateSecurityQuestion = (index, field, value) => {
        setSecurityQuestions((current) =>
            current.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!securityQuestions.every((item) => item.questionId && item.answer.trim())) {
            setError("Please select both security questions and provide both answers.");
            return;
        }

        if (securityQuestions[0].questionId === securityQuestions[1].questionId) {
            setError("Please select two different security questions.");
            return;
        }

        setLoading(true);
        try {
            await signup(name, email, password, securityQuestions);
            navigate("/dashboard");
        } catch (error) {
            setError(error.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Create Account</h1>

                {error && <div className="error">{error}</div>}

                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />

                <div className="security-questions-section">
                    <h2>Security Questions</h2>
                    <p className="security-questions-help">These questions can be used to recover your password.</p>

                    {securityQuestions.map((item, index) => (
                        <div className="security-question-item" key={index}>
                            <label>Security Question {index + 1}</label>
                            <select
                                value={item.questionId}
                                onChange={(e) => updateSecurityQuestion(index, "questionId", e.target.value)}
                                required
                            >
                                <option value="">Select a question</option>
                                {questions.map((question) => (
                                    <option key={question.id} value={question.id}>
                                        {question.question}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Your answer"
                                value={item.answer}
                                onChange={(e) => updateSecurityQuestion(index, "answer", e.target.value)}
                                required
                            />
                        </div>
                    ))}
                </div>

                <button type="submit" disabled={loading || questions.length === 0}>
                    {loading ? "Creating account..." : "Signup"}
                </button>

                <p>Already have an account? <Link to="/login">Login</Link></p>
            </form>
        </div>
    );
}
