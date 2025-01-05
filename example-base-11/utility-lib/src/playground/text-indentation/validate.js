const { stepOperation } = require("../util/custom-logger");
const validateStringArray = require("./validateStringArray");
const ErrorCodes = require("./error-codes");
const { generateUniqueString } = require("../util/generateUniqueString");
const fillParentIds = require("./fillParentIds");
const buildHierarchy = require("./buildHierarchy");

// Function to determine the indentation level of a line
const getIndentationLevel = (line) => line.search(/\S/);

// Function to check if all indentation levels are equal
const areAllLevelsEqual = (levels) => new Set(levels).size === 1;

// Function to calculate the differences between consecutive indentation levels
const calculateDifferences = (levels) => levels.slice(1).map((level, i) => level - levels[i]);

// Function to check if differences are consistent
const areDifferencesConsistent = (differences) => {
    const firstDifference = differences[0];
    return differences.every((diff) => diff === firstDifference || diff % firstDifference === 0);
};

// Function to compute the level based on indentation
const computeLevel = (indentLevel, firstIndentation, firstDifference) =>
    (indentLevel - firstIndentation) / firstDifference;

// Function to build the hierarchical tree from lines
const buildTreeFromLines = (lines, firstIndentation, firstDifference) => {
    stepOperation({
        title: "4.6.1.1 Inside Method: [validate]: Starting building tree in 'buildTreeFromLines' method",
        data: { lines, firstIndentation, firstDifference },
    });

    const linesWithLevelAndChildren = lines.map((line, index) => ({
        ...line,
        lineNo: index + 1,
        level: computeLevel(line.indentLevel, firstIndentation, firstDifference),
        children: [],
    }));

    stepOperation({
        title: "4.6.1.1.a Inside Method: [validate]: Computed and appended level and children to each line node",
        data: linesWithLevelAndChildren.map(({ name, uniqueId, lineNo, level }) => ({
            name,
            uniqueId,
            lineNo,
            level,
        })),
    });

    const filledParentIdsArray = fillParentIds(linesWithLevelAndChildren);

    stepOperation({
        title: "4.6.1.1.b Inside Method: [validate]: Filled ParentId for each line node",
        data: { filledParentIdsArray },
    }, false);

    const transformedData = buildHierarchy(filledParentIdsArray);

    stepOperation({
        title: "4.6.1.1.c Inside Method: [validate]: Transformed data into tree structure",
        data: { transformedData },
    }, false);

    return [...transformedData];
};

// Main validation function
const validate = (rawLineArray) => {
    stepOperation({
        title: "4.1 Inside Method: [validate]: Starting validation",
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

    const validationResult = validateStringArray(rawLineArray);
    if (!validationResult.isValid) {
        return {
            isValid: false,
            errorCode: validationResult.errorCode || ErrorCodes.INVALID_INPUT.code,
            message: validationResult.message || ErrorCodes.INVALID_INPUT.message,
            data: [],
        };
    }

    stepOperation({
        title: "4.2 Inside Method: [validate]: Array validation succeeded",
        data: { rawLineArray },
    });

    const lines = rawLineArray
        .map((line, index) => ({
            name: line.trim(),
            indentLevel: getIndentationLevel(line),
            uniqueId: generateUniqueString("LINE_ID", index + 1),
        }))
        .filter((line) => line.name.length > 0);

    stepOperation({
        title: "4.3 Inside Method: [validate]: Lines array created",
        data: {
            lines,
            isLengthOfLinesArrayZero: lines.length === 0,
            isLengthOfLinesArrayOne: lines.length === 1,
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
            data: [{ name: lines[0].name.trim(), level: 0, children: [] }],
        };
    }

    const firstIndentation = lines[0].indentLevel;
    const levels = lines.map(({ indentLevel }) => indentLevel);

    stepOperation({
        title: "4.4 Inside Method: [validate]: Levels array created",
        data: { lines, firstIndentation, levelsArray: levels },
    });

    if (areAllLevelsEqual(levels)) {
        return {
            isValid: true,
            errorCode: ErrorCodes.SUCCESS.code,
            message: ErrorCodes.SUCCESS.message,
            data: lines.map((line) => ({
                name: line.name.trim(),
                level: 0,
                children: [],
            })),
        };
    }

    const differences = calculateDifferences(levels);

    stepOperation({
        title: "4.6 Inside Method: [validate]: Differences calculated",
        data: { differences },
    });

    if (!areDifferencesConsistent(differences)) {
        stepOperation({
            title: "4.6.1 Inside Method: [validate]: Differences are inconsistent",
            data: { differences },
        });
        return {
            isValid: false,
            errorCode: ErrorCodes.INCONSISTENT_INDENTATION.code,
            message: ErrorCodes.INCONSISTENT_INDENTATION.message,
            data: [],
        };
    }

    const firstDifference = differences[0];
    if (firstDifference <= 0) {
        return {
            isValid: false,
            errorCode: ErrorCodes.INVALID_INDENTATION.code,
            message: ErrorCodes.INVALID_INDENTATION.message,
            data: [],
        };
    }

    stepOperation({
        title: "4.6.2 Inside Method: [validate]: Building tree with valid data",
        data: { lines, firstIndentation, firstDifference },
    });

    const result = buildTreeFromLines(lines, firstIndentation, firstDifference);

    stepOperation(
        {
            title: "4.7 Inside Method: [validate]: Final result calculated",
            data: { result },
        },
        false
    );

    return {
        isValid: true,
        errorCode: ErrorCodes.SUCCESS.code,
        message: ErrorCodes.SUCCESS.message,
        data: result,
    };
};

module.exports = validate;
