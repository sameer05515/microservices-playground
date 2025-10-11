import React, { useEffect, useState, memo, useCallback } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";

const CustomCollapse = memo(({
  headerText = "No header set",
  style = {},
  initiallyCollapsed = false,
  collapseAll = false,
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(initiallyCollapsed);
  
  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);
  useEffect(() => {
    setIsCollapsed((prev) => collapseAll);
  }, [collapseAll]);
  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded shadow-sm mb-2">
      {/* {`collapseAll : ${collapseAll}, isCollapsed: ${isCollapsed}, (collapseAll || prev) : ${
        collapseAll || isCollapsed
      }`} */}
      <div 
        onClick={toggleCollapse} 
        className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {isCollapsed ? (
          <FaAngleRight className="mr-2 text-gray-600 dark:text-gray-400" />
        ) : (
          <FaAngleDown className="mr-2 text-gray-600 dark:text-gray-400" />
        )}
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{headerText}</span>
      </div>
      {!isCollapsed && (
        <div className="border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
          <div style={{ ...style }}>{children}</div>
        </div>
      )}
    </div>
  );
});

CustomCollapse.displayName = "CustomCollapse";

export default CustomCollapse;
