const ErrorCodes = require('./error-codes'); // Assuming ErrorCodes is defined in error-codes.js

function validateStringArray(inputArray) {
    if (!Array.isArray(inputArray)) {
        return {
            isValid: false,
            errorCode: ErrorCodes.INVALID_INPUT.code,
            message: ErrorCodes.INVALID_INPUT.message,
            data: [],
        };
    }

    if (inputArray.length < 0) { // Technically, this check is redundant because array length can't be less than 0
        return {
            isValid: false,
            errorCode: ErrorCodes.INVALID_INPUT.code,
            message: "Array length is less than 0.", // Custom message for this specific case
            data: [],
        };
    }

    const nonStringElement = inputArray.find(value => typeof value !== "string");
    if (nonStringElement !== undefined) {
        return {
            isValid: false,
            errorCode: ErrorCodes.INVALID_INPUT.code,
            message: `Invalid array element: '${nonStringElement}' is not a string.`,
            data: [],
        };
    }

    return {
        isValid: true,
        errorCode: ErrorCodes.SUCCESS.code,
        message: ErrorCodes.SUCCESS.message,
        data: inputArray,
    };
}

module.exports = validateStringArray;
