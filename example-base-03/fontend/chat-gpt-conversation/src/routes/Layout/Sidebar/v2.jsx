import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSidebarCollapsed,
  setSidebarExpanded,
  setSelectedModuleName,
} from "../../../store/v2/application-states/actions";
import { selectApplicationStateIsSidebarCollapsed } from "../../../store/v2/selectors";
import { getIcon, links, CollapsedIcon, ExpandedIcon } from "./utils";
import { NavLink } from "react-router-dom";

const SidebarV2 = () => {
  const isCollapsed = useSelector(selectApplicationStateIsSidebarCollapsed);
  const dispatch = useDispatch();

  const handleSidebarButtonClick = () => {
    if (isCollapsed) {
      dispatch(setSidebarExpanded());
    } else {
      dispatch(setSidebarCollapsed());
    }
  };

  const handleLinkClick = useCallback(
    (linkHeader = "") => {
      dispatch(setSelectedModuleName({ moduleName: linkHeader }));
    },
    [dispatch]
  );

  return (
    <div
      className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 ${
        isCollapsed ? "w-16 bg-gray-900" : "w-64 bg-gray-900 bg-opacity-75"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className="flex justify-center items-center h-16">
          <button
            className="p-4 text-white focus:outline-none"
            onClick={handleSidebarButtonClick}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <CollapsedIcon className="text-2xl text-yellow-400 hover:text-yellow-500 transition-transform duration-200 ease-in-out transform hover:scale-110" />
            ) : (
              <ExpandedIcon className="text-2xl text-yellow-400 hover:text-yellow-500 transition-transform duration-200 ease-in-out transform hover:scale-110" />
            )}
          </button>
        </div>

        {/* Links */}
        <div className="mt-4 space-y-2">
          {links.map((link) => (
            <ModuleLink key={link.id} link={link} onLinkClick={handleLinkClick} isCollapsed={isCollapsed} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ModuleLink = ({ link, onLinkClick, isCollapsed }) => {
  const { linkPath, linkHeader, icon } = link;
  const IconComponent = getIcon(icon);

  return (
    <NavLink
      to={linkPath()}
      className={({ isActive }) =>
        `flex items-center px-4 py-2 rounded-md text-sm font-medium ${
          isActive ? "bg-yellow-500 text-gray-900" : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`
      }
      onClick={() => onLinkClick(linkHeader)}
      aria-label={linkHeader}
    >
      <IconComponent className="mr-2" size={18} />
      {!isCollapsed && (
        <span className="transition-opacity duration-200 ease-in-out opacity-100">{linkHeader}</span>
      )}
    </NavLink>
  );
};

export default SidebarV2;
