import React from "react";
import PropTypes from "prop-types";
import {
  FaQuestion,
  FaHome,
  FaSearch,
  FaCog,
  FaUser,
  FaSave,
  FaPlus,
  FaEdit
} from "react-icons/fa"; // Import default icon
import { IoIosRefresh } from "react-icons/io";

const IconComponent = ({ iconName }) => {
  // Define a mapping of icon names to corresponding icon components
  const iconMap = {
    // Add more icons here as needed
    'FaHome': FaHome,
    'FaSearch': FaSearch,
    'FaSettings': FaCog,
    'FaUser': FaUser,
    'FaSave': FaSave,
    'FaPlus': FaPlus,
    'IoIosRefresh': IoIosRefresh,
    'FaEdit': FaEdit
    // Add more icons above as needed
  };

  // Check if the requested iconName exists in the iconMap
  const Icon = iconMap[iconName] || FaQuestion; // Default to FaQuestion if not found

  return <Icon />;
};

IconComponent.propTypes = {
  iconName: PropTypes.string.isRequired,
};

export default IconComponent;
