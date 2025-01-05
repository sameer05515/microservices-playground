import React, { useCallback } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getIcon } from "../../../common/utils/IconCollection";
import { setSelectedModuleName } from "../../../store/v2/application-states/actions";
import { links } from "./utils";
import useThemeManager from "../../../common/hooks/useThemeManager";
import { selectApplicationStateIsDarkModeActive } from "../../../store/v2/selectors";

const SidebarV3 = () => {
  const dispatch = useDispatch();
  const { toggleTheme } = useThemeManager();
  const isDarkMode = useSelector(selectApplicationStateIsDarkModeActive);

  // Determine view mode label and icon dynamically
  const viewModeLabel = `Switch to ${isDarkMode ? "light" : "dark"} mode`;
  const ViewModeIcon = isDarkMode ? FiSun : FiMoon;

  const handleLinkClick = useCallback(
    (linkHeader = "") => {
      dispatch(setSelectedModuleName({ moduleName: linkHeader }));
    },
    [dispatch]
  );

  const toggleMode = () => {
    toggleTheme();
  };

  return (
    <div className="fixed top-0 left-0 h-full w-8 bg-gray-900 text-white z-50 transition-all duration-300 flex flex-col space-y-2">
      <div className="mt-4 flex flex-col items-center space-y-2">
        {links.map((link) => (
          <ModuleLink key={link.id} link={link} onLinkClick={handleLinkClick} />
        ))}
        <button
          onClick={toggleMode}
          className="relative flex flex-col items-center justify-center group w-full h-12 hover:bg-gray-800 transition"
          aria-label={viewModeLabel}
        >
          <ViewModeIcon className="text-lg group-hover:text-yellow-400 transition-transform duration-200 transform group-hover:scale-110" />
          <span className="absolute left-6 bg-gray-800 text-white px-2 py-1 rounded-md text-xs font-medium shadow-md opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-200">
            {viewModeLabel}
          </span>
        </button>
      </div>
    </div>
  );
};

const ModuleLink = ({ link, onLinkClick }) => {
  const { linkPath, linkHeader, icon } = link;
  const IconComponent = getIcon(icon);

  return (
    <NavLink
      to={linkPath()}
      className={({ isActive }) =>
        `relative flex flex-col items-center justify-center group w-full h-12 ${
          isActive ? "bg-gray-800" : "hover:bg-gray-800"
        } transition`
      }
      onClick={() => onLinkClick(linkHeader)}
      aria-label={linkHeader}
    >
      <IconComponent className="text-lg group-hover:text-yellow-400 transition-transform duration-200 transform group-hover:scale-110" />
      <span className="absolute left-6 bg-gray-800 text-white px-2 py-1 rounded-md text-xs font-medium shadow-md opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-200">
        {linkHeader}
      </span>
    </NavLink>
  );
};

export default SidebarV3;
