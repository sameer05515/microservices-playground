// Reusable Validation Helpers
const isValidInteger = (value) => Number.isInteger(value);
const isValidString = (value) =>
  typeof value === "string" && value.trim() !== "";
const isValidNumber = (value) => typeof value === "number" && !isNaN(value);
const isValidObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value);
const isValidArray = (value) => Array.isArray(value);
const isValidBoolean = (value) => typeof value === "boolean";

const isString = (value) => typeof value === "string";
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
