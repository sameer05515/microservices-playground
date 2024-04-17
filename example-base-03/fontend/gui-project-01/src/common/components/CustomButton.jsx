import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconComponent from './IconComponent';

const buttonStyle = {
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  padding: '5px',
  borderRadius: '5px',
  cursor: 'pointer',
  display: 'inline-flex', // Adjusted display property
  alignItems: 'center',
};

const buttonHoverStyle = {
  backgroundColor: '#0056b3',
};

const iconStyle = {
  marginRight: '5px',
};

const textStyle = {
  marginLeft: '5px',
};

const CustomButton = ({ children, iconName, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      style={{ ...buttonStyle, ...(isHovered && buttonHoverStyle) }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {iconName && <span style={iconStyle}><IconComponent iconName={iconName} /></span>}
      {children && <span style={textStyle}>{children}</span>}
    </button>
  );
};

CustomButton.propTypes = {
  children: PropTypes.node,
  iconName: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default CustomButton;
