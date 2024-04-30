import React, { useState, useEffect } from 'react';

const Sidebar = ({ jsonData = [] }) => {
  const [conversationNames, setConversationNames] = useState([]);

  useEffect(() => {
    // Extract conversation names from jsonData and set them in state
    const names = jsonData.map(conversation => conversation.title);
    setConversationNames(names);
  }, [jsonData]);

  return (
    <div style={{ width: '200px', backgroundColor: '#f0f0f0', padding: '20px' }}>
      <h2>Conversation Names</h2>
      <ul>
        {conversationNames.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
