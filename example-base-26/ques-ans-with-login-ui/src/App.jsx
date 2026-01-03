import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ChangePassword from "./pages/ChangePassword";
import SecurityQuestions from "./pages/SecurityQuestions";
import Todos from "./pages/Todos";
import Header from "./components/Header";

import QuestionsPage from "./pages/QuestionsPage";
import TagsPage from "./pages/TagsPage";

import { exportAllData } from "./services/exportService";

export default function App() {

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
        <BrowserRouter>

            <AuthProvider>

                <Header />

                <Routes>



                    {/* Public */}
                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/signup"
                        element={<Signup />}
                    />

                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />

                    {/* Protected */}
                    <Route element={<ProtectedRoute />}>

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/change-password"
                            element={<ChangePassword />}
                        />

                        <Route
                            path="/security-questions"
                            element={<SecurityQuestions />}
                        />

                        <Route
                            path="/todos"
                            element={<Todos />}
                        />

                        <Route
                        path="/questions"
                        element={<QuestionsPage />}
                    />

                    <Route
                        path="/tags"
                        element={<TagsPage />}
                    />

                    </Route>

                    {/* Default */}
                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />

                </Routes>

            </AuthProvider>

        </BrowserRouter>
    );
}