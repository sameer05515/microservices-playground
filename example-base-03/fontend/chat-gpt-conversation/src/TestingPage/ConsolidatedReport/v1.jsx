import React from "react";
import { ConsolidatedReportContextProvider, useConsolidatedReportContext } from "./context/v1";
import Header from "./Header/v1";
import Left from "./Left/v1";
import Right from "./Right/v1";

const ConsolidatedReportV1 = () => {
  const { isSidebarClosed } = useConsolidatedReportContext();
  return (
    <div className="flex flex-col w-full text-wrap break-word p-2 max-h-[85vh] overflow-y-auto">
      <Header className="flex flex-row" />
      <div className="flex flex-row w-full text-wrap break-word overflow-y-auto">
        {isSidebarClosed && <Left className="flex-[1_1_0%] overflow-y-auto" />}
        <Right className="flex-[3_1_0%] overflow-y-auto" />
      </div>
    </div>
  );
};

const withContext = () => {
  return (
    <ConsolidatedReportContextProvider>
      <ConsolidatedReportV1 />
    </ConsolidatedReportContextProvider>
  );
};

export default withContext;
