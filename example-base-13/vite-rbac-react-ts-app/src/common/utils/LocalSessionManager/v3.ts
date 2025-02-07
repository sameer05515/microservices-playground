import { isValidObject, isValidString } from "../basic-validations";

class LocalSessionManagerV3 {
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
