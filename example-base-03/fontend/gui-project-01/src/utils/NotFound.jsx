import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./NotFound.module.css";

// NotFound Component
const NotFound = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <main className={styles.container}>
            <h1 className={styles.heading}>404 Not Found</h1>
            <p className={styles.message}>
                The page <span className={styles.route}>{location.pathname}</span> could not be found.
            </p>
            <section className={styles.actions}>
                <button
                    className={styles.backButton}
                    aria-label="Go back to the previous page"
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </button>
                <button
                    className={styles.homeButton}
                    aria-label="Go to Home Page"
                    onClick={() => navigate("/")}
                >
                    Go to Home
                </button>
            </section>
            <footer className={styles.footer}>
                <p>If you think this is a mistake, please contact support.</p>
            </footer>
        </main>
    );
};

export default NotFound;
