import { isValidString } from "../../../common/utils/basic-validations";
import { prepareErrorMessage } from "../../../common/utils/message-preparation-utils-v2";
import prepareMessageMap from "./prepareMessageMap/v1";

// Utility to calculate next and previous indices
export const calculateNextPrev = (dataLength, index) => {
  if (index < 0 || dataLength <= 0) return { next: -1, prev: -1 };
  return {
    next: (index + 1 + dataLength) % dataLength,
    prev: (index - 1 + dataLength) % dataLength,
  };
};

// Utility to fetch and parse JSON data
const getRawFileData = async (selectedFileLocation) => {
  try {
    if (!selectedFileLocation || typeof selectedFileLocation !== "string") {
      throw new Error("File name is null, undefined, or not a string");
    }
    const response = await fetch(selectedFileLocation);
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    const errorMessage = prepareErrorMessage(error, "An unexpected error occurred during data fetching");
    console.error(`Error fetching data: ${errorMessage}`, error);
    throw new Error(errorMessage);
  }
};

// Standardize conversation data
const formatConversationData = (data) =>
  data.map((conversation) => ({
    id: conversation.id || conversation.conversation_id,
    title: conversation.title,
    messages: [],
    createdOn: conversation.create_time ? formatUnixTimestamp(conversation.create_time) : null,
    updatedOn: conversation.update_time ? formatUnixTimestamp(conversation.update_time) : null,
  }));

// Extract conversation metadata
const extractConversationMetadata = (data, conversationId) => {
  const selectedIndex = data.findIndex(
    (c) => c.id === conversationId || c.conversation_id === conversationId
  );
  const conversation = data[selectedIndex] || null;
  const nextPrev = calculateNextPrev(data.length, selectedIndex);

  return {
    conversation,
    selectedIndex,
    nextConversationId: data[nextPrev.next]?.id || data[nextPrev.next]?.conversation_id || null,
    prevConversationId: data[nextPrev.prev]?.id || data[nextPrev.prev]?.conversation_id || null,
  };
};

// Format messages for a conversation
const getConversationMessages = (conversation) => {
  const messages = [];
  let currentNode = conversation.current_node;
  while (currentNode !== null) {
    const node = conversation.mapping[currentNode];
    if (
      node.message &&
      node.message.content?.content_type === "text" &&
      node.message.content.parts?.[0]?.length &&
      (node.message.author.role !== "system" || node.message.metadata?.is_user_system_message)
    ) {
      messages.push({
        id: node.message.id,
        author: formatAuthor(node.message.author.role, node.message.metadata),
        isUserMessage: node.message.author.role === "user",
        text: node.message.content.parts[0],
        createdOn: node.message.create_time ? formatUnixTimestamp(node.message.create_time) : null,
        updatedOn: node.message.update_time ? formatUnixTimestamp(node.message.update_time) : null,
      });
    }
    currentNode = node.parent;
  }
  return messages.reverse();
};

// Helper to format the author
const formatAuthor = (role, metadata) => {
  if (role === "assistant") return "ChatGPT";
  if (role === "system" && metadata?.is_user_system_message) return "Custom user info";
  return capitalizeFirstLetter(role);
};

// Format a UNIX timestamp into a readable date string
const formatUnixTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
    date.getMonth()
  ];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

// Capitalize the first letter of a string
const capitalizeFirstLetter = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "");

//--------------------------------------------------------------------------------------------------- Public methods

/**
 * Fetches and processes JSON data from a selected file.
 * Transforms the conversation data into a standardized format.
 * @param {string} selectedFileLocation - The file path or URL to fetch JSON data from.
 * @returns {Promise<object>} - A result object containing:
 *                              - `data` (array|null): The processed data or null on error.
 *                              - `isError` (boolean): True if an error occurred, otherwise false.
 *                              - `message` (string): Success or error message.
 */
export const fetchBasicConversationDetailsFromCgptFileLocation = async (selectedFileLocation) => {
  if (!selectedFileLocation || typeof selectedFileLocation !== "string") {
    return { data: null, isError: true, message: "File name is null, undefined, or not a string" };
  }
  try {
    const data = await getRawFileData(selectedFileLocation);
    return {
      data: formatConversationData(data),
      isError: false,
      message: "Data fetched and processed successfully",
    };
  } catch (error) {
    const errorMessage = prepareErrorMessage(error, "An unexpected error occurred during data fetching");
    console.error(errorMessage, error);
    return { data: null, isError: true, message: errorMessage };
  }
};

export const getConversationMessagesForId = async (selectedFileLocation, conversationId) => {
  try {
    if (!isValidString(selectedFileLocation) || !isValidString(conversationId)) {
      throw new Error("File name or conversation ID is invalid");
    }
    const data = await getRawFileData(selectedFileLocation);
    const { conversation, selectedIndex, nextConversationId, prevConversationId } =
      extractConversationMetadata(data, conversationId);

    if (!conversation) throw new Error(`No conversation found for id: ${conversationId}`);

    const messages = getConversationMessages(conversation);
    const { messageMap, firstUserMessageId } = prepareMessageMap(
      messages.map(({ id, isUserMessage }) => ({ id, isUserMessage }))
    );

    return {
      data: {
        id: conversation.id || conversation.conversation_id,
        title: conversation.title,
        messages,
        createdOn: conversation.create_time ? formatUnixTimestamp(conversation.create_time) : null,
        updatedOn: conversation.update_time ? formatUnixTimestamp(conversation.update_time) : null,
        nextConversationId,
        prevConversationId,
        totalMessages: messages.length,
        messageMap,
        firstUserMessageId,
        conversationSequenceNo: selectedIndex + 1,
      },
      isError: false,
      message: "Data fetched and processed successfully",
    };
  } catch (error) {
    const errorMessage = prepareErrorMessage(error, "An unexpected error occurred during data fetching");
    return { data: null, isError: true, message: errorMessage };
  }
};
