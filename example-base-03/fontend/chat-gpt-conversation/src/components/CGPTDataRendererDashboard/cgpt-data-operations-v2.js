import { prepareErrorMessage } from "./message-preparation-utils-v2";
import { formatUnixTimestamp, getConversationMessages } from "./UtilityMethods";

/**
 * Fetches and processes JSON data from a selected file.
 * Transforms the conversation data into a standardized format.
 * @param {string} selectedFile - The file path or URL to fetch JSON data from.
 * @returns {Promise<object>} - A result object containing:
 *                              - `data` (array|null): The processed data or null on error.
 *                              - `isError` (boolean): True if an error occurred, otherwise false.
 *                              - `message` (string): Success or error message.
 */
export const fetchCgptFileData = async (selectedFile) => {
  if (!selectedFile || typeof selectedFile !== "string") {
    return {
      data: null,
      isError: true,
      message: "File name is null, undefined, or not a string",
    };
  }

  try {
    const response = await fetch(selectedFile);
    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();

    // Transform the data into a standardized format
    const formattedData = data.map((conversation, index) => ({
      id: `conversation_${index + 1}`,
      title: conversation.title,
      messages: getConversationMessages(conversation) || [],
      createdOn: conversation.create_time ? formatUnixTimestamp(conversation.create_time) : null,
      updatedOn: conversation.update_time ? formatUnixTimestamp(conversation.update_time) : null,
    }));

    return {
      data: formattedData,
      isError: false,
      message: "Data fetched and processed successfully",
    };
  } catch (error) {
    const errorMessage = prepareErrorMessage(error, "An unexpected error occurred during data fetching");
    console.error(`Error fetching data: ${errorMessage}`, error);
    return {
      data: null,
      isError: true,
      message: errorMessage,
    };
  }
};
