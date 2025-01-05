import React from "react";
import styles from "./styles.module.css";

const NotFoundV1 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="mb-6">
          <img
            src="https://via.placeholder.com/150" // Replace this with your final image URL
            alt="Not Found"
            className={`w-32 h-32 mx-auto rounded-full ${styles.fadeIn}`}
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4 animate__animated animate__fadeIn">
          404 Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-4 animate__animated animate__fadeIn animate__delay-1s">
          Oops! Page not found.
        </p>
        <button className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition">
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundV1;
