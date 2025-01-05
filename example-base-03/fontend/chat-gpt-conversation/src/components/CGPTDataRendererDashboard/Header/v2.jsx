import React from "react";
import { AiOutlineFolder, AiOutlineFolderOpen } from "react-icons/ai";
import { FiChevronDown, FiChevronUp, FiSearch, FiX } from "react-icons/fi";
import { usePragyamContext } from "../PragyamContext";

const HeaderV2 = () => {
  const { uiState, toggleState } = usePragyamContext();

  return (
    <div className="flex items-center justify-between space-x-4 px-4 py-0 bg-gray-100 dark:bg-gray-800 shadow-md">
      <div className="flex px-4 py-0 space-x-8">
        {/* Search Section Toggle */}
        <button
          //   title={`${uiState.showSearchSection ? "Hide " : "Show "} Search Section`}
          onClick={() => toggleState("showSearchSection")}
          className="group relative flex items-center justify-center px-1 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          {uiState.showSearchSection ? <FiX size={10}/> : <FiSearch size={10} />}
          <span className="absolute bottom-full mb-1 hidden group-hover:inline-block text-xs bg-gray-700 text-white rounded px-2 py-1">
            {uiState.showSearchSection ? "Hide Search Section" : "Show Search Section"}
          </span>
        </button>

        {/* JSON File Selector Toggle */}
        <button
          //   title={`${uiState.showFileSelectorModal ? "Hide " : "Show "} JSON File Selector`}
          onClick={() => toggleState("showFileSelectorModal")}
          className="group relative flex items-center justify-center px-1 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
        >
          {uiState.showFileSelectorModal ? <AiOutlineFolderOpen /> : <AiOutlineFolder />}
          <span className="absolute bottom-full mb-1 hidden group-hover:inline-block text-xs bg-gray-700 text-white rounded px-2 py-1">
            {uiState.showFileSelectorModal ? "Hide JSON File Selector" : "Show JSON File Selector"}
          </span>
        </button>

        {/* Conversations List Toggle */}
        <button
          //   title={`${uiState.showSideBar ? "Hide " : "Show "} Conversations List`}
          onClick={() => toggleState("showSideBar")}
          className="group relative flex items-center justify-center px-1 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
        >
          {uiState.showSideBar ? <FiChevronDown /> : <FiChevronUp />}
          <span className="absolute bottom-full mb-1 hidden group-hover:inline-block text-xs bg-gray-700 text-white rounded px-2 py-1">
            {uiState.showSideBar ? "Hide Conversations List" : "Show Conversations List"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default HeaderV2;
