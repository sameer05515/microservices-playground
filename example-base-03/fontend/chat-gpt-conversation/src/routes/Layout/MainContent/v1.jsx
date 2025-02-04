import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectApplicationStateIsDarkModeActive } from "../../../store/v2/selectors";
import { toggleViewMode } from "../../../store/v2/application-states/actions";
import GlobalBreadcrumbV2 from "./GlobalBreadcrumb/v2";

const MainContentV1 = () => {
    const dispatch = useDispatch();
    const isDarkMode = useSelector(selectApplicationStateIsDarkModeActive);
  
    const toggleMode = () => {
      dispatch(toggleViewMode());
    };
    return (
      <div className="flex-grow relative">
        {/* Top Section: Breadcrumb and Dark Mode Toggle */}
        <header className="px-6 py-4 border-b border-gray-300 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <button
              onClick={toggleMode}
              className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
            >
              {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
            <GlobalBreadcrumbV2 />
          </div>
        </header>
  
        {/* Main Content Section */}
        <main className="p-6">
          <Outlet /> {/* Render the child routes */}
        </main>
      </div>
    );
  };

export default MainContentV1