import React from 'react';

const FlexContainer = ({ isHorizontal = false, customStyle = {}, children }) => {
    return (
        <div
            style={{
                width: '100%',
                height:'100%',                
                ...customStyle,
                display: 'flex',
                flexDirection: isHorizontal ? 'row' : 'column',
            }}
        >
            {children}
        </div>
    );
};

const FlexItem = ({ flex = 1, customStyle = {}, children }) => {
    return (
        <div
            style={{
                flex: Number.isInteger(flex) && flex > 0 ? flex : 1,
                ...customStyle,
            }}
        >
            {children}
        </div>
    );
};

export default FlexContainer;
export { FlexItem };
