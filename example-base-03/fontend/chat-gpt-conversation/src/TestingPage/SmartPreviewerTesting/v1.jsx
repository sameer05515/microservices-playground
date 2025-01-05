import React, { useCallback } from "react";
import SmartPreviewer from "../../common/components/SmartPreviewer/v1";
import useSPPNavigation from "../../common/hooks/useSPPNavigation";
import { data, getNextIndex } from "./utils";

const SmartPreviewerTestingV1 = () => {
  const { searchParams, goToTestingRoute } = useSPPNavigation();
  const selectedIndex = searchParams.get("selectedIndex");
  const selectedData = data[selectedIndex || 0] || {};

  const handleNavigate = useCallback(
    (index) => {
      goToTestingRoute({
        search: {
          tester: "SmartPreviewerTestingV1",
          selectedIndex: getNextIndex(index),
        },
      });
    },
    [goToTestingRoute]
  );

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          SmartPreviewer Testing V1: Output Type: {selectedData.textOutputType || "UNKNOWN"}
        </h1>
        <div className="flex items-center justify-center gap-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => handleNavigate(+selectedIndex)}
          >
            Next
          </button>
          <span className="text-lg font-medium">Selected Index: {selectedIndex}</span>
        </div>
      </div>

      <SmartPreviewer data={selectedData} />
    </div>
  );
};

export default SmartPreviewerTestingV1;
