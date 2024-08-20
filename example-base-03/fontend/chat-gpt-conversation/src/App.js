import React, { useState, useEffect } from "react";
import ChatGPTConversationRenderer from "./components/AIConversationRenderer";
import Sidebar from "./components/common/Sidebar";
import Search from "./components/common/Search";
import ConversationCard from "./components/ConversationCard";
import ConversationFileSelector from "./components/common/ConversationFileSelector";
import { formatUnixTimestamp, getConversationMessages, localSessionManager } from "./utils/UtilityMethods";
import { coversationNames, LATEST_CONVERSATION_FILE } from "./utils/constants";
import ResumeComponent from "./components/resume/ResumeComponent";

// Reusable utility functions
const fetchJsonData = async (selectedFile, setJsonData) => {
  if (!selectedFile) return;

  try {
    const response = await fetch(selectedFile);
    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();
    const formattedData = data.map((conv, index) => ({
      id: `conv_${index + 1}`,
      title: conv.title,
      messages: getConversationMessages(conv) || [],
      createdOn: conv.create_time ? formatUnixTimestamp(conv.create_time) : `'${conv.create_time}'`,
      updatedOn: conv.update_time ? formatUnixTimestamp(conv.update_time) : `'${conv.update_time}'`,
    }));

    setJsonData(formattedData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const App = () => {
  const [jsonData, setJsonData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const { setItemForKey, getItemForKey, KEYS } = localSessionManager();

  const [showSearchSection, setShowSearchSection] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
  const [collapseAll, setCollapseAll] = useState(true);
  const [selectedFile, setSelectedFile] = useState(LATEST_CONVERSATION_FILE);

  useEffect(() => {
    fetchJsonData(selectedFile, setJsonData);
  }, [selectedFile]);

  useEffect(() => {
    if (jsonData.length > 0) {
      populateLinkVisibility();
      populateLastSelectedConversation();
      setSelectedConv(null);
    }
  }, [jsonData]);

  const populateLinkVisibility = () => {
    const lastValue = getItemForKey(KEYS.listVisible);
    if (lastValue != null) lastValue ? handleShowClick() : handleHideClick();
  };

  const populateLastSelectedConversation = () => {
    const selectedConversationId = getItemForKey(KEYS.selectedConversationId);
    if (selectedConversationId != null) {
      handleSelect({ id: selectedConversationId });
    }
  };

  const handleSearch = (query) => {
    if (!query || query.trim().length === 0) {
      setFilteredData([]);
      return;
    }

    const filteredConversations = jsonData.map((conversation) => {
      const filteredMessages = conversation.messages.filter((message) =>
        message.text.toLowerCase().includes(query.toLowerCase())
      );
      const titleMatches = conversation.title.toLowerCase().includes(query.toLowerCase());

      return {
        ...conversation,
        messages: filteredMessages,
        include: titleMatches || filteredMessages.length > 0,
      };
    });

    setFilteredData(filteredConversations.filter((conversation) => conversation.include));
  };

  const handleSelect = (item) => {
    const selConv = jsonData.find((c) => c.id === item?.id);
    setSelectedConv(selConv);
    if (selConv) setItemForKey(KEYS.selectedConversationId, selConv.id);
  };

  const handleNext = (id) => {
    const nextIndex = (jsonData.findIndex((c) => c.id === id) + 1) % jsonData.length;
    setSelectedConv(jsonData[nextIndex]);
    setItemForKey(KEYS.selectedConversationId, jsonData[nextIndex].id);
  };

  const handlePrev = (id) => {
    const prevIndex = (jsonData.findIndex((c) => c.id === id) - 1 + jsonData.length) % jsonData.length;
    setSelectedConv(jsonData[prevIndex]);
    setItemForKey(KEYS.selectedConversationId, jsonData[prevIndex].id);
  };

  const handleHideClick = () => {
    setShowSideBar(false);
    setItemForKey(KEYS.listVisible, false);
  };

  const handleShowClick = () => {
    setItemForKey(KEYS.listVisible, true);
    setShowSideBar(true);
  };

  return (
    <div>
      <div style={{ display: "flex", ...scrollingStyles.linksContainer }}>
        {showSideBar && (
          <Sidebar
            jsonData={jsonData}
            onItemSelect={handleSelect}
            selectedConv={selectedConv}
            onHideClick={handleHideClick}
            customSideBarStyle={scrollingStyles.leftSection}
          />
        )}

        <div style={{ border: "1px solid black", ...scrollingStyles.rightSection }}>
          <button onClick={() => setShowSearchSection((prev) => !prev)}>
            {showSearchSection ? "Hide " : "Show "} Search
          </button>

          {showSearchSection && (
            <button onClick={() => setCollapseAll((prev) => !prev)}>
              {collapseAll ? "Expand " : "Collapse "} All Results
            </button>
          )}

          {showSearchSection && <Search onSearch={handleSearch} />}
          {showSearchSection && filteredData.length > 0 && (
            <ChatGPTConversationRenderer jsonData={filteredData} collapseAll={collapseAll} />
          )}

          <ConversationFileSelector
            initialSelectedFile={LATEST_CONVERSATION_FILE}
            onChange={setSelectedFile}
          />

          {selectedConv && !showSearchSection && (
            <ConversationCard
              conversation={selectedConv}
              onNextClick={handleNext}
              onPrevClick={handlePrev}
              onShowClick={handleShowClick}
              initiallyCollapsed={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const scrollingStyles = {
  linksContainer: {
    display: "flex",
    fontFamily: "Arial, sans-serif",
    padding: "15px",
    marginBottom: "20px",
  },
  leftSection: {
    flex: "1",
    width: "15vw",
    padding: "20px",
    marginTop: "10px",
    borderRight: "1px solid #ccc",
    overflowY: "auto",
    overflowX: "auto",
    position: "fixed",
    top: "0",
    bottom: "0",
  },
  rightSection: {
    flex: "2",
    padding: "20px",
    marginLeft: "280px",
    overflowY: "auto",
    overflowX: "auto",
    position: "fixed",
    width: "75vw",
    top: "0",
    bottom: "0",
    height: "95vh",
  },
};

export default App;

// const Res= ()=><ResumeComponent/>

// export default Res;
