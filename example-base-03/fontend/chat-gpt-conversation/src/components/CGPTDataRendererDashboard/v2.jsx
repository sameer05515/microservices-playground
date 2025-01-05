import React from "react";
import ConversationCard from "./ConversationCard/v2";
import ConvNamesListSectionV2 from "./ConvNamesListSection/v2";
import { PragyamContextProvider, usePragyamContext } from "./PragyamContext";
import SearchSectionV2 from "./Search/v2";
import Header from "./Header/v2";
import { FSWithModal } from "./JSONFileSelector/v2";

/**Main Dashboard component*/
const PragyamDashboardV2 = () => {
  const { uiState, toggleState } = usePragyamContext();

  return (
    <div className={`min-h-fit`}>
      <Header />
      <div className="flex flex-col lg:flex-row mt-1">
        {/* Left Sidebar */}
        <div className="lg:flex-1 shadow rounded-md">
          <ConvNamesListSectionV2 />
        </div>
        {/* Main Content */}
        <div className="lg:flex-wrap shadow rounded-md">
          <SearchSectionV2 />
          <ConversationCard />
        </div>
      </div>
      {/* File Selector Modal */}
      <FSWithModal
        isOpen={uiState.showFileSelectorModal}
        showCloseButton
        onClose={() => toggleState("showFileSelectorModal")}
      />
    </div>
  );
};

const withContext = () => {
  return (
    <PragyamContextProvider>
      <PragyamDashboardV2 />
    </PragyamContextProvider>
  );
};

export default withContext;
