import React from 'react'

// Reusable Component for Error Display
const ErrorDisplayV1 = ({ errorMessage, onGoBack }) => (
    <div className="flex flex-col align-middle text-red-600 text-2xl w-full">
      <span>Error: {errorMessage}</span>
      <button onClick={onGoBack} className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Go Back
      </button>
    </div>
  );

export default ErrorDisplayV1