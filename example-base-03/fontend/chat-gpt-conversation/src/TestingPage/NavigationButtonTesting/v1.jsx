import React from "react";
import { FaSearch, FaSync } from "react-icons/fa";

const NavigationV1 = () => {
  return (
    <div className="flex justify-end items-center gap-1 p-4">
      <span className="hover:text-blue-500 cursor-pointer">Prev</span>
      <span className="hover:text-blue-500 cursor-pointer">Next</span>
    </div>
  );
};

const NavigationV2 = () => {
  return (
    <div className="flex justify-end items-center gap-1 p-4">
      <span className="text-blue-600 dark:text-cyan-300 hover:underline cursor-pointer">Prevvv</span>
      <span className="text-blue-600 dark:text-cyan-300 hover:underline cursor-pointer">Nexttt</span>
    </div>
  );
};

/**
 * 
 * Selected style to be used in [HeaderV1.jsx](../ConsolidatedReport/Header/v1.jsx)
 * 
 * */
const NavigationV3 = () => {
  return (
    <div className="flex justify-end items-center gap-4 p-4">
      <span
        title="Prevvv NavigationV3"
        className="text-blue-600 dark:text-cyan-300 hover:underline cursor-pointer"
      >
        <FaSync />
      </span>
      <span
        title="Nexttt NavigationV3"
        className="text-blue-600 dark:text-cyan-300 hover:underline cursor-pointer"
      >
        <FaSearch />
      </span>
    </div>
  );
};

function NavigationButtonTesting() {
  return (
    <div className="min-h-screen">
      {/* Other content */}
      <NavigationV1 />
      <NavigationV2 />
      <NavigationV3 />
    </div>
  );
}

export default NavigationButtonTesting;
