const ItemType = {
    RESUME: "resume",
    COMPANY: "company",
    PROJECT: "project",
};

const ValidationMessageType = {
    OK: "ok",
    WARNING: "warning",
    ERROR: "error",
};

// Utility functions for general type checks
const isUndefined = (value) => value === undefined;
const isObject = (value) => typeof value === "object" && !isUndefined(value);
const isString = (value) => typeof value === "string" && !isUndefined(value);
const isArray = (value) => Array.isArray(value);
const isArrayOfStrings = (array) => isArray(array) && array.every(isString);
const conatinsErrorMessages = (messages) =>
    messages.some((msg) => msg.type === ValidationMessageType.ERROR);

const validateFields = (obj, fieldDefs, messages, parentField = "") => {
    fieldDefs.forEach(
        ({ field, type, isRequired, nestedValidation, customValidation }) => {
            const value = obj[field];
            const fieldName = parentField ? `${parentField}.${field}` : field;

            // Required field check
            if (isRequired && isUndefined(value)) {
                messages.push({
                    type: ValidationMessageType.ERROR,
                    message: `Missing required field: ${fieldName}`,
                });
                return;
            }

            // Type validation
            const typeValidation = {
                string: isString,
                object: isObject,
                array: isArray,
            }[type];
            if (typeValidation && !typeValidation(value)) {
                messages.push({
                    type: ValidationMessageType.ERROR,
                    message: `Field '${fieldName}' should be a ${type}.`,
                });
            }

            // Custom validation
            if (customValidation) {
                const { passed, customValidationMessage } = customValidation(value);
                if (!passed) {
                    messages.push({
                        type: ValidationMessageType.ERROR,
                        message: `Field '${fieldName}' ${customValidationMessage || "failed custom validation."
                            }`,
                    });
                }
            }

            // Nested validation
            if (nestedValidation && isObject(value)) {
                nestedValidation(value, messages, fieldName);
            }
        }
    );
};

export {
    ItemType,
    validateFields,
    ValidationMessageType,
    isUndefined,
    isObject,
    isString,
    isArray,
    isArrayOfStrings,
    conatinsErrorMessages,
};
