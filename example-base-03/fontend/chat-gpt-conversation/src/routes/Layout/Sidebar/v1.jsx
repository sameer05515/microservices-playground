import React, { useState, useCallback, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedModuleName } from "../../../store/v2/application-states/actions";
// import styles from "./styles.module.css"; // Custom animations/styles

const HorizontalMenuV1 = ({ isAuthenticated = false, handleLogout = () => {} }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const dispatch = useDispatch();

  //   const isPathActive = (path) => {
  //     const currentPath = window.location.pathname;
  //     return currentPath === path || currentPath.startsWith(path);
  //   };

  const links = [
    { linkHeader: "Apna Playground", linkPath: () => "/apna-playground", isModule: true },
    { linkHeader: "Resume Management", linkPath: () => "/resume", isModule: true },
    { linkHeader: "CGPT Dashboard", linkPath: () => "/cgpt", isModule: true },
    { linkHeader: "Settings", linkPath: () => "/settings", isModule: true },
  ];

  const handleLinkClick = useCallback((linkHeader = "") => {
    dispatch(setSelectedModuleName({ moduleName: linkHeader }));
    setIsCollapsed(true);
  }, [dispatch]);

  return (
    <div className="mb-6">
      <CollapsibleMenu isCollapsed={isCollapsed}>
        <ul className="bg-gray-800 text-white rounded-md shadow-lg p-2 space-y-2">
          {links
            .filter((l) => l.isModule)
            .map(({ linkPath, linkHeader }, idx) => (
              <li key={`linkPath_${idx}`} className="group">
                <NavLink
                  to={linkPath()}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-yellow-500 text-gray-900"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`
                  }
                  onClick={() => handleLinkClick(linkHeader)}
                >
                  {linkHeader}
                </NavLink>
              </li>
            ))}
          {isAuthenticated && (
            <li className="mt-2">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-md hover:bg-red-700 focus:ring focus:ring-red-400"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </CollapsibleMenu>
    </div>
  );
};

const CollapsibleMenu = ({ isCollapsed: isCollapsedInitialValue = true, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(isCollapsedInitialValue);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsCollapsed(true);
    }
  };

  useEffect(() => {
    setIsCollapsed(isCollapsedInitialValue);
  }, [isCollapsedInitialValue]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className={`fixed top-0 left-0 h-screen z-50 bg-gray-900 transition-all duration-300 ${
        isCollapsed ? "w-12" : "w-64"
      }`}
    >
      <button
        className="absolute top-2 right-2 p-1 bg-transparent text-white text-xs focus:outline-none"
        onClick={toggleMenu}
      >
        {isCollapsed ? ">>" : "<<"}
      </button>
      {!isCollapsed && <div className="mt-10 p-2">{children}</div>}
    </div>
  );
};

export default HorizontalMenuV1;
