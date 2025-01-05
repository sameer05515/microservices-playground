import React, { useState } from 'react';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';

const CustomCollapse = ({ headerText = 'No header set', initiallyCollapsed=true, style = {}, children, showBoldTitle=false }) => {

    const [isCollapsed, setIsCollapsed] = useState(initiallyCollapsed);
    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };
    return (
        <div>
            <div onClick={toggleCollapse} style={{ cursor: 'pointer', fontWeight: showBoldTitle? 'bold':'' }}>
                {isCollapsed ? <FaAngleRight /> : <FaAngleDown />}
                <span>{headerText}</span>
            </div>
            {!isCollapsed && <div style={{ ...style }}>{children}</div>}
        </div>
    )
}

export default CustomCollapse;