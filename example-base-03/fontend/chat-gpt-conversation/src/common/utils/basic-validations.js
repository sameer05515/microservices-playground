// Reusable Validation Helpers

/**
 * Checks if the given value is a valid integer.
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is an integer, false otherwise.
 */
const isValidInteger = (value) => Number.isInteger(value);

/**
 * Checks if the given value is a non-empty string after trimming whitespace.
 * @param {*} value - The value to check.
 * @returns {boolean} True if value is a non-empty string, false otherwise.
 */
const isValidString = (value) =>
  typeof value === "string" && value.trim() !== "";

/**
 * Checks if the given value is a valid number (not NaN).
 * @param {*} value - The value to check.
 * @returns {boolean} True if value is a number and not NaN, false otherwise.
 */
const isValidNumber = (value) => typeof value === "number" && !isNaN(value);

/**
 * Checks if the given value is a plain object (not an array and not null).
 * @param {*} value - The value to check.
 * @returns {boolean} True if value is an object (but not an array or null), false otherwise.
 */
const isValidObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value);

/**
 * Checks if the given value is an array.
 * @param {*} value - The value to check.
 * @returns {boolean} True if value is an array, false otherwise.
 */
const isValidArray = (value) => Array.isArray(value);

/**
 * Checks if the given value is a boolean.
 * @param {*} value - The value to check.
 * @returns {boolean} True if value is a boolean, false otherwise.
 */
const isValidBoolean = (value) => typeof value === "boolean";

/**
 * Checks if the given value is a string (ignores empty string).
 * @param {*} value - The value to check.
 * @returns {boolean} True if value is a string, false otherwise.
 */
const isString = (value) => typeof value === "string";

/**
 * Alias for isValidString: Checks if the value is a non-empty string.
 * @function
 */
const isNonEmptyString = isValidString;

export {
  isValidInteger,
  isValidString,
  isValidNumber,
  isValidObject,
  isValidArray,
  isValidBoolean,
  isString,
  isNonEmptyString,
};
