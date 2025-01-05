import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import ChatGPTConversationRenderer from "./sub-components/AIConversationRenderer";
import Sidebar from "./common/components/Sidebar";
import ConversationCard from "./sub-components/ConversationCard";
import {
  formatUnixTimestamp,
  getConversationMessages,
  localSessionManager,
} from "./common/utils/UtilityMethods";
import { LATEST_CONVERSATION_FILE } from "./common/utils/constants";

// Lazy-loaded components
const Search = lazy(() => import("./common/components/Search"));
const ConversationFileSelector = lazy(() =>
  import("./common/components/ConversationFileSelector")
);

// Utility function for fetching data
const fetchJsonData = async (selectedFile, setJsonData) => {
  if (!selectedFile) return;
  try {
    const response = await fetch(selectedFile);
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();

    // Transform the data
    const formattedData = data.map((conv, index) => ({
      id: `conv_${index + 1}`,
      title: conv.title,
      messages: getConversationMessages(conv) || [],
      createdOn: conv.create_time ? formatUnixTimestamp(conv.create_time) : null,
      updatedOn: conv.update_time ? formatUnixTimestamp(conv.update_time) : null,
    }));

    setJsonData(formattedData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Main Dashboard component
const Dashboard = () => {
  const [jsonData, setJsonData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const { setItemForKey, getItemForKey, KEYS } = localSessionManager();

  const [uiState, setUiState] = useState({
    showSearchSection: false,
    showSideBar: true,
    collapseAll: true,
  });
  const [selectedFile, setSelectedFile] = useState(LATEST_CONVERSATION_FILE);

  // Handlers
  const handleSearch = useCallback(
    (query) => {
      if (!query.trim()) {
        setFilteredData([]);
        return;
      }
      const lowerQuery = query.toLowerCase();
      setFilteredData(
        jsonData.filter(
          ({ title, messages }) =>
            title.toLowerCase().includes(lowerQuery) ||
            messages.some((msg) => msg.text.toLowerCase().includes(lowerQuery))
        )
      );
    },
    [jsonData]
  );

  const handleSelect = useCallback(
    (item) => {
      const selConv = jsonData.find((c) => c.id === item?.id);
      setSelectedConv(selConv);
      if (selConv) setItemForKey(KEYS.selectedConversationId, selConv.id);
    },
    [jsonData, setItemForKey, KEYS.selectedConversationId]
  );

  const handleNext = useCallback(
    (id) => {
      const nextIndex = (jsonData.findIndex((c) => c.id === id) + 1) % jsonData.length;
      const nextConv = jsonData[nextIndex];
      setSelectedConv(nextConv);
      setItemForKey(KEYS.selectedConversationId, nextConv.id);
    },
    [jsonData, setItemForKey, KEYS.selectedConversationId]
  );

  const handlePrev = useCallback(
    (id) => {
      const prevIndex = (jsonData.findIndex((c) => c.id === id) - 1 + jsonData.length) % jsonData.length;
      const prevConv = jsonData[prevIndex];
      setSelectedConv(prevConv);
      setItemForKey(KEYS.selectedConversationId, prevConv.id);
    },
    [jsonData, setItemForKey, KEYS.selectedConversationId]
  );

  // Fetch data whenever the file changes
  useEffect(() => {
    fetchJsonData(selectedFile, setJsonData);
  }, [selectedFile]);

  // Handle initial setup when data is loaded
  useEffect(() => {
    if (jsonData.length > 0) {
      const lastValue = getItemForKey(KEYS.listVisible);
      if (lastValue != null) {
        setUiState((prev) => ({ ...prev, showSideBar: lastValue }));
      }
      const selectedConversationId = getItemForKey(KEYS.selectedConversationId);
      if (selectedConversationId) {
        handleSelect({ id: selectedConversationId });
      }
      setSelectedConv(null);
    }
  }, [KEYS.listVisible, KEYS.selectedConversationId, getItemForKey, handleSelect, jsonData]);

  

  const toggleState = (key) => {
    setUiState((prev) => ({ ...prev, [key]: !prev[key] }));
    if (key === "showSideBar") setItemForKey(KEYS.listVisible, !uiState.showSideBar);
  };

  return (
    <div>
      <div style={styles.container}>
        {uiState.showSideBar && (
          <Sidebar
            jsonData={jsonData}
            onItemSelect={handleSelect}
            selectedConv={selectedConv}
            /** **A bug found, where, after hiding sidebar, it is not being shown again. Till the time bug-fix and RCA is availabale, disabling this functionality** */
            // onHideClick={() => toggleState("showSideBar")}  
            customSideBarStyle={styles.sidebar}
          />
        )}

        <div style={styles.mainContent}>
          <button onClick={() => toggleState("showSearchSection")}>
            {uiState.showSearchSection ? "Hide " : "Show "} Search
          </button>

          {uiState.showSearchSection && (
            <>
              <button onClick={() => toggleState("collapseAll")}>
                {uiState.collapseAll ? "Expand " : "Collapse "} All Results
              </button>
              <Suspense fallback={<div>Loading Search...</div>}>
                <Search onSearch={handleSearch} />
              </Suspense>
            </>
          )}

          {uiState.showSearchSection && filteredData.length > 0 && (
            <ChatGPTConversationRenderer
              jsonData={filteredData}
              collapseAll={uiState.collapseAll}
            />
          )}

          <Suspense fallback={<div>Loading File Selector...</div>}>
            <ConversationFileSelector
              initialSelectedFile={LATEST_CONVERSATION_FILE}
              onChange={setSelectedFile}
            />
          </Suspense>

          {selectedConv && !uiState.showSearchSection && (
            <ConversationCard
              conversation={selectedConv}
              onNextClick={handleNext}
              onPrevClick={handlePrev}
              // onShowClick={() => toggleState("showSideBar")}
              initiallyCollapsed={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: "flex",
    fontFamily: "Arial, sans-serif",
    padding: "15px",
    marginBottom: "20px",
  },
  sidebar: {
    flex: 1,
    width: "15vw",
    padding: "20px",
    borderRight: "1px solid #ccc",
    overflowY: "auto",
    position: "fixed",
    top: 0,
    bottom: 0,
  },
  mainContent: {
    flex: 2,
    padding: "20px",
    marginLeft: "280px",
    overflowY: "auto",
    position: "fixed",
    width: "75vw",
    top: 0,
    bottom: 0,
    height: "95vh",
  },
};

export default Dashboard;
