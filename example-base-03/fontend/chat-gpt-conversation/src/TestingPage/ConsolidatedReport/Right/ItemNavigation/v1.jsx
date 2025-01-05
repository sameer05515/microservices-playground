import React from "react";
import { useConsolidatedReportContext } from "../../context/v1";
import { AiFillForward as NextIcon, AiFillBackward as PrevIcon } from "react-icons/ai";

const ItemNavigation = () => {
    const {
      handleSectionItemSelection: handleNavigation,
      selectedSectionItemNavigation: { prevId, nextId },
    } = useConsolidatedReportContext();
    if (!prevId && !nextId) {
      return null;
    }
    return (
      <div className="w-full flex justify-between items-center font-bold text-xs text-gray-800 dark:text-sky-300 mb-0">
        {/* Navigation Buttons */}
        <span className="mr-3 flex-[5_1_0%] text-left font-medium">
          PARENT BREADBRUMB - <span className="font-extrabold text-red-500">TBD</span>
        </span>
        <span
          title="Previous Section Item"
          onClick={() => handleNavigation(prevId)}
          className="flex-[1_1_0%] text-left text-blue-600 dark:text-cyan-300 hover:underline flex items-center cursor-pointer"
        >
          <PrevIcon className="mr-3" />
          <span>Prev</span>
        </span>
  
        <span
          title="Next Section Item"
          onClick={() => handleNavigation(nextId)}
          className="flex-[1_1_0%] text-right text-blue-600 dark:text-cyan-300 hover:underline flex items-center cursor-pointer justify-end"
        >
          <span>Next</span>
          <NextIcon className="ml-3" />
        </span>
      </div>
    );
  };

export default ItemNavigation