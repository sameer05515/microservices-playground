import React, { useState } from 'react';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';

const withCollapse = (WrappedComponent) => {
  return ({ headerText='No header set', children, ...props }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleCollapse = () => {
      setIsCollapsed(!isCollapsed);
    };

    return (
      <div>
        <div onClick={toggleCollapse} style={{ cursor: 'pointer' }}>
          {isCollapsed ? <FaAngleRight /> : <FaAngleDown />}
          <span>{headerText}</span>
        </div>
        {!isCollapsed && <WrappedComponent {...props} >{children}</WrappedComponent>}
      </div>
    );
  };
};

export default withCollapse;
