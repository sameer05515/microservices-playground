class ProducerConsumer {
    constructor() {
      this.queue = [];
      this.listeners = [];
    }
  
    // Producer: Adds a conversation name to the queue
    produce(item) {
      this.queue.push(item);
      this.notify();
    }
  
    // Consumer: Gets the next conversation name from the queue
    consume() {
      return this.queue.shift();
    }
  
    // Register a listener to notify consumers
    subscribe(listener) {
      this.listeners.push(listener);
    }
  
    // Notify all consumers when a new item is added
    notify() {
      this.listeners.forEach((listener) => listener());
    }
  
    // Check if the queue is empty
    isEmpty() {
      return this.queue.length === 0;
    }
  }
  
  export const producerConsumer = new ProducerConsumer();

  /**==================================================================================*/

  export const startProducingConversationNames = (conversations) => {
    conversations.forEach((conversation, index) => {
      setTimeout(() => {
        producerConsumer.produce(conversation.title);
      }, index * 1000); // Simulate a delay for fetching names
    });
  };
  
  