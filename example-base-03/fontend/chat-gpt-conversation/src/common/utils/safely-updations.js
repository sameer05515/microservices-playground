import {
  isValidInteger,
  isValidString,
  isValidNumber,
  isValidObject,
  isValidArray,
  isValidBoolean,
  isString,
} from "./basic-validations";

// Safely Update Integer
export const safelyUpdateInteger = (existing = 0, newValue = 0) =>
  isValidInteger(newValue) ? newValue : existing;

// Get Minimum Integer
export const getMinInteger = (existing = 0, newValue = 0) =>
  isValidInteger(newValue) ? Math.min(existing, newValue) : existing;

// Get Maximum Integer
export const getMaxInteger = (existing = 0, newValue = 0) =>
  isValidInteger(newValue) ? Math.max(existing, newValue) : existing;

// Safely Update String
export const safelyUpdateString = (existing = "", newValue = "") =>
  isValidString(newValue) ? newValue : existing;

// Safely Truncate String
export const safelyTruncateString = (value = "", maxLength = 0) => {
  if (!isValidString(value)) return ""; // Return empty string if invalid
  const trimmedValue = value.trim();
  const maxAllowedLength = getMaxInteger(0, maxLength); // Ensure maxLength is valid
  return maxAllowedLength && trimmedValue.length > maxAllowedLength
    ? trimmedValue.substring(0, maxAllowedLength)
    : trimmedValue;
};

// Safely Update Object
export const safelyUpdateObject = (existing = {}, newValue = {}) =>
  isValidObject(newValue) ? newValue : existing;

// Safely Update Array
export const safelyUpdateArray = (existing = [], newValue = []) =>
  isValidArray(newValue) ? newValue : existing;

// Safely Update Nullable
export const safelyUpdateNullable = (existing = null, newValue = null) =>
  newValue === null || newValue === undefined ? existing : newValue;

// Safely Update Number
export const safelyUpdateNumber = (existing = 0, newValue = 0) =>
  isValidNumber(newValue) ? newValue : existing;

// Safely Update Boolean
export const safelyUpdateBoolean = (existing = false, newValue = false) =>
  isValidBoolean(newValue) ? newValue : existing;

/**Derived operations*/
export const truncateAndUpdate = (
  oldValue = "",
  newValue = "",
  maxLength = 0
) => safelyTruncateString(safelyUpdateString(oldValue, newValue), maxLength);

export const getSanitizedString = (value) => (isString(value) ? value : "");
