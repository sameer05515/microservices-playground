import React from "react";
import { useProducerConsumer } from "./ProducerConsumerContext";
import { ProducerConsumerProvider } from "./ProducerConsumerContext";

const ConversationListV2 = ({ conversations }) => {
  const { conversationNames, startProducing } = useProducerConsumer();

  return (
    <div>
      <h2>Conversation List</h2>
      <button
        onClick={() => startProducing(conversations)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Start Fetching Conversations
      </button>
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

const defaultConvArr = () => {
  const arr = [];
  for (let i = 0; i < 50; i++) {
    arr.push({ title: `Conv_${i + 1}` });
  }
  return arr;
};

const conversations = defaultConvArr();

// export default ConversationListV2;
const WithContext = () => {
  return (
    <ProducerConsumerProvider>
      <ConversationListV2 conversations={conversations} />
    </ProducerConsumerProvider>
  );
};

export default WithContext;
