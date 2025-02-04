import React from "react";
import { useSelector } from "react-redux";
import { selectApplicationStateSelectedModuleName } from "../../../../store/v2/selectors";

const GlobalBreadcrumbV2 = () => {
  const moduleName = useSelector(selectApplicationStateSelectedModuleName);

  return (
    <div className="text-sm text-gray-500 dark:text-gray-400">
      <span className="font-semibold">Current Module:</span> {moduleName || "None"}
    </div>
  );
};

export default GlobalBreadcrumbV2;
