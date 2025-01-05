import { Outlet } from "react-router-dom";
import GlobalBreadcrumbV2 from "./GlobalBreadcrumb/v3";

const MainContentV2 = () => {
  return (
    <div className="flex-grow relative ml-12">
      {/* Left margin for sidebar */}
      <header className="px-1 py-1">
        <GlobalBreadcrumbV2 />
      </header>
      <main className="p-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MainContentV2;
