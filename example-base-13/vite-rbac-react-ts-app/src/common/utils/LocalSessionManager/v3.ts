import { isValidObject, isValidString } from "../basic-validations";

class LocalSessionManagerV3 {
  /**
   * Reads and retrieves an object from localStorage.
   * @template T The expected type of the stored object.
   * @param {string} appObjectName - The key under which the object is stored.
   * @returns {T} The parsed object from local storage.
   * @throws {Error} If the provided key is invalid or parsing fails.
   */
  static readApplicationObject<T extends object>(appObjectName: string): T {
    if (!isValidString(appObjectName)) {
      throw new Error(`Invalid application object name: ${appObjectName}`);
    }
    try {
      const storedConfig = localStorage.getItem(appObjectName);
      return storedConfig ? (JSON.parse(storedConfig) as T) : {} as T;
    } catch (error) {
      console.error("Error reading from local storage:", error);
      throw new Error(`Error reading from local storage: ${(error as Error).message}`);
    }
  }

  /**
   * Saves an object into localStorage.
   * @template T The type of the object being stored.
   * @param {T} obj - The object to store.
   * @param {string} appObjectName - The key under which to store the object.
   * @throws {Error} If the provided object or key is invalid.
   */
  static writeApplicationObject<T extends object>(obj: T, appObjectName: string): void {
    if (!isValidObject(obj)) {
      throw new Error("Invalid object provided for storage.");
    }
    if (!isValidString(appObjectName)) {
      throw new Error(`Invalid application object name: ${appObjectName}`);
    }
    try {
      localStorage.setItem(appObjectName, JSON.stringify(obj));
    } catch (error) {
      console.error("Error writing to local storage:", error);
      throw new Error(`Error writing to local storage: ${(error as Error).message}`);
    }
  }

  /**
   * Retrieves a specific item from an object stored in localStorage.
   * @template T The expected type of the value being retrieved.
   * @param {string} key - The key of the value within the stored object.
   * @param {string} appObjectName - The key under which the object is stored.
   * @returns {T | null} The retrieved value, or `null` if not found.
   * @throws {Error} If the provided key or storage key is invalid.
   */
  static getItemForKey<T>(key: string, appObjectName: string): T | null {
    if (!isValidString(key)) {
      throw new Error("Invalid key.");
    }
    if (!isValidString(appObjectName)) {
      throw new Error(`Invalid application object name: ${appObjectName}`);
    }
    try {
      const config = this.readApplicationObject<Record<string, unknown>>(appObjectName);
      return (config[key] as T) ?? null;
    } catch (error) {
      console.error(`Error retrieving key '${key}':`, error);
      return null;
    }
  }

  /**
   * Stores a specific key-value pair inside an object in localStorage.
   * @template T The type of the value being stored.
   * @param {string} key - The key to store the value under.
   * @param {T} value - The value to be stored.
   * @param {string} appObjectName - The key under which the object is stored.
   * @throws {Error} If the provided key, value, or storage key is invalid.
   */
  static setItemForKey<T>(key: string, value: T, appObjectName: string): void {
    if (!isValidString(key) || value === undefined) {
      throw new Error("Invalid key or value.");
    }
    if (!isValidString(appObjectName)) {
      throw new Error(`Invalid application object name: ${appObjectName}`);
    }
    try {
      const config = this.readApplicationObject<Record<string, unknown>>(appObjectName);
      config[key] = value;
      this.writeApplicationObject(config, appObjectName); // 🔥 `this` ensures correct method resolution.
    } catch (error) {
      console.error(`Error setting key '${key}' with value '${value}':`, error);
      throw new Error(`Error setting key '${key}': ${(error as Error).message}`);
    }
  }

  /**
   * Clears an entire stored object from localStorage.
   * @param {string} appObjectName - The key under which the object is stored.
   * @throws {Error} If the provided key is invalid.
   */
  static clearApplicationObject(appObjectName: string): void {
    if (!isValidString(appObjectName)) {
      throw new Error(`Invalid application object name: ${appObjectName}`);
    }
    try {
      localStorage.removeItem(appObjectName);
    } catch (error) {
      console.error("Error clearing local storage:", error);
      throw new Error(`Error clearing local storage: ${(error as Error).message}`);
    }
  }
}

export default LocalSessionManagerV3;
