import React, { useState, useEffect } from "react";
import ChatGPTConversationRenderer from "./components/AIConversationRenderer"; // Assuming you have your ChatGPTConversationRenderer component in a separate file
import Sidebar from "./components/common/Sidebar";
import {
  formatUnixTimestamp,
  getConversationMessages,
  localSessionManager,
} from "./utils/UtilityMethods";
import Search from "./components/common/Search";
import ConversationCard from "./components/ConversationCard";

const App = () => {
  const [jsonData, setJsonData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const { setItemForKey, getItemForKey, KEYS } = localSessionManager();

  const [showSearchSection, setShowSearchSection] = useState(false);

  const [showSideBar, setShowSideBar] = useState(false);

  // Function to filter conversations and messages based on search query
  const handleSearch = (query) => {
    console.log("Search started: Search string : " + query);
    if (!query || query.trim().length == 0) {
      setFilteredData((prev) => []);
      return;
    }
    const filteredConversations = jsonData.map((conversation) => {
      // Filter messages within the conversation based on the search query
      const filteredMessages = conversation.messages.filter((message) =>
        message.text.toLowerCase().includes(query.toLowerCase())
      );
      // Check if conversation title contains the search query
      const titleMatches = conversation.title
        .toLowerCase()
        .includes(query.toLowerCase());

      // Return conversation object with filtered messages or empty messages array
      return {
        ...conversation,
        messages: filteredMessages,
        // Include the conversation in filteredConversations if either title or messages match the search query
        include: titleMatches || filteredMessages.length > 0,
      };
    });

    // Filter out conversations without matching titles or messages
    const filteredData = filteredConversations.filter(
      (conversation) => conversation.include
    );

    setFilteredData(filteredData);
    console.log("Search Done: Search string : " + query);
    // console.log(JSON.stringify(filteredData));
  };

  useEffect(() => {
    if (jsonData && jsonData.length > 0) {
      const populateLinkVisibility = () => {
        const lastValue = getItemForKey(KEYS.listVisible);
        // console.log(`LAST VALUE : ${KEYS.listVisible} : ${lastValue}: ${typeof lastValue}`);
        if (lastValue != null) {
          // setShowSideBar(lastValue);
          lastValue ? handleShowClick() : handleHideClick();
        }
      };

      const populateLastSelectedConverstaion = () => {
        const selectedConversationId = getItemForKey(
          KEYS.selectedConversationId
        );
        if (selectedConversationId != null) {
          console.log(
            `[App][useEffect][populateLastSelectedConverstaion]: LAST VALUE : ${KEYS.selectedConversationId
            } : ${JSON.stringify(
              selectedConversationId
            )}: ${typeof selectedConversationId}`
          );
          handleSelect({ id: selectedConversationId });
        }
        return true;
      };

      populateLinkVisibility();
      // Call populateLastSelectedConverstaion after setting jsonData
      populateLastSelectedConverstaion();
    }
  }, [jsonData]);

  useEffect(() => {
    const coversationNames = [
      "/data/sample-conversations1.json",
      "/data/sample-conversations2.json",
      "/data/sample-conversations3.json",
      "/data/conversations-09-May-2024.json",
      "/data/conversations-10-May-2024.json",
      "/data/conversations-12-May-2024.json",
    ];
    const fetchJsonData = async () => {
      try {
        const response = await fetch(coversationNames[5]); // Adjust the file path here
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        let data = await response.json();
        let count = 0;
        console.log(`response data length: ${data ? data.length : 0}`);
        data =
          data && data.length > 0
            ? data.map((conv, index) => {
              const messages = getConversationMessages(conv);

              return {
                id: `conv_${++count}`,
                title: conv.title,
                messages: messages && messages.length > 0 ? messages : [],
                createdOn: conv.create_time
                  ? formatUnixTimestamp(conv.create_time)
                  : `'${conv.create_time}'`,
                updatedOn: conv.update_time
                  ? formatUnixTimestamp(conv.update_time)
                  : `'${conv.update_time}'`,
              };
            })
            : [];
        setJsonData((prev) => [...data]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchJsonData();
    // populateLastSelectedConverstaion();
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  const handleSelect = (item) => {
    console.log(
      `${JSON.stringify(item)} , jsonData-length: ${jsonData.length}`
    );
    let selConv = jsonData.find((c) => c.id === item.id);
    setSelectedConv(selConv);
    setItemForKey(KEYS.selectedConversationId, selConv.id);
  };

  const handleNext = (id) => {
    let nextIndex =
      (jsonData.findIndex((c) => c.id === id) + 1 + jsonData.length) %
      jsonData.length;
    setSelectedConv((prev) => jsonData[nextIndex]);
    setItemForKey(KEYS.selectedConversationId, jsonData[nextIndex].id);
  };

  const handlePrev = (id) => {
    let nextIndex =
      (jsonData.findIndex((c) => c.id === id) - 1 + jsonData.length) %
      jsonData.length;
    setSelectedConv((prev) => jsonData[nextIndex]);
    setItemForKey(KEYS.selectedConversationId, jsonData[nextIndex].id);
  };

  const handleHideClick = () => {
    setShowSideBar(false);
    setItemForKey(KEYS.listVisible, false);
    // setSelectedConv((prev) => (prev ? prev : jsonData[0]));
  };
  const handleShowClick = () => {
    setItemForKey(KEYS.listVisible, true);
    setShowSideBar(true);
  };

  return (
    <div>
      {/* <h1>ChatGPT Conversation Renderer</h1> */}
      <div style={{ display: "flex", ...scrollingStyles.linksContainer }}>
        {/* Render the Sidebar component */}

        {showSideBar && (
          <Sidebar
            jsonData={jsonData}
            onItemSelect={handleSelect}
            selectedConv={selectedConv}
            onHideClick={handleHideClick}
            customSideBarStyle={scrollingStyles.leftSection}
          />
        )}

        <div
          style={{ border: "1px solid black", ...scrollingStyles.rightSection }}
        >
          <button onClick={() => setShowSearchSection((prev) => !prev)}>
            {showSearchSection ? "Hide " : "Show "} Search
          </button>
          {/* Render the Search component and pass handleSearch as a prop */}
          {showSearchSection && <Search onSearch={handleSearch} />}
          {/* Render the ChatGPTConversationRenderer component */}
          {showSearchSection && filteredData.length > 0 && (
            <ChatGPTConversationRenderer jsonData={filteredData} />
          )}

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
    height: "95vh", // Set a specific height to trigger scrollbar
  },
};

export default App;
