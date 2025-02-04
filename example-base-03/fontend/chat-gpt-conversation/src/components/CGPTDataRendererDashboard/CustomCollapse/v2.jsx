import React, { useEffect, useState } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";

const CustomCollapse = ({
  headerText = "No header set",
  initiallyCollapsed = false,
  collapseAll = false,
  children,
  additionalStyle={}
}) => {
  const [isCollapsed, setIsCollapsed] = useState(initiallyCollapsed);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    setIsCollapsed(() => collapseAll);
  }, [collapseAll]);

  return (
    <div className="border border-gray-300 rounded shadow-sm mb-0">
      {/* Header Section */}
      <div
        onClick={toggleCollapse}
        className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 transition-all"
      >
        {isCollapsed ? (
          <FaAngleRight className="mr-2 text-gray-600" />
        ) : (
          <FaAngleDown className="mr-2 text-gray-600" />
        )}
        <span className="text-sm font-medium text-gray-800">{headerText}</span>
      </div>

      {/* Collapsible Content */}
      <div
        className={`max-h-[74vh] max-w-[77vw] overflow-y-auto`}
      >
        <div className="border-t border-gray-200 bg-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CustomCollapse;
