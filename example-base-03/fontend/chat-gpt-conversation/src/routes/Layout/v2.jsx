import { useSelector } from "react-redux";
import { selectApplicationStateIsDarkModeActive } from "../../store/v2/selectors";
import Sidebar from "./Sidebar/v2"; // Sidebar component
import MainContent from "./MainContent/v1";

/**
 * LayoutV2
 *
 * This is an enhanced version of `LayoutV1`, incorporating significant improvements 
 * for better structure, user experience, and maintainability. The main focus of this 
 * version is the development and integration of the new [`SidebarV2`](./Sidebar/v2.jsx) 
 * component.
 *
 * ## Key Enhancements
 *
 * ### 1. Sidebar's Collapse and Expand State
 * - The collapse and expand functionality of the sidebar is now fully managed using 
 *   a Redux-based state management approach.
 * - This centralizes the state, making it easier to share, control, and debug across 
 *   the application.
 *
 * ### 2. Module Links with Icons
 * - Each module link in the sidebar now features an associated icon for better visual 
 *   representation and quick identification.
 * - Icons are customizable and are fetched dynamically using a utility function for 
 *   maintainability and flexibility.
 *
 * ### 3. Semi-Transparent Background
 * - When the sidebar is in an expanded state, it features a semi-transparent background 
 *   to create a sleek and modern UI design.
 * - This enhancement ensures the main content remains visually accessible, even when 
 *   the sidebar is expanded.
 *
 * ## Additional Notes
 * - The `SidebarV2` component is modular, with the complexity of rendering links 
 *   abstracted into a `ModuleLink` component. This ensures reusability and cleaner 
 *   code organization.
 * - Transition effects and hover styles have been added to the sidebar's toggle button 
 *   and module links for a better user experience.
 * - Breadcrumbs and main content are properly aligned and remain accessible in all 
 *   sidebar states.
 *
 * ## File Dependencies
 * - [`SidebarV2`](./Sidebar/v2.jsx): The primary sidebar component that drives the 
 *   new layout structure and behavior.
 * - [`utils`](./utils.js): Utility functions for fetching icons and managing sidebar links.
 *
 * ## Usage
 * ```jsx
 * import LayoutV2 from './LayoutV2';
 * 
 * const App = () => (
 *   <BrowserRouter>
 *     <LayoutV2>
 *       <Routes>
 *         <Route path="/" element={<HomePage />} />
 *         <Route path="/settings" element={<SettingsPage />} />
 *       </Routes>
 *     </LayoutV2>
 *   </BrowserRouter>
 * );
 * ```
 *
 * ## Future Scope
 * - Introduce user-specific customizations, such as saving the last sidebar state 
 *   (collapsed/expanded) for returning users.
 * - Add accessibility features to improve navigation for keyboard and screen-reader users.
 * - Consider responsive design refinements to adapt the layout for smaller screens.
 */

const LayoutV2 = () => {
  const isDarkMode = useSelector(selectApplicationStateIsDarkModeActive);
  return (
    <div
      className={`min-h-screen flex ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <MainContent />
    </div>
  );
};

export default LayoutV2;
