// src/components/ColorCode.js
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getCodeForName, selectColors } from "../../store/v2/colors/colorSelectors-v2";

const debug = true;

const ColorCodeV2 = () => {
  const [colorName, setColorName] = useState("");

  const colors = useSelector(selectColors);

  // Dynamically create a selector for the input color name
  //   const colorCode = useSelector((state) => getCodeForName(colorName)(state));
  const colorCode = useSelector(getCodeForName(colorName));

  const handleInputChange = (e) => {
    setColorName(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {/* <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Color Code Finder</h1>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div> */}
        <input
          type="text"
          value={colorName}
          onChange={handleInputChange}
          placeholder="Enter color name"
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 mb-4 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring focus:ring-blue-300 dark:focus:ring-blue-500"
        />
        <div className="text-center">
          {colorCode ? (
            <p className="text-green-600 dark:text-green-400">
              The code for <strong>{colorName}</strong> is <strong>{colorCode}</strong>.
            </p>
          ) : (
            colorName && <p className="text-red-600 dark:text-red-400">Color not found.</p>
          )}
        </div>
        {debug && (
          <div className="mt-6">
            <h2 className="text-gray-600 dark:text-gray-400 font-medium text-sm">Available colors:</h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
              {colors.map(({ name }) => (
                <span
                  key={name}
                  className="inline-block bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 mr-2 mt-1"
                >
                  {name}
                </span>
              ))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorCodeV2;
