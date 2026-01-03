import { useEffect, useState } from "react";

import { getTags } from "../services/tagService";

function QuestionForm({
    selectedQuestion,
    onSave,
    onCancel,
}) {

    const [question, setQuestion] = useState("");

    const [answers, setAnswers] = useState([""]);

    const [tags, setTags] = useState([]);

    const [selectedTags, setSelectedTags] = useState([]);

    const [saving, setSaving] = useState(false);

    const [loadingTags, setLoadingTags] = useState(false);

    useEffect(() => {

        if (selectedQuestion) {

            setQuestion(
                selectedQuestion.question || ""
            );

            setAnswers(
                selectedQuestion.answers?.length
                    ? [...selectedQuestion.answers]
                    : [""]
            );

            setSelectedTags(
                selectedQuestion.tags?.length
                    ? [...selectedQuestion.tags]
                    : []
            );

        } else {

            setQuestion("");

            setAnswers([""]);

            setSelectedTags([]);
        }

    }, [selectedQuestion]);

    useEffect(() => {

        const loadTags = async () => {

            try {

                setLoadingTags(true);

                const data = await getTags();

                setTags(data || []);

            } catch (error) {

                console.error(
                    "Failed to load tags:",
                    error
                );

            } finally {

                setLoadingTags(false);
            }
        };

        loadTags();

    }, []);

    const handleAnswerChange = (
        index,
        value
    ) => {

        setAnswers((current) => {

            const updatedAnswers = [
                ...current,
            ];

            updatedAnswers[index] = value;

            return updatedAnswers;
        });
    };

    const addAnswer = () => {

        setAnswers((current) => [
            ...current,
            "",
        ]);
    };

    const removeAnswer = (index) => {

        setAnswers((current) => {

            if (current.length === 1) {
                return current;
            }

            return current.filter(
                (_, i) => i !== index
            );
        });
    };

    const handleTagChange = (tagId) => {

        setSelectedTags((current) => {

            if (current.includes(tagId)) {

                return current.filter(
                    (id) => id !== tagId
                );
            }

            return [
                ...current,
                tagId,
            ];
        });
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        const trimmedQuestion =
            question.trim();

        const cleanedAnswers =
            answers
                .map((answer) => answer.trim())
                .filter(
                    (answer) =>
                        answer.length > 0
                );

        if (!trimmedQuestion) {

            alert(
                "Question is required."
            );

            return;
        }

        if (!cleanedAnswers.length) {

            alert(
                "At least one answer is required."
            );

            return;
        }

        try {

            setSaving(true);

            await onSave({
                question: trimmedQuestion,
                answers: cleanedAnswers,
                tags: selectedTags,
            });

        } catch (error) {

            console.error(error);

        } finally {

            setSaving(false);
        }
    };

    return (

        <form
            className="question-form"
            onSubmit={handleSubmit}
        >

            {/* Question */}

            <div className="form-group">

                <label htmlFor="question">
                    Question
                </label>

                <p className="markdown-hint">
                    Markdown is supported.
                </p>

                <textarea
                    id="question"
                    value={question}
                    onChange={(event) =>
                        setQuestion(
                            event.target.value
                        )
                    }
                    placeholder={`Enter question in Markdown...

Example:

## What is Spring Boot?

Explain the following:

- Auto Configuration
- Starter Dependencies
- Embedded Server`}
                    rows={8}
                    disabled={saving}
                />

            </div>


            {/* Tags */}

            <div className="form-group">

                <label>
                    Tags
                </label>

                <p className="markdown-hint">
                    Select one or more tags.
                </p>

                {loadingTags ? (

                    <div className="tag-loading">
                        Loading tags...
                    </div>

                ) : tags.length === 0 ? (

                    <div className="tag-empty">
                        No tags available. Create tags
                        from the Tags page first.
                    </div>

                ) : (

                    <div className="tag-selector">

                        {tags.map((tag) => (

                            <label
                                className={
                                    selectedTags.includes(
                                        tag.id
                                    )
                                        ? "tag-option selected"
                                        : "tag-option"
                                }
                                key={tag.id}
                            >

                                <input
                                    type="checkbox"
                                    checked={
                                        selectedTags.includes(
                                            tag.id
                                        )
                                    }
                                    onChange={() =>
                                        handleTagChange(
                                            tag.id
                                        )
                                    }
                                    disabled={saving}
                                />

                                <span>
                                    {tag.name}
                                </span>

                            </label>

                        ))}

                    </div>
                )}

            </div>


            {/* Answers */}

            <div className="answers-header">

                <div>

                    <label>
                        Answers
                    </label>

                    <p className="markdown-hint">
                        Each answer can contain
                        multiline Markdown.
                    </p>

                </div>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={addAnswer}
                    disabled={saving}
                >
                    + Add Answer
                </button>

            </div>


            {answers.map(
                (answer, index) => (

                    <div
                        className="answer-editor"
                        key={index}
                    >

                        <div className="answer-editor-header">

                            <span>
                                Answer {index + 1}
                            </span>

                            <button
                                type="button"
                                className="danger-button"
                                onClick={() =>
                                    removeAnswer(index)
                                }
                                disabled={
                                    saving ||
                                    answers.length === 1
                                }
                            >
                                Remove
                            </button>

                        </div>

                        <textarea
                            value={answer}
                            onChange={(event) =>
                                handleAnswerChange(
                                    index,
                                    event.target.value
                                )
                            }
                            placeholder={`Enter answer in Markdown...

Example:

Spring Boot provides **auto-configuration**.

It reduces the amount of configuration
required in a Spring application.`}
                            rows={10}
                            disabled={saving}
                        />

                    </div>
                )
            )}


            {/* Actions */}

            <div className="form-actions">

                <button
                    type="submit"
                    className="primary-button"
                    disabled={saving}
                >
                    {saving
                        ? "Saving..."
                        : selectedQuestion
                            ? "Update Question"
                            : "Save Question"}
                </button>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={onCancel}
                    disabled={saving}
                >
                    Cancel
                </button>

            </div>

        </form>
    );
}

export default QuestionForm;