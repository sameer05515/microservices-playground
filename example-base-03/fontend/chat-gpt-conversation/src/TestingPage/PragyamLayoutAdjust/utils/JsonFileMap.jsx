import { coversationNames, LATEST_CONVERSATION_FILE } from "../../../common/utils/constants";

/**
 * Extracts `createdOn` and `createdBy` from an ID using a specific format.
 * @param {string} id - The conversation ID to parse.
 * @param {string} defaultCreatedBy - Default value for `createdBy` if not provided in ID.
 * @returns {object} - An object containing `createdOn` and `createdBy`.
 * @throws {Error} - If the ID format is invalid.
 */
const parseCreatedDetails = (id, defaultCreatedBy = "PREMENDRA") => {
  const matches = id.match(/CONVERSATIONS_(\d{1,2})_(\w+?)_(\d{4})(?:_(.+))?/i);
  if (!matches) {
    throw new Error(`Invalid format for id: ${id}`);
  }

  const [, day, month, year, customCreatedBy] = matches;
  const createdOn = new Date(`${day} ${month} ${year}`).toISOString().split("T")[0]; // Format as "YYYY-MM-DD"

  return { createdOn, createdBy: customCreatedBy || defaultCreatedBy };
};

/**
 * Processes conversation data and enriches it with metadata.
 * @param {string} defaultCreatedBy - Default value for `createdBy` if not provided in ID.
 * @returns {array} - An array of enriched conversation details.
 */
const processConversations = (defaultCreatedBy = "PREMENDRA") =>
  Object.keys(coversationNames)
    .map((id, idx) => {
      try {
        const { createdOn, createdBy } = parseCreatedDetails(id,defaultCreatedBy);
        return {
          id,
          order: idx + 1,
          location: coversationNames[id],
          isLatest: coversationNames[id] === LATEST_CONVERSATION_FILE,
          createdOn,
          createdBy,
        };
      } catch (error) {
        console.warn(error.message);
        return null;
      }
    })
    .filter(Boolean); // Exclude null entries

const JsonFileMapWithDetails = processConversations();

/**
 * Retrieves file details by ID.
 * @param {string} id - The conversation ID.
 * @returns {object|null} - The file details or null if not found.
 */
export const getFileDetailsById = (id = "") => JsonFileMapWithDetails.find((file) => file.id === id) || null;

export default JsonFileMapWithDetails;
