import React, { createContext, useContext, useState } from "react";

// Initial shared data
const initialSharedData = {
  selectedNode: null,
};

// Create a context for shared configurations and data
const SharedConfigurationsContext = createContext();

// Create a provider component
const SharedConfigurationsProvider = ({ children }) => {
  const [sharedData, setSharedData] = useState(initialSharedData);

  const setSelectedNode = (selectedNode) => {
    setSharedData((prev) => ({ ...prev, selectedNode }));
  };

  const SharedService = {
    setSelectedNode,
  };

  return (
    <SharedConfigurationsContext.Provider value={{ sharedData, SharedService }}>
      {children}
    </SharedConfigurationsContext.Provider>
  );
};

// Custom hook to use shared configurations and data
const useSharedConfigurations = () => useContext(SharedConfigurationsContext);

export { SharedConfigurationsProvider, useSharedConfigurations };
