// Reusable Validation Helpers
const isValidInteger = (value: unknown) => Number.isInteger(value);
const isValidString = (value: unknown) => typeof value === "string" && value.trim() !== "";
const isValidNumber = (value: unknown) => typeof value === "number" && !isNaN(value);
const isValidObject = (value: unknown) => value && typeof value === "object" && !Array.isArray(value);
const isValidArray = (value: unknown) => Array.isArray(value);
const isValidBoolean = (value: unknown) => typeof value === "boolean";

const isString = (value: unknown) => typeof value === "string";
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
