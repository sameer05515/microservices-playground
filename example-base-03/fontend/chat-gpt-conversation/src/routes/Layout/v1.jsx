import { Outlet } from "react-router-dom";
// import GlobalBreadcrumbV2 from "../GlobalBreadcrumb/v2";
import { useDispatch, useSelector } from "react-redux";
import { toggleViewMode } from "../../store/v2/application-states/actions";
import {
  selectApplicationStateIsDarkModeActive,
  selectApplicationStateSelectedModuleName,
} from "../../store/v2/selectors";
import HorizontalMenu from "./Sidebar/v1";

const LayoutV1 = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector(selectApplicationStateIsDarkModeActive);

  const toggleMode = () => {
    dispatch(toggleViewMode());
  };
  return (
    <>
      <div
        style={{
          backgroundColor: isDarkMode ? "black" : "white",
          color: isDarkMode ? "white" : "black",
        }}
      >
        <HorizontalMenu />
        <div>
          <button onClick={() => toggleMode()}>{isDarkMode ? "Dark Mode" : "Lite Mode"}</button>
          <GlobalBreadcrumbV2 />
        </div>
        <div>
          <Outlet /> {/* Render the child routes */}
        </div>
      </div>
    </>
  );
};

const GlobalBreadcrumbV2 = () => {
  const moduleName = useSelector(selectApplicationStateSelectedModuleName);
  return <div>Current Module : {moduleName}</div>;
};

export default LayoutV1;
