import {
    useEffect,
    useState,
} from "react";

import QuestionForm from "../components/QuestionForm";
import QuestionList from "../components/QuestionList";

import {
    getQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
} from "../services/questionService";

import {
    getTags,
} from "../services/tagService";

import "./QuestionsPage.css";

function App() {

    const [questions, setQuestions] =
        useState([]);

    const [page, setPage] =
        useState(0);

    const [pageSize, setPageSize] =
        useState(10);

    const [totalPages, setTotalPages] =
        useState(0);

    const [totalElements, setTotalElements] =
        useState(0);

    const [searchText, setSearchText] =
        useState("");

    const [selectedQuestion, setSelectedQuestion] =
        useState(null);

    const [isModalOpen, setIsModalOpen] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [tags, setTags] = useState([]);


    // =========================================
    // Load Questions
    // =========================================

    const loadQuestions = async (
        requestedPage = page
    ) => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getQuestions({
                    page: requestedPage,
                    size: pageSize,
                    search: searchText,
                });

            setQuestions(
                data.content || []
            );

            setPage(
                data.number
            );

            setTotalPages(
                data.totalPages
            );

            setTotalElements(
                data.totalElements
            );

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load questions."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================
    // Initial Load
    // =========================================

    useEffect(() => {

        loadQuestions(0);

    }, [pageSize]);

    useEffect(() => {

    const loadTags = async () => {

        try {

            const data = await getTags();

            setTags(data || []);

        } catch (error) {

            console.error(
                "Failed to load tags:",
                error
            );
        }
    };

    loadTags();

}, []);


    // =========================================
    // Search
    // =========================================

    useEffect(() => {

        const timer =
            setTimeout(() => {

                loadQuestions(0);

            }, 300);

        return () =>
            clearTimeout(timer);

    }, [searchText]);


    // =========================================
    // Add
    // =========================================

    const handleAdd = () => {

        setSelectedQuestion(null);

        setError("");

        setIsModalOpen(true);
    };


    // =========================================
    // Edit
    // =========================================

    const handleEdit = (question) => {

        setSelectedQuestion(question);

        setError("");

        setIsModalOpen(true);
    };


    // =========================================
    // Save / Update
    // =========================================

    const handleSave = async (
        question
    ) => {

        try {

            setError("");

            if (selectedQuestion) {

                await updateQuestion(
                    selectedQuestion.id,
                    question
                );

            } else {

                await createQuestion(
                    question
                );
            }

            setIsModalOpen(false);

            setSelectedQuestion(null);

            await loadQuestions(page);

        } catch (error) {

            console.error(error);

            setError(
                "Unable to save question."
            );

            throw error;
        }
    };


    // =========================================
    // Delete
    // =========================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this question?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setError("");

            await deleteQuestion(id);

            /*
             * If the last item on the current
             * page was deleted, move to the
             * previous page.
             */

            if (
                questions.length === 1 &&
                page > 0
            ) {

                await loadQuestions(
                    page - 1
                );

            } else {

                await loadQuestions(
                    page
                );
            }

        } catch (error) {

            console.error(error);

            setError(
                "Unable to delete question."
            );
        }
    };


    // =========================================
    // Page Change
    // =========================================

    const handlePageChange = (
        newPage
    ) => {

        if (
            newPage < 0 ||
            newPage >= totalPages ||
            newPage === page
        ) {
            return;
        }

        loadQuestions(newPage);
    };


    // =========================================
    // Page Size
    // =========================================

    const handlePageSizeChange = (
        event
    ) => {

        setPageSize(
            Number(event.target.value)
        );

        setPage(0);
    };


    // =========================================
    // Close Modal
    // =========================================

    const handleCloseModal = () => {

        setIsModalOpen(false);

        setSelectedQuestion(null);
    };


    // =========================================
    // Overlay
    // =========================================

    const handleOverlayMouseDown = (
        event
    ) => {

        if (
            event.target ===
            event.currentTarget
        ) {

            handleCloseModal();
        }
    };


    // =========================================
    // Escape
    // =========================================

    useEffect(() => {

        if (!isModalOpen) {
            return;
        }

        const handleKeyDown = (
            event
        ) => {

            if (
                event.key === "Escape"
            ) {

                handleCloseModal();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };

    }, [isModalOpen]);


    return (

        <div className="app">

            {/* =================================
                Header
               ================================= */}

            <header className="app-header">

                <div>

                    <h1>
                        Question Bank
                    </h1>

                    <p>
                        Manage questions and answers
                    </p>

                </div>


                <div className="header-actions">

                    <div className="question-count">

                        {totalElements}

                        {" "}

                        {totalElements === 1
                            ? "Question"
                            : "Questions"}

                    </div>


                    <button
                        type="button"
                        className="primary-button add-button"
                        onClick={handleAdd}
                    >
                        + Add Question
                    </button>

                </div>

            </header>


            {/* =================================
                Main
               ================================= */}

            <main className="container">

                {error && (

                    <div className="error-message">

                        <span>
                            {error}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                        >
                            ×
                        </button>

                    </div>
                )}


                {/* Search */}

                <div className="search-container">

                    <div className="search-input-wrapper">

                        <span className="search-icon">
                            🔍
                        </span>

                        <input
                            type="search"
                            className="search-input"
                            value={searchText}
                            onChange={(event) => {

                                setSearchText(
                                    event.target.value
                                );

                                setPage(0);
                            }}
                            placeholder="Search questions..."
                        />

                        {searchText && (

                            <button
                                type="button"
                                className="search-clear-button"
                                onClick={() =>
                                    setSearchText("")
                                }
                            >
                                ×
                            </button>
                        )}

                    </div>

                </div>


                {/* Questions */}

                {loading ? (

                    <div className="loading">

                        <div className="loading-spinner">
                        </div>

                        Loading questions...

                    </div>

                ) : (

                    <QuestionList
                        questions={questions}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        searchText={searchText}
                        tags={tags}
                    />

                )}


                {/* Pagination */}

                {!loading &&
                    totalElements > 0 && (

                    <div className="pagination">

                        <div className="pagination-info">

                            Page{" "}
                            <strong>
                                {page + 1}
                            </strong>
                            {" "}of{" "}
                            <strong>
                                {totalPages}
                            </strong>

                        </div>


                        <div className="pagination-controls">

                            <button
                                type="button"
                                className="pagination-button"
                                disabled={
                                    page === 0
                                }
                                onClick={() =>
                                    handlePageChange(
                                        0
                                    )
                                }
                            >
                                «
                            </button>


                            <button
                                type="button"
                                className="pagination-button"
                                disabled={
                                    page === 0
                                }
                                onClick={() =>
                                    handlePageChange(
                                        page - 1
                                    )
                                }
                            >
                                Previous
                            </button>


                            {Array.from(
                                {
                                    length: totalPages,
                                },
                                (_, index) => index
                            )
                            .filter(
                                (index) =>
                                    Math.abs(
                                        index - page
                                    ) <= 2
                            )
                            .map(
                                (index) => (

                                    <button
                                        type="button"
                                        key={index}
                                        className={`pagination-button ${
                                            index === page
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handlePageChange(
                                                index
                                            )
                                        }
                                    >
                                        {index + 1}
                                    </button>

                                )
                            )}


                            <button
                                type="button"
                                className="pagination-button"
                                disabled={
                                    page >=
                                    totalPages - 1
                                }
                                onClick={() =>
                                    handlePageChange(
                                        page + 1
                                    )
                                }
                            >
                                Next
                            </button>


                            <button
                                type="button"
                                className="pagination-button"
                                disabled={
                                    page >=
                                    totalPages - 1
                                }
                                onClick={() =>
                                    handlePageChange(
                                        totalPages - 1
                                    )
                                }
                            >
                                »
                            </button>

                        </div>


                        <div className="page-size">

                            <label>
                                Per page
                            </label>

                            <select
                                value={pageSize}
                                onChange={
                                    handlePageSizeChange
                                }
                            >
                                <option value="5">
                                    5
                                </option>

                                <option value="10">
                                    10
                                </option>

                                <option value="20">
                                    20
                                </option>

                                <option value="50">
                                    50
                                </option>
                            </select>

                        </div>

                    </div>
                )}

            </main>


            {/* =================================
                Modal
               ================================= */}

            {isModalOpen && (

                <div
                    className="modal-overlay"
                    onMouseDown={
                        handleOverlayMouseDown
                    }
                >

                    <div
                        className="modal"
                        role="dialog"
                        aria-modal="true"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>

                                <h2>

                                    {selectedQuestion
                                        ? "Edit Question"
                                        : "Add Question"}

                                </h2>

                                <p>
                                    Enter question and
                                    answers using Markdown.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="modal-close-button"
                                onClick={
                                    handleCloseModal
                                }
                                aria-label="Close"
                            >
                                ×
                            </button>

                        </div>


                        <div className="modal-body">

                            <QuestionForm
                                selectedQuestion={
                                    selectedQuestion
                                }
                                onSave={
                                    handleSave
                                }
                                onCancel={
                                    handleCloseModal
                                }
                            />

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default App;