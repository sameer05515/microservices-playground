import React from "react";

const SampleNameListV1 = () => {
  // Generate 100 arbitrary names
  const names = Array.from({ length: 100 }, (_, i) => `Name ${i + 1}`);

  return (
    <div className="p-4 max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        List of Names
      </h1>
      <div className="border border-gray-300 rounded-lg bg-white dark:bg-gray-800 shadow-md overflow-hidden">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {names.map((name, index) => (
            <li
              key={index}
              className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SampleNameListV1;
