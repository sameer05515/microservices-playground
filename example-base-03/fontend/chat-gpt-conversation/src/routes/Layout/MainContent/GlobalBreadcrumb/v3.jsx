import { useSelector } from "react-redux";
import { FiSun, FiMoon } from "react-icons/fi";
import {
  selectApplicationStateIsDarkModeActive,
  selectApplicationStateSelectedModuleName,
} from "../../../../store/v2/selectors";
import useThemeManager from "../../../../common/hooks/useThemeManager";

const GlobalBreadcrumbV3 = () => {
  const moduleName = useSelector(selectApplicationStateSelectedModuleName);
  const { toggleTheme } = useThemeManager();
  const isDarkMode = useSelector(selectApplicationStateIsDarkModeActive);

  const toggleMode = () => {
    toggleTheme();
  };

  return (
    <div className="flex justify-between items-center px-4 py-0 rounded-md shadow-sm">
      <div className="text-sm text-gray-600 dark:text-gray-300">
        <span className="font-semibold text-gray-800 dark:text-gray-100">Current Module:</span>{" "}
        {moduleName || <span className="italic text-gray-500">None</span>}
      </div>
      <button
        onClick={toggleMode}
        className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white dark:bg-gray-700 dark:text-gray-300 hover:bg-blue-600 dark:hover:bg-gray-600 transition"
        aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      >
        {isDarkMode ? <FiSun size={10} /> : <FiMoon size={10} />}
      </button>
    </div>
  );
};

export default GlobalBreadcrumbV3;
