import { isValidObject, isValidString } from "../basic-validations";

/**
 * This version is just cleaned up v1.
 *
 * We have performed below actions
 * - Removed extra constants came along with old file, which I copied from another project
 * - Removed old documentation, so that I can put updated documentation which reflects what has been changed in this version
 * - Removed default values for appObjectName and tried to add error throwing logic
 * 
 * However, this version is an intermediate version and **should not be used in production**.
 * 
 * Please refer [LocalSessionManagerV3](./v3.ts) for production use.
 *
 */
class LocalSessionManagerV2 {
  static readApplicationObject(appObjectName: string): Record<string, unknown> {
    if (!isValidString(appObjectName)) {
      throw new Error("Invalid application object name provided for storage: " + appObjectName);
    }
    try {
      const storedConfig = localStorage.getItem(appObjectName);
      return storedConfig ? JSON.parse(storedConfig) : {};
    } catch (error) {
      console.error("Error occurred while reading from local storage:", error);
      throw new Error(`Error reading from local storage: ${(error as Error).message}`);
    }
  }

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

  static getItemForKey<T>(key: string, appObjectName: string): T | null {
    if (!isValidString(key)) {
      throw new Error("Key and value are required for setItemForKey.");
    }
    if (!isValidString(appObjectName)) {
      throw new Error("Invalid application object name provided for storage: " + appObjectName);
    }
    try {
      const config = this.readApplicationObject(appObjectName);
      return key in config ? (config[key] as T) : null;
    } catch (error) {
      console.error(`Error retrieving key '${key}':`, error);
      return null;
    }
  }

  static setItemForKey(key: string, value: unknown, appObjectName: string): void {
    if (!key || value === undefined) {
      throw new Error("Invalid Key name provided.");
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

export default LocalSessionManagerV2;
