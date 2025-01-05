import React, { useEffect, useState } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";

const CustomCollapse = ({
  headerText = "No header set",
  style = {},
  initiallyCollapsed = false,
  collapseAll = false,
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(initiallyCollapsed);
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  useEffect(() => {
    setIsCollapsed((prev) => collapseAll);
  }, [collapseAll]);
  return (
    <div>
      {/* {`collapseAll : ${collapseAll}, isCollapsed: ${isCollapsed}, (collapseAll || prev) : ${
        collapseAll || isCollapsed
      }`} */}
      <div onClick={toggleCollapse} style={{ cursor: "pointer" }}>
        {isCollapsed ? <FaAngleRight /> : <FaAngleDown />}
        <span>{headerText}</span>
      </div>
      {!isCollapsed && <div style={{ ...style }}>{children}</div>}
    </div>
  );
};

export default CustomCollapse;
