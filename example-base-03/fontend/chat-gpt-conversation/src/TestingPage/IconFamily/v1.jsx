import React from "react";

const IconFamilyV1 = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header Section */}
      <header className="h-[10vh] bg-blue-500 flex items-center justify-center text-white">
        <h1>Dashboard Header</h1>
      </header>

      {/* Main Content Section */}
      <div className="flex flex-grow">
        {/* List Section */}
        <div className="w-1/4 bg-gray-100 overflow-auto p-4">
          <h2 className="text-lg font-bold mb-2">List Section</h2>
          <ul>
            {Array.from({ length: 100 }, (_, i) => (
              <li key={i} className="py-1 border-b">
                Item {i + 1}
              </li>
            ))}
          </ul>
        </div>

        {/* Detail Section */}
        <div className="flex-grow bg-gray-300 p-4">
          <h2 className="text-lg font-bold mb-2">Detail Section</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
            id ligula porta felis euismod semper. Fusce dapibus, tellus ac
            cursus commodo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IconFamilyV1;
