const {
    // startOperation,
    stepOperation,
    // endOperation,
} = require("../util/custom-logger");

const validateStringArray = require("./validateStringArray");

const ErrorCodes = require("./error-codes");

// Function to determine the indentation level of a line
const getIndentationLevel = (line) => line.search(/\S/);

// Function to check if all indentation levels are equal
const areAllLevelsEqual = (levels) => {
    const uniqueLevels = Array.from(new Set(levels));
    return uniqueLevels.length === 1;
};

// Function to calculate the difference between consecutive indentation levels
const calculateDifferences = (levels) => {
    const differences = [];
    for (let i = 1; i < levels.length; i++) {
        differences.push(levels[i] - levels[i - 1]);
    }
    return differences;
};

// Function to check if differences are consistent
const areDifferencesConsistent = (differences) => {
    const firstDifference = differences[0];
    return differences.every(
        (diff) => diff === firstDifference || diff % firstDifference === 0
    );
};

// Function to build the hierarchical tree from lines
const buildTreeFromLines = (lines, firstIndentation, firstDifference) => {
    stepOperation({
        title:
            `4.6.1.1 Inside Method: [validate]: Starting building tree in 'buildTreeFromLines' method`,
        data: {
            lines,
            firstIndentation,
            firstDifference
        },
    });
    const result = [];
    const stack = [{ name: lines[0].trim(), level: 0, children: [] }];
    result.push(stack[0]);

    for (let i = 1; i < lines.length; i++) {
        const level =
            (getIndentationLevel(lines[i]) - firstIndentation) / firstDifference;
        const node = { name: lines[i].trim(), level, children: [] };

        while (stack.length > 0 && stack[stack.length - 1].level >= level) {
            stack.pop();
        }

        if (stack.length > 0) {
            stack[stack.length - 1].children.push(node);
        }

        stack.push(node);
        result.push(node);
    }

    stepOperation({
        title:
            `4.6.1.1 Inside Method: [validate]: Final result for building tree in 'buildTreeFromLines' method`,
        data: {
            lines,
            firstIndentation,
            firstDifference,
            createdStack: result
        },
    });

    return result;
};

// Main validation function
const validate = (rawLineArray) => {
    stepOperation({
        title:
            "4.1 Inside Method: [validate]: Data recieved for 'validate' method : Will start validating first.",
        data: {
            rawLineArray,
            validationResult: {
                condition: `typeof rawLineArray !== 'string'`,
                result: typeof rawLineArray !== "string",
                actualTypeOfInput: `${typeof rawLineArray}`,
                isInputAnArray: Array.isArray(rawLineArray),
            },
        },
    });
    const validateStringArrayResult = validateStringArray(rawLineArray);
    if (!validateStringArrayResult.isValid) {
        return {
            isValid: false,
            errorCode:
                validateStringArrayResult.errorCode || ErrorCodes.INVALID_INPUT.code,
            message:
                validateStringArrayResult.message || ErrorCodes.INVALID_INPUT.message,
            data: [],
        };
    }

    stepOperation({
        title: `4.2 Inside Method: [validate]: Successfully validated: 
        1. "rawLineArray" is an array and contains only string values.
        
        Now starting process to create an array of strings, having trimmed from right and create a new lines array`,
        data: { rawLineArray },
    });

    const lines = rawLineArray
        .map((line) => line.trimRight())
        .filter((line) => line.length > 0);

    stepOperation({
        title:
            "4.3. Inside Method: [validate]: Successfully created 'lines' array ",
        data: {
            lines,
            isLengthOfLinesrrayZero: lines.length === 0,
            isLengthOfLinesrrayOne: lines.length === 1,
        },
    });

    if (lines.length === 0) {
        return {
            isValid: false,
            errorCode: ErrorCodes.EMPTY_INPUT.code,
            message: ErrorCodes.EMPTY_INPUT.message,
            data: [],
        };
    }

    if (lines.length === 1) {
        return {
            isValid: true,
            errorCode: ErrorCodes.SUCCESS.code,
            message: ErrorCodes.SUCCESS.message,
            data: [{ name: lines[0].trim(), level: 0, children: [] }],
        };
    }



    const firstIndentation = getIndentationLevel(lines[0]);
    const levels = lines.map((line) => getIndentationLevel(line));

    stepOperation({
        title:
            `4.4. Inside Method: [validate]: Successfully validated 'lines' array length is greater than 1 `,
        data: {
            lines,
            firstIndentation,
            levelsArrayCreatedFromLinesArray: levels,
        },
    });


    const resultForAreAllLevelsEqualMethod = areAllLevelsEqual(levels);
    stepOperation({
        title:
            `4.5. Inside Method: [validate]: Validation result for 'areAllLevelsEqual' Method 
            
            If true, this should return Success response with an array of objects with their level as '0' value `,
        data: {
            levels,
            resultForAreAllLevelsEqualMethod
        },
    });

    if (resultForAreAllLevelsEqualMethod) {
        return {
            isValid: true,
            errorCode: ErrorCodes.SUCCESS.code,
            message: ErrorCodes.SUCCESS.message,
            data: lines.map((line) => ({
                name: line.trim(),
                level: 0,
                children: [],
            })),
        };
    }    

    const differences = calculateDifferences(levels);
    stepOperation({
        title:
            `4.6. Inside Method: [validate]: Result for 'calculateDifferences' Method`,
        data: {
            differences
        },
    });
    if (!areDifferencesConsistent(differences)) {
        stepOperation({
            title:
                `4.6.1 Inside Method: [validate]: Returning error response as result for 'areDifferencesConsistent' Method is false`,
            data: {
                differences
            },
        });
        return {
            isValid: false,
            errorCode: ErrorCodes.INCONSISTENT_INDENTATION.code,
            message: ErrorCodes.INCONSISTENT_INDENTATION.message,
            data: [],
        };
    }

    // Validate indentation
    const firstDifference = differences[0];
    stepOperation({
        title:
            `4.6. Inside Method: [validate]: Since all differences are consistent, hence calculated result for 'firstDifference'`,
        data: {
            firstDifference
        },
    });
    if (firstDifference <= 0) {
        return {
            isValid: false,
            errorCode: ErrorCodes.INVALID_INDENTATION.code,
            message: ErrorCodes.INVALID_INDENTATION.message,
            data: [],
        };
    }

    stepOperation({
        title:
            `4.6.1 Inside Method: [validate]: Starting building tree with 'buildTreeFromLines' method`,
        data: {
            lines,
            firstIndentation,
            firstDifference
        },
    });

    const result = buildTreeFromLines(lines, firstIndentation, firstDifference);
    stepOperation({
        title:
            `4.7. Inside Method: [validate]: Final result calculated`,
        data: {
            result
        },
    });

    return {
        isValid: true,
        errorCode: ErrorCodes.SUCCESS.code,
        message: ErrorCodes.SUCCESS.message,
        data: result,
    };
};

module.exports = validate;
