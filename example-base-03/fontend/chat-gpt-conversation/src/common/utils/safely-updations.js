import {
  isValidInteger,
  isValidString,
  isValidNumber,
  isValidObject,
  isValidArray,
  isValidBoolean,
  isString,
} from "./basic-validations";

/**
 * Safely updates an integer value.
 * Returns the newValue if it's a valid integer, otherwise returns the existing value.
 *
 * @param {number} existing - The current value.
 * @param {number} newValue - The proposed new value.
 * @returns {number} The updated integer value.
 */
export const safelyUpdateInteger = (existing = 0, newValue = 0) =>
  isValidInteger(newValue) ? newValue : existing;

/**
 * Returns the minimum of existing and newValue if newValue is a valid integer; otherwise returns existing.
 *
 * @param {number} existing - The current value.
 * @param {number} newValue - The proposed new value.
 * @returns {number} The minimum integer.
 */
export const getMinInteger = (existing = 0, newValue = 0) =>
  isValidInteger(newValue) ? Math.min(existing, newValue) : existing;

/**
 * Returns the maximum of existing and newValue if newValue is a valid integer; otherwise returns existing.
 *
 * @param {number} existing - The current value.
 * @param {number} newValue - The proposed new value.
 * @returns {number} The maximum integer.
 */
export const getMaxInteger = (existing = 0, newValue = 0) =>
  isValidInteger(newValue) ? Math.max(existing, newValue) : existing;

/**
 * Safely updates a string value.
 * Returns the newValue if it's a valid string, otherwise returns the existing value.
 *
 * @param {string} existing - The current value.
 * @param {string} newValue - The proposed new value.
 * @returns {string} The updated string value.
 */
export const safelyUpdateString = (existing = "", newValue = "") =>
  isValidString(newValue) ? newValue : existing;

/**
 * Safely truncates a string to a maximum length.
 * Trims whitespace and returns a truncated string (if needed).
 * Returns an empty string if value is invalid.
 *
 * @param {string} value - The string to truncate.
 * @param {number} maxLength - The maximum allowed length.
 * @returns {string} The truncated string.
 */
export const safelyTruncateString = (value = "", maxLength = 0) => {
  if (!isValidString(value)) return ""; // Return empty string if invalid
  const trimmedValue = value.trim();
  const maxAllowedLength = getMaxInteger(0, maxLength); // Ensure maxLength is valid
  return maxAllowedLength && trimmedValue.length > maxAllowedLength
    ? trimmedValue.substring(0, maxAllowedLength)
    : trimmedValue;
};

/**
 * Safely updates an object value.
 * Returns the newValue if it's a valid object, otherwise returns the existing value.
 *
 * @param {Object} existing - The current object.
 * @param {Object} newValue - The proposed new object.
 * @returns {Object} The updated object.
 */
export const safelyUpdateObject = (existing = {}, newValue = {}) =>
  isValidObject(newValue) ? newValue : existing;

/**
 * Safely updates an array value.
 * Returns the newValue if it's a valid array, otherwise returns the existing value.
 *
 * @param {Array} existing - The current array.
 * @param {Array} newValue - The proposed new array.
 * @returns {Array} The updated array.
 */
export const safelyUpdateArray = (existing = [], newValue = []) =>
  isValidArray(newValue) ? newValue : existing;

/**
 * Safely updates a nullable value.
 * Returns the newValue unless it is null or undefined, in which case returns the existing value.
 *
 * @param {*} existing - The current value.
 * @param {*} newValue - The proposed new value.
 * @returns {*} The updated or existing value.
 */
export const safelyUpdateNullable = (existing = null, newValue = null) =>
  newValue === null || newValue === undefined ? existing : newValue;

/**
 * Safely updates a number value (including floats).
 * Returns the newValue if it's a valid number (not NaN), otherwise returns the existing value.
 *
 * @param {number} existing - The current number value.
 * @param {number} newValue - The proposed new value.
 * @returns {number} The updated number.
 */
export const safelyUpdateNumber = (existing = 0, newValue = 0) =>
  isValidNumber(newValue) ? newValue : existing;

/**
 * Safely updates a boolean value.
 * Returns the newValue if it's a valid boolean, otherwise returns the existing value.
 *
 * @param {boolean} existing - The current value.
 * @param {boolean} newValue - The proposed new value.
 * @returns {boolean} The updated boolean.
 */
export const safelyUpdateBoolean = (existing = false, newValue = false) =>
  isValidBoolean(newValue) ? newValue : existing;

/**
 * Truncates and updates a string in one operation.
 * First performs safelyUpdateString on (oldValue, newValue), then safelyTruncateString to the specified maxLength.
 *
 * @param {string} oldValue - The current string value.
 * @param {string} newValue - The proposed new string value.
 * @param {number} maxLength - The maximum allowed length.
 * @returns {string} The truncated and updated string.
 */
export const truncateAndUpdate = (
  oldValue = "",
  newValue = "",
  maxLength = 0
) => safelyTruncateString(safelyUpdateString(oldValue, newValue), maxLength);

/**
 * Returns the given value if it is a string, or an empty string otherwise.
 *
 * @param {*} value - The value to sanitize.
 * @returns {string} The sanitized string.
 */
export const getSanitizedString = (value) => (isString(value) ? value : "");
