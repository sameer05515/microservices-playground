// tree-data-validations-util.js
const ErrorTypes = {
    NON_RECOVERABLE: "non-recoverable",
    RECOVERABLE: "recoverable"
};

/**
 * Error codes enum with their properties.
 */
const TreeValidationMessageCodes = {
    INVALID_INPUT: {
        isValid: false,
        errorType: ErrorTypes.NON_RECOVERABLE,
        message: "Input should be an array of objects.",
        code: "INVALID_INPUT"
    },
    MISSING_FIELDS: {
        isValid: false,
        errorType: ErrorTypes.NON_RECOVERABLE,
        message: "Each object must have 'name', 'parentId', and 'uniqueId' fields.",
        code: "MISSING_FIELDS"
    },
    CYCLIC_DEPENDENCY: {
        isValid: false,
        errorType: ErrorTypes.NON_RECOVERABLE,
        message: "Cyclic dependency detected.",
        code: "CYCLIC_DEPENDENCY"
    },
    DUPLICATE_UNIQUE_ID: {
        isValid: false,
        errorType: ErrorTypes.RECOVERABLE,
        message: "Duplicate uniqueId found.",
        code: "DUPLICATE_UNIQUE_ID"
    },
    VALID_TREE: {
        isValid: true,
        errorType: ErrorTypes.RECOVERABLE,
        message: "Tree data is valid.",
        code: "VALID_TREE"
    }
};

/**
 * Checks if a node has children.
 * @param {Object} node - The node to check.
 * @returns {boolean} - True if the node has children, false otherwise.
 */
const hasChildren = (node) => node.children && node.children.length > 0;

/**
 * Validates the tree data against multiple conditions.
 * @param {Array} nodes - The nodes to validate.
 * @returns {Object} - An object containing `isValid` (boolean), `errorType` (string), `code` (string), and `uniqueId` (string, optional).
 */
const isValidTreeData = (nodes = []) => {
    if (!Array.isArray(nodes) || !nodes.every(node => typeof node === 'object' && node !== null)) {
        return { ...TreeValidationMessageCodes.INVALID_INPUT };
    }

    const seenIds = new Set();
    const checkNode = (node, visited = new Set()) => {
        if (!node.name || !node.parentId || !node.uniqueId) {
            return { ...TreeValidationMessageCodes.MISSING_FIELDS };
        }
        if (visited.has(node.uniqueId)) {
            return {
                ...TreeValidationMessageCodes.CYCLIC_DEPENDENCY,
                uniqueId: node.uniqueId
            };
        }
        if (seenIds.has(node.uniqueId)) {
            return { ...TreeValidationMessageCodes.DUPLICATE_UNIQUE_ID };
        }
        seenIds.add(node.uniqueId);
        visited.add(node.uniqueId);
        if (hasChildren(node)) {
            for (const child of node.children) {
                const result = checkNode(child, new Set(visited));
                if (!result.isValid) {
                    return result;
                }
            }
        }
        return { ...TreeValidationMessageCodes.VALID_TREE };
    };

    for (const node of nodes) {
        const result = checkNode(node);
        if (!result.isValid) {
            return result;
        }
    }

    return { ...TreeValidationMessageCodes.VALID_TREE };
};

export { isValidTreeData, TreeValidationMessageCodes, ErrorTypes };
