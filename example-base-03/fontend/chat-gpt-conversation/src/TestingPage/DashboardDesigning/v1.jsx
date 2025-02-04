import React, { useState } from "react";

const DashboardDemoV1 = () => {
  const [isListVisible, setIsListVisible] = useState(true);
  const [selectedName, setSelectedName] = useState("Select a name");

  const names = Array.from({ length: 100 }, (_, i) => `Name ${i + 1}`);

  const toggleListVisibility = () => {
    setIsListVisible(!isListVisible);
  };

  return (
    <div className="dashboard block">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">Dashboard</h1>
        <button
          onClick={toggleListVisibility}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Toggle List
        </button>
      </header>

      {/* Container */}
      <div className="flex h-screen p-4">
        {/* List Section */}
        {isListVisible && (
          <div className="flex-1 bg-gray-100 overflow-y-auto border-r border-gray-300">
            <ul className="space-y-2 p-4">
              {names.map((name, index) => (
                <li
                  key={index}
                  className="p-2 bg-white hover:bg-blue-100 cursor-pointer rounded"
                  onClick={() => setSelectedName(name)}
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Card Section */}
        <div
          className={`${
            isListVisible ? "flex-[5]" : "flex-1"
          } bg-white p-4 rounded shadow overflow-y-auto`}
        >
          <h2 className="text-xl font-bold mb-4">{selectedName}</h2>
          <p className="text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
            Nulla quis sem at nibh elementum imperdiet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardDemoV1;
