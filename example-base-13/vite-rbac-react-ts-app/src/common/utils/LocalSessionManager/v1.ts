/**
 * Local Session Manager
 *
 * Utility to manage application-specific data in local storage.
 * Plan: Import methods from UtilityMethods.ts for validation and other utilities.
 */

import { isValidObject, isValidString } from "../basic-validations";

// Application object keys
export const APPLICATION_OBJECT_CHAT_RENDERER_KEY = "chatRendererConfig";
export const APPLICATION_OBJECT_THEME_KEY = "viewMode";

// Defined keys used in local storage
export const KEYS = {
  listVisible: "listVisible",
  selectedFileName: "selectedFileName",
  selectedConversationId: "selectedConversationId",
  viewMode: "viewMode",
  ConsolidatedReportV1_SidebarClosed: "ConsolidatedReportV1_SidebarClosed",
};

class LocalSessionManagerV1 {
  /**
   * Reads the application configuration object from localStorage.
   * @param appObjectName - The key under which the application config is stored.
   * @returns Parsed configuration object.
   * @throws Error If JSON parsing fails.
   */
  static readApplicationObject(appObjectName: string = APPLICATION_OBJECT_CHAT_RENDERER_KEY): Record<string, unknown> {
    try {
      const storedConfig = localStorage.getItem(appObjectName);
      return storedConfig ? JSON.parse(storedConfig) : {};
    } catch (error) {
      console.error("Error occurred while reading from local storage:", error);
      throw new Error(`Error reading from local storage: ${(error as Error).message}`);
    }
  }

  /**
   * Writes the given object to localStorage under the application config name.
   * @param obj - The object to be stored.
   * @param appObjectName - The key under which the application config is stored.
   * @throws Error If the object is invalid or cannot be written.
   */
  static writeApplicationObject(obj: Record<string, unknown>, appObjectName: string): void {
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
      throw new Error(`Error writing to local storage: ${(error as Error).message}`);
    }
  }

  /**
   * Retrieves the value for a specific key from the application configuration.
   * @param key - The key to retrieve.
   * @param appObjectName - The key under which the application config is stored.
   * @returns The value associated with the key, or null if not found.
   */
  static getItemForKey<T>(key: string, appObjectName: string = APPLICATION_OBJECT_CHAT_RENDERER_KEY): T | null {
    try {
      const config = this.readApplicationObject(appObjectName);
      return key in config ? (config[key] as T) : null;
    } catch (error) {
      console.error(`Error retrieving key '${key}':`, error);
      return null;
    }
  }

  /**
   * Sets the value for a specific key in the application configuration.
   * @param key - The key to set.
   * @param value - The value to associate with the key.
   * @param appObjectName - The key under which the application config is stored.
   * @throws Error If writing to local storage fails.
   */
  static setItemForKey(key: string, value: unknown, appObjectName: string): void {
    if (!key || value === undefined) {
      throw new Error("Key and value are required for setItemForKey.");
    }
    if (!isValidString(appObjectName)) {
      throw new Error("Invalid application object name provided for storage: " + appObjectName);
    }
    try {
      const config = this.readApplicationObject(appObjectName);
      config[key] = value;
      this.writeApplicationObject(config, appObjectName);
    } catch (error) {
      console.error(`Error setting key '${key}' with value '${value}':`, error);
      throw new Error(`Error setting key '${key}': ${(error as Error).message}`);
    }
  }

  /**
   * Clears the entire application configuration in localStorage.
   * @param appObjectName - The key under which the application config is stored.
   */
  static clearApplicationObject(appObjectName: string): void {
    if (!isValidString(appObjectName)) {
      throw new Error("Invalid application object name provided: " + appObjectName);
    }
    try {
      localStorage.removeItem(appObjectName);
    } catch (error) {
      console.error("Error clearing application configuration:", error);
      throw new Error(`Error clearing local storage: ${(error as Error).message}`);
    }
  }
}


export default LocalSessionManagerV1;