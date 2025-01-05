/**
 * Prepares a Map where keys are user message IDs and values are arrays of
 * messages starting from the user message up to just before the next user message.
 *
 * @param {Array} messages - Array of message objects.
 * @returns {Map} - A Map with user message IDs as keys and arrays of messages as values.
 */
const prepareMessageMap = (messages) => {
    const messageMap = new Map();
    let currentUserMessageId = null;
    let currentGroup = [];
  
    messages.forEach((message, index) => {
      if (message.isUserMessage) {
        // If there's an ongoing group, finalize it before starting a new one
        if (currentUserMessageId !== null) {
          messageMap.set(currentUserMessageId, currentGroup);
        }
        // Start a new group for the current user message
        currentUserMessageId = message.id;
        currentGroup = [message];
      } else if (currentUserMessageId !== null) {
        // Add non-user messages to the current group
        currentGroup.push(message);
      }
  
      // Finalize the last group if it's the last message in the array
      if (index === messages.length - 1 && currentUserMessageId !== null) {
        messageMap.set(currentUserMessageId, currentGroup);
      }
    });
  
    return messageMap;
  };
  
  export default prepareMessageMap;
  