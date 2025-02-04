// src/components/ColorCode.js
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectColorCode, selectColors } from "../../store/v2/colors/colorSelectors-v1";

const debug = true;

const ColorCodeV1 = () => {
  const [colorName, setColorName] = useState("");
  const colors = useSelector((state) => selectColors(state));
  const colorCode = useSelector((state) => selectColorCode(state, colorName));

  const handleInputChange = (e) => {
    setColorName(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Color Code Finder</h1>
        <input
          type="text"
          value={colorName}
          onChange={handleInputChange}
          placeholder="Enter color name"
          className="w-full border bg-white text-black border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <div className="mt-4 text-center">
          {colorCode ? (
            <p className="text-green-600">
              The code for <strong>{colorName}</strong> is <strong>{colorCode}</strong>.
            </p>
          ) : (
            colorName && <p className="text-red-600">Color not found.</p>
          )}
        </div>
        {debug && (
          <div className="mt-6">
            <h2 className="font-medium text-sm">Available colors:</h2>
            <p className="text-sm mt-1">
              {colors.map(({ name }) => (
                <span key={name} className="inline-block rounded px-2 py-1 mr-2 mt-1">
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

export default ColorCodeV1;
