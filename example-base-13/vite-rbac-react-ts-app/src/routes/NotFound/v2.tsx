// import React from "react";
import notFoundImage from "../../assets/images/Not-found.webp";
import { Link } from "react-router-dom";

const NotFoundV2 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="mb-6">
          <img
            src={notFoundImage} // WebP image
            alt="Not Found"
            className="w-32 h-32 mx-auto rounded-full"
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 Not Found</h1>
        <p className="text-lg text-gray-600 mb-4">Oops! Page not found.</p>
        <Link to={"/"}>
          <button className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition">
            Go Back Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundV2;
