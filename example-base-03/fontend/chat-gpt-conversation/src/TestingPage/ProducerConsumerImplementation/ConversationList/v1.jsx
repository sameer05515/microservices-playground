import React, { useEffect, useState } from "react";
import { producerConsumer, startProducingConversationNames } from "./ProducerConsumer";

const defaultConvArr = () => {
  const arr = [];
  for (let i = 0; i < 25; i++) {
    arr.push({ title: `Conv_${i + 1}` });
  }
  return arr;
};

const arr = defaultConvArr();

const ConversationListV1 = ({ conversations = arr }) => {
  const [conversationNames, setConversationNames] = useState([]);

  useEffect(() => {
    // Subscribe to the producer-consumer queue
    const handleNewConversation = () => {
      if (!producerConsumer.isEmpty()) {
        const newConversation = producerConsumer.consume();
        setConversationNames((prev) => [...prev, newConversation]);
      }
    };

    producerConsumer.subscribe(handleNewConversation);

    // Start producing conversation names
    startProducingConversationNames(conversations);

    // Cleanup on unmount
    return () => {
      producerConsumer.listeners = [];
    };
  }, [conversations]);

  return (
    <div>
      <h2>Conversation List</h2>
      <ul>
        {conversationNames.map((name, index) => (
          <li key={index} className="fade-in-animation">
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationListV1;
