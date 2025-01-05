/**
 * Prepares a user-friendly error message.
 * If the error is a string or contains a message property, it returns the message.
 * Otherwise, it attempts to convert the error object into a JSON string.
 * @param {any} error - The error object or string.
 * @param {string} [defaultMessage="An unexpected error occurred!"] - The default error message if no specific message can be extracted.
 * @returns {string} - A user-friendly error message.
 */
export const prepareErrorMessage = (error, defaultMessage = "An unexpected error occurred!") => {
  if (!error) return defaultMessage;
  if (typeof error === "string" && error.trim()) return error;
  if (error.message && typeof error.message === "string" && error.message.trim()) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return defaultMessage;
  }
};
