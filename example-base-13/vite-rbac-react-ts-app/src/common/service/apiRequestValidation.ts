// apiRequestValidation.ts

// Define the expected structure of validation inputs
export type ValidationInput = {
    key: string;
    value: unknown;
    type: "string" | "number" | "boolean" | "object" | "function";
  };
  
  /**
   * Utility to validate inputs and throw errors if invalid.
   * @param inputs - Array of objects with `key`, `value`, and `type`.
   */
  export const validateInputs = (inputs: ValidationInput[]): void => {
    inputs.forEach(({ key, value, type }) => {
      if (value === undefined || typeof value !== type) {
        throw new Error(`Invalid ${key}: '${value}' provided. Expected ${type}.`);
      }
    });
  };
  