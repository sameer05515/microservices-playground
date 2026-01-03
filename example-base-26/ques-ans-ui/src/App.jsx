import { NavLink, Navigate, Route, Routes } from "react-router-dom";

import QuestionsPage from "./pages/QuestionsPage";
import TagsPage from "./pages/TagsPage";

import { exportAllData } from "./services/exportService";

function App() {

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
        <div className="app">

            <header className="app-header">
                <div className="header-content">

                    <div className="app-title">
                        <h1>Question Bank</h1>
                    </div>

                    <nav className="main-navigation">

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

                    </nav>

                </div>
            </header>

            <main className="main-container">

                <Routes>

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/questions"
                                replace
                            />
                        }
                    />

                    <Route
                        path="/questions"
                        element={<QuestionsPage />}
                    />

                    <Route
                        path="/tags"
                        element={<TagsPage />}
                    />

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/questions"
                                replace
                            />
                        }
                    />

                </Routes>

            </main>

        </div>
    );
}

export default App;