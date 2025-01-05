import React, { useCallback, useState } from "react";
import { usePragyamContext } from "../PragyamContext";
import SearchResultRenderer from "../SearchResultRenderer/v2";
import { useDispatch } from "react-redux";
import { hideBackdropV3, showBackdropV3 } from "../../../store/v2/backdrop/actions";
import { getFilteredDataForSearchQuery } from "../SearchUtils-v2";

const SearchSectionV2 = () => {
  const dispatch = useDispatch();
  const { jsonData, uiState, toggleState } = usePragyamContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handlers
  const handleSearch = useCallback(
    async (query) => {
      try {
        console.log("Starting search..");
        dispatch(showBackdropV3({title:"Starting search.."}));
        const { data, isError, message } = await getFilteredDataForSearchQuery(jsonData, query);
        if (!isError) {
          setFilteredData(data);
        } else {
          console.error(message);
        }
      } catch (error) {
        console.log("Error", error);
      } finally {
        dispatch(hideBackdropV3());
        console.log("Search completed!");
      }
    },
    [dispatch, jsonData]
  );

  return (
    <div className="rounded shadow-md">
      {uiState.showSearchSection && (
        <div className="space-y-4">
          {/* Collapse/Expand Button */}
          {filteredData?.length > 0 && (
            <button
              onClick={() => toggleState("collapseAll")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              {uiState.collapseAll ? "Expand " : "Collapse "} All Results
            </button>
          )}

          {/* Search Input and Button */}
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={() => handleSearch(searchQuery)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
            >
              Search
            </button>
          </div>
        </div>
      )}

      {/* Render Search Results */}
      {uiState.showSearchSection && filteredData.length > 0 && (
        <div className="mt-4">
          <SearchResultRenderer />
        </div>
      )}
    </div>
  );
};

export default SearchSectionV2;
