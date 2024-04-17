import React, { useState, useEffect } from "react";
import ChatGPTConversationRenderer from "./components/AIConversationRenderer"; // Assuming you have your ChatGPTConversationRenderer component in a separate file
import Sidebar from "./components/common/Sidebar";
import { getConversationMessages } from "./utils/UtilityMethods";
import Search from "./components/common/Search";

// export const conversationStyles = {
//   border: '1px solid black',
//   padding: '20px',
//   backgroundColor: '#f3f3f3',
//   marginBottom: '20px',
// };

const App = () => {
  const [jsonData, setJsonData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Function to filter conversations and messages based on search query
  const handleSearch = (query) => {
    console.log('Search started: Search string : '+ query);
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
    console.log('Search Done: Search string : '+ query);
    console.log(JSON.stringify(filteredData));
  };

  useEffect(() => {
    const coversationNames = [
      "/data/sample-conversations1.json",
      "/data/sample-conversations2.json",
      "/data/sample-conversations3.json",
    ];
    const fetchJsonData = async () => {
      try {
        const response = await fetch(coversationNames[2]); // Adjust the file path here
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        let data = await response.json();
        data =
          data && data.length > 0
            ? data.map((conv, index) => {
              const messages = getConversationMessages(conv);
              return {
                title: conv.title,
                messages: messages && messages.length > 0 ? messages : [],
              };
            })
            : [];
        setJsonData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchJsonData();
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  return (
    <div>
      <h1>ChatGPT Conversation Renderer</h1>
      {/* <ChatGPTConversationRenderer jsonData={jsonData} /> */}
      <div style={{ display: "flex" }}>
        {/* Render the Sidebar component */}
        <Sidebar jsonData={jsonData} />

        <div style={{border: '1px solid black',}} >
          {/* Render the Search component and pass handleSearch as a prop */}
          <Search onSearch={handleSearch} />
          {/* Render the ChatGPTConversationRenderer component */}
          <ChatGPTConversationRenderer jsonData={filteredData.length > 0 ? filteredData : jsonData} />
        </div>
      </div>
    </div>
  );
};

export default App;
