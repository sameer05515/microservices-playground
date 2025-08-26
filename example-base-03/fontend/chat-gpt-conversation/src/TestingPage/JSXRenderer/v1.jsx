// import React from 'react'

// const JSXRendererV1 = () => {
//   return (
//     <div>JSXRendererV1</div>
//   )
// }

// export default JSXRendererV1

import React, { useState } from "react";

const JSXRenderer/**: React.FC*/ = () => {
  const [jsxInput, setJsxInput] = useState/**<string>*/("");
  const [renderedComponent, setRenderedComponent] = useState/**<React.ReactNode>*/(null);
  const [error, setError] = useState/**<string | null>*/(null);

  const handleRender = () => {
    try {
      setError(null);
      const jsxFunction = new Function("React", `return (${jsxInput})`);
      const jsxElement = jsxFunction(React);

      if (React.isValidElement(jsxElement)) {
        setRenderedComponent(jsxElement);
      } else {
        throw new Error("Invalid JSX format. Please enter a valid JSX component.");
      }
    } catch (err) {
      setError("Invalid JSX. Please check your syntax.");
      setRenderedComponent(null);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">JSX Renderer</h2>
        
        <textarea
          className="w-full h-32 p-2 border rounded-md"
          placeholder="Enter JSX here (e.g., <h1>Hello</h1>)"
          value={jsxInput}
          onChange={(e) => setJsxInput(e.target.value)}
        />
        
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={handleRender}
        >
          Render JSX
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <div className="mt-6 p-4 border rounded-md bg-gray-50">
          <h3 className="font-semibold">Output:</h3>
          <div className="mt-2">{renderedComponent}</div>
        </div>
      </div>
    </div>
  );
};

export default JSXRenderer;
