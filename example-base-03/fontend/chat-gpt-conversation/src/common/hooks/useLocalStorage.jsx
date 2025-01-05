import { useCallback } from "react";

/**
 * useLocalStorage - A custom hook for managing application-specific data in localStorage.
 *
 * @param {string} appObjectName - The key under which the application config is stored.
 * @returns {Object} Hook API with get, set, and clear methods.
 */
const useLocalStorage = (appObjectName) => {
  const readApplicationObject = useCallback(() => {
    try {
      const storedConfig = localStorage.getItem(appObjectName);
      return storedConfig ? JSON.parse(storedConfig) : {};
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return {};
    }
  }, [appObjectName]);

  const writeApplicationObject = useCallback((obj) => {
    try {
      if (typeof obj !== "object" || obj === null) {
        throw new Error("Invalid object provided for storage.");
      }
      localStorage.setItem(appObjectName, JSON.stringify(obj));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
      throw new Error(`Error writing to local storage: ${error.message}`);
    }
  }, [appObjectName]);

  const getItemForKey = useCallback(
    (key) => {
      try {
        const config = readApplicationObject();
        return config[key] !== undefined ? config[key] : null;
      } catch (error) {
        console.error(`Error retrieving key '${key}':`, error);
        return null;
      }
    },
    [readApplicationObject]
  );

  const setItemForKey = useCallback(
    (key, value) => {
      if (!key || value === undefined) {
        throw new Error("Key and value are required for setItemForKey.");
      }
      try {
        const config = readApplicationObject();
        config[key] = value;
        writeApplicationObject(config);
      } catch (error) {
        console.error(`Error setting key '${key}' with value '${value}':`, error);
        throw new Error(`Error setting key '${key}': ${error.message}`);
      }
    },
    [readApplicationObject, writeApplicationObject]
  );

  const clearApplicationObject = useCallback(() => {
    try {
      localStorage.removeItem(appObjectName);
    } catch (error) {
      console.error("Error clearing application configuration:", error);
      throw new Error(`Error clearing local storage: ${error.message}`);
    }
  }, [appObjectName]);

  return {
    readApplicationObject,
    writeApplicationObject,
    getItemForKey,
    setItemForKey,
    clearApplicationObject,
  };
};

export default useLocalStorage;
