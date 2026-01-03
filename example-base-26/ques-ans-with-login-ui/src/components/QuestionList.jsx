import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function QuestionList({
    questions,
    onEdit,
    onDelete,
    searchText,
    tags = [],
}) {

    const getTagById = (tagId) => {

        return tags.find(
            (tag) => tag.id === tagId
        );
    };

    if (!questions.length) {

        if (searchText) {

            return (
                <div className="empty-state">

                    <div className="empty-icon">
                        🔍
                    </div>

                    <h3>
                        No Questions Found
                    </h3>

                    <p>
                        No questions or answers match{" "}
                        <strong>
                            "{searchText}"
                        </strong>
                    </p>

                </div>
            );
        }

        return (
            <div className="empty-state">

                <div className="empty-icon">
                    ?
                </div>

                <h3>
                    No Questions
                </h3>

                <p>
                    No questions have been added yet.
                </p>

            </div>
        );
    }

    return (

        <div className="question-list">

            <div className="list-header">

                <h2>
                    Questions
                </h2>

                <span>
                    {questions.length}
                </span>

            </div>


            {questions.map(
                (item, index) => (

                    <div
                        className="question-card"
                        key={item.id}
                    >

                        {/* Question Header */}

                        <div className="question-header">

                            <span className="question-number">
                                #{index + 1}
                            </span>

                            <span className="question-id">
                                {item.id}
                            </span>

                        </div>


                        {/* Tags */}

                        {item.tags?.length > 0 && (

                            <div className="question-tags">

                                {item.tags.map(
                                    (tagId) => {

                                        const tag =
                                            getTagById(
                                                tagId
                                            );

                                        if (!tag) {
                                            return null;
                                        }

                                        return (
                                            <span
                                                className="question-tag"
                                                key={tagId}
                                            >
                                                #{tag.name}
                                            </span>
                                        );
                                    }
                                )}

                            </div>
                        )}


                        {/* Question */}

                        <div className="markdown question-markdown">

                            <ReactMarkdown
                                remarkPlugins={[
                                    remarkGfm,
                                ]}
                            >
                                {item.question || ""}
                            </ReactMarkdown>

                        </div>


                        {/* Answers */}

                        <div className="answers">

                            {item.answers?.map(
                                (
                                    answer,
                                    answerIndex
                                ) => (

                                    <div
                                        className="answer"
                                        key={
                                            answerIndex
                                        }
                                    >

                                        <div className="answer-number">
                                            {answerIndex + 1}.
                                        </div>

                                        <div className="markdown answer-markdown">

                                            <ReactMarkdown
                                                remarkPlugins={[
                                                    remarkGfm,
                                                ]}
                                            >
                                                {answer}
                                            </ReactMarkdown>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>


                        {/* Actions */}

                        <div className="card-actions">

                            <button
                                type="button"
                                className="edit-button"
                                onClick={() =>
                                    onEdit(item)
                                }
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                className="danger-button"
                                onClick={() =>
                                    onDelete(
                                        item.id
                                    )
                                }
                            >
                                Delete
                            </button>

                        </div>

                    </div>
                )
            )}

        </div>
    );
}

export default QuestionList;