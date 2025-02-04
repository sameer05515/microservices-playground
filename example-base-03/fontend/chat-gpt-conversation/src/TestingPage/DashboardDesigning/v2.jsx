import React, { useState } from "react";

const DashboardDemoV2 = () => {
  const [isListVisible, setIsListVisible] = useState(true);
  const [selectedName, setSelectedName] = useState("Select a name");

  const names = Array.from({ length: 100 }, (_, i) => `Name ${i + 1}`);

  const toggleListVisibility = () => {
    setIsListVisible(!isListVisible);
  };

  return (
    <div className="dashboard block">
      {/* Header */}
      <header className="p-1 flex justify-between items-center text-xs bg-gray-800 text-white">
        <span className="font-bold">Dashboard</span>
        <button
          onClick={toggleListVisibility}
          className="bg-blue-500 hover:bg-blue-700 font-bold py-1 px-0 rounded"
        >
          Toggle List
        </button>
      </header>

      {/* Container */}
      <div className="flex p-4 overflow-y-auto">
        {/* List Section */}
        {isListVisible && (
          <div className="flex-1 border-r overflow-y-auto border-gray-300">
            <ul className="space-y-2 p-4">
              {names.map((name, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-blue-100 dark:hover:bg-black cursor-pointer rounded"
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
          }  p-4 rounded shadow overflow-y-auto`}
        >
          <h2 className="text-xl font-bold mb-4">{selectedName}</h2>
          <p className="">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
            Nulla quis sem at nibh elementum imperdiet.

            ================================================

            in a container div I want 2 div horizontally. first should flex 1 (list containing random 100 names) and second flex 5 (card showing selected name and fixed lorem ipsum text). there should be one header above container. and my header and container should be in dashboard div in display block. In header there is one button to toggle list div's visibility. if list hidden my card should grow and fill the gap.

            Please design a react component with above details with responsive classes from tailwind.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardDemoV2;
