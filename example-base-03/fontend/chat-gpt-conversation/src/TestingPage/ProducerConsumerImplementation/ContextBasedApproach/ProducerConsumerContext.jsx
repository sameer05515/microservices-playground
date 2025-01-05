import React, { createContext, useContext, useState, useCallback } from "react";

class ProducerConsumer {
  constructor() {
    this.queue = [];
    this.listeners = [];
  }

  produce(item) {
    this.queue.push(item);
    this.notify();
  }

  consume() {
    return this.queue.shift();
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener());
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}

const producerConsumer = new ProducerConsumer();

// Context
const ProducerConsumerContext = createContext();

// Context Provider
export const ProducerConsumerProvider = ({ children }) => {
  const [conversationNames, setConversationNames] = useState([]);

  const handleNewConversation = useCallback(() => {
    if (!producerConsumer.isEmpty()) {
      const newConversation = producerConsumer.consume();
      setConversationNames((prev) => [...prev, newConversation]);
    }
  }, []);

  // Subscribe to the producer-consumer queue
  React.useEffect(() => {
    producerConsumer.subscribe(handleNewConversation);

    // Cleanup
    return () => {
      producerConsumer.listeners = [];
    };
  }, [handleNewConversation]);

  // Start producing conversations
  const startProducing = (conversations) => {
    conversations.forEach((conversation, index) => {
      setTimeout(() => {
        producerConsumer.produce(conversation.title);
      }, index * 1000);
    });
  };

  return (
    <ProducerConsumerContext.Provider value={{ conversationNames, startProducing }}>
      {children}
    </ProducerConsumerContext.Provider>
  );
};

// Hook for accessing the context
export const useProducerConsumer = () => useContext(ProducerConsumerContext);
