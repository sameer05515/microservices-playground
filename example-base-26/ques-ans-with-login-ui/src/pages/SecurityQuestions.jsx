import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getMySecurityQuestions,
    getSecurityQuestions,
    updateMySecurityQuestions,
} from "../api/authApi";

export default function SecurityQuestions() {
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [securityQuestions, setSecurityQuestions] = useState([
        { questionId: "", answer: "" },
        { questionId: "", answer: "" },
    ]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");

                const [allQuestions, current] = await Promise.all([
                    getSecurityQuestions(),
                    getMySecurityQuestions(),
                ]);

                setQuestions(allQuestions);

                const configured = current.questions || [];

                if (configured.length === 2) {
                    setSecurityQuestions(
                        configured.map((item) => ({
                            questionId: item.questionId,
                            answer: "",
                        }))
                    );
                }
            } catch (err) {
                console.error(err);
                setError(
                    err.response?.data?.message ||
                    "Unable to load security questions"
                );
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const updateQuestion = (index, field, value) => {
        setSecurityQuestions((current) =>
            current.map((item, i) =>
                i === index
                    ? { ...item, [field]: value }
                    : item
            )
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");

        if (!securityQuestions.every(
            (item) => item.questionId && item.answer.trim()
        )) {
            setError(
                "Please select both questions and provide both answers."
            );
            return;
        }

        if (
            securityQuestions[0].questionId ===
            securityQuestions[1].questionId
        ) {
            setError("Please select two different security questions.");
            return;
        }

        try {
            setSaving(true);

            await updateMySecurityQuestions(
                securityQuestions.map((item) => ({
                    questionId: item.questionId,
                    answer: item.answer.trim(),
                }))
            );

            setMessage("Security questions saved successfully.");

            setSecurityQuestions((current) =>
                current.map((item) => ({
                    ...item,
                    answer: "",
                }))
            );
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Unable to save security questions"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="auth-container">Loading...</div>;
    }

    return (
        <div className="auth-container">
            <form
                className="auth-form security-settings-form"
                onSubmit={handleSubmit}
            >
                <h1>Security Questions</h1>

                <p className="security-questions-help">
                    Configure two questions that can be used to recover your password.
                    Your answers are stored securely as hashes.
                </p>

                {error && <div className="error">{error}</div>}
                {message && <div className="success">{message}</div>}

                {securityQuestions.map((item, index) => (
                    <div
                        className="security-question-item"
                        key={index}
                    >
                        <label>
                            Security Question {index + 1}
                        </label>

                        <select
                            value={item.questionId}
                            onChange={(event) =>
                                updateQuestion(
                                    index,
                                    "questionId",
                                    event.target.value
                                )
                            }
                            required
                        >
                            <option value="">
                                Select a question
                            </option>

                            {questions.map((question) => (
                                <option
                                    key={question.id}
                                    value={question.id}
                                >
                                    {question.question}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder={
                                "Answer to question " + (index + 1)
                            }
                            value={item.answer}
                            onChange={(event) =>
                                updateQuestion(
                                    index,
                                    "answer",
                                    event.target.value
                                )
                            }
                            required
                        />
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={saving || questions.length < 2}
                >
                    {saving ? "Saving..." : "Save Security Questions"}
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
