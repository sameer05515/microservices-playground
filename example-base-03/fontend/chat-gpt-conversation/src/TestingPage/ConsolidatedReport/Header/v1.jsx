import React, { useMemo } from "react";
import { useConsolidatedReportContext } from "../context/v1";
import { FaSearch, FaSync } from "react-icons/fa";
import ItemNavigation from "../Right/ItemNavigation/v1";
import { IoMdClose as CloseSidebar } from "react-icons/io";
import { GiHamburgerMenu as OpenSidebar } from "react-icons/gi";

const Header = ({ className }) => {
  const { triggerReload, reloadSectionData, handleSidebarClick, isSidebarClosed } =
    useConsolidatedReportContext();

  const { SideBarActionIcon, sideBarActionTitle } = useMemo(
    () => ({
      SideBarActionIcon: !isSidebarClosed ? OpenSidebar : CloseSidebar,
      sideBarActionTitle: !isSidebarClosed ? "Open Sidebar" : "Close Sidebar",
    }),
    [isSidebarClosed]
  );

  return (
    <div className={`${className} font-normal mb-2 gap-4 text-gray-800 dark:text-gray-100`}>
      <div className="flex-[1_1_0%] flex justify-end items-center gap-4">
        {!reloadSectionData && (
          <span
            className="text-blue-600 dark:text-cyan-300 hover:underline cursor-pointer"
            title="Reload"
            onClick={triggerReload}
          >
            <FaSync />
          </span>
        )}
        <span className="text-blue-600 dark:text-cyan-300 hover:underline cursor-pointer" title="Search">
          <FaSearch />
        </span>
        <span
          onClick={handleSidebarClick}
          className="text-blue-600 dark:text-cyan-300 hover:underline cursor-pointer"
          title={sideBarActionTitle}
        >
          {<SideBarActionIcon />}
        </span>
        <span></span>
      </div>
      <div className="flex-[3_1_0%] overflow-y-auto">
        <ItemNavigation />
      </div>
    </div>
  );
};

export default Header;
