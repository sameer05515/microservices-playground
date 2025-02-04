/**
 * Local Session Manager
 *
 * Utility to manage application-specific data in local storage.
 * Plan: Import methods from UtilityMethods.js for validation and other utilities.
 */

import { isValidObject, isValidString } from "./basic-validations";

export const APPLICATION_OBJECT_CHAT_RENDERER_KEY = "chatRendererConfig";
export const APPLICATION_OBJECT_THEME_KEY = "viewMode";

const KEYS = {
  listVisible: "listVisible",
  selectedFileName: "selectedFileName",
  selectedConversationId: "selectedConversationId",
  viewMode: "viewMode",
  ConsolidatedReportV1_SidebarClosed:"ConsolidatedReportV1_SidebarClosed"
};

/**
 * Reads the application configuration object from localStorage.
 * @returns {Object} Parsed configuration object.
 * @param {string} appObjectName - The key under which the application config is stored.
 * @throws {Error} If JSON parsing fails.
 */
const readApplicationObject = (appObjectName = APPLICATION_OBJECT_CHAT_RENDERER_KEY) => {
  try {
    const storedConfig = localStorage.getItem(appObjectName);
    return storedConfig ? JSON.parse(storedConfig) : {};
  } catch (error) {
    console.error("Error occurred while reading from local storage:", error);
    throw new Error(`Error reading from local storage: ${error.message}`);
  }
};

/**
 * Writes the given object to localStorage under the application config name.
 * @param {Object} obj - The object to be stored.
 * @param {string} appObjectName - The key under which the application config is stored.
 * @throws {Error} If the object is invalid or cannot be written.
 */
const writeApplicationObject = (obj, appObjectName) => {
  if (!isValidObject(obj)) {
    throw new Error("Invalid object provided for storage.");
  }
  if (!isValidString(appObjectName)) {
    throw new Error("Invalid application object name provided for storage: " + appObjectName);
  }
  try {
    localStorage.setItem(appObjectName, JSON.stringify(obj));
  } catch (error) {
    console.error("Error occurred while writing to local storage:", error);
    throw new Error(`Error writing to local storage: ${error.message}`);
  }
};

/**
 * Retrieves the value for a specific key from the application configuration.
 * @param {string} key - The key to retrieve.
 * @param {string} appObjectName - The key under which the application config is stored.
 * @returns {*} The value associated with the key, or null if not found.
 */
const getItemForKey = (key, appObjectName = APPLICATION_OBJECT_CHAT_RENDERER_KEY) => {
  try {
    const config = readApplicationObject(appObjectName);
    return config && key in config ? config[key] : null;
  } catch (error) {
    console.error(`Error retrieving key '${key}':`, error);
    return null;
  }
};

/**
 * Sets the value for a specific key in the application configuration.
 * @param {string} key - The key to set.
 * @param {*} value - The value to associate with the key.
 * @param {string} appObjectName - The key under which the application config is stored.
 * @throws {Error} If writing to local storage fails.
 */
const setItemForKey = (key, value, appObjectName) => {
  if (!key || value === undefined) {
    throw new Error("Key and value are required for setItemForKey.");
  }
  if (!isValidString(appObjectName)) {
    throw new Error("Invalid application object name provided for storage: " + appObjectName);
  }
  try {
    const config = readApplicationObject(appObjectName);
    config[key] = value;
    writeApplicationObject(config,appObjectName);
  } catch (error) {
    console.error(`Error setting key '${key}' with value '${value}':`, error);
    throw new Error(`Error setting key '${key}': ${error.message}`);
  }
};

/**
 * Clears the entire application configuration in localStorage.
 * @param {string} appObjectName - The key under which the application config is stored.
 */
const clearApplicationObject = (appObjectName) => {
  if (!isValidString(appObjectName)) {
    throw new Error("Invalid application object name provided: " + appObjectName);
  }
  try {
    localStorage.removeItem(appObjectName);
  } catch (error) {
    console.error("Error clearing application configuration:", error);
    throw new Error(`Error clearing local storage: ${error.message}`);
  }
};

export { getItemForKey, setItemForKey, clearApplicationObject, KEYS };
