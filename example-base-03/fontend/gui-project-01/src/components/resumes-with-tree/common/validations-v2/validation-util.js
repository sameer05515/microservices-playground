// src\components\resumes-with-tree\common\validations-v2\validation-util.js
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
const isNull = (value) => value === null;
const isObject = (value) => typeof value === "object" && !isUndefined(value) && value !== null;
const isString = (value) => typeof value === "string" && !isUndefined(value);
const isNumber = (value) => typeof value === "number" && !isUndefined(value);
const isArray = (value) => Array.isArray(value);
const hasChildrenInArray = (value) => isArray(value) && value.every(item => isObject(item) && isArray(item.children) && item.children.length > 0);
const isArrayOfStrings = (array) => isArray(array) && array.every(isString);
const containsErrorMessages = (messages) =>
    isArray(messages) && messages.some((msg) => msg.type === ValidationMessageType.ERROR);

const validateFields = (obj, fieldDefs, messages = [], parentField = "") => {
    if (isNull(obj) || isUndefined(obj)) {
        messages.push({
            type: ValidationMessageType.ERROR,
            message: `${parentField || 'Provided object'} is null or undefined`,
        });
        return;
    }
    return fieldDefs.reduce((acc, { field, type, isRequired, customValidation, children }) => {
        const value = obj[field];
        const fieldName = parentField ? `${parentField}.${field}` : field;

        const typeValidation = {
            string: isString,
            number: isNumber,
            object: isObject,
            array: isArray,
        }[type];

        // Required field check
        if (isRequired && isUndefined(value)) {
            acc.push({
                type: ValidationMessageType.ERROR,
                message: `Missing required field: ${fieldName}`,
            });
        }
        // Type validation
        else if (typeValidation && !typeValidation(value)) {
            acc.push({
                type: ValidationMessageType.ERROR,
                message: `Field '${fieldName}' should be a ${type}.`,
            });
        }
        // Custom validation
        else if (customValidation) {
            const { passed, customValidationMessage } = customValidation(value);
            if (!passed) {
                acc.push({
                    type: ValidationMessageType.ERROR,
                    message: `Field '${fieldName}' ${customValidationMessage || "failed custom validation."}`,
                });
            }
        }

        // Children validation
        if (!containsErrorMessages(acc) && isObject(value) && children && children.length > 0) {
            acc.push(...validateFields(value, children, [], fieldName));
        }

        return acc;
    }, messages);
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
    containsErrorMessages,
};
