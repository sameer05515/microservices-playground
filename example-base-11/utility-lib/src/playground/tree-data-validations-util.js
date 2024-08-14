/**
 * Checks if a node has children.
 * @param {Object} node - The node to check.
 * @returns {boolean} - True if the node has children, false otherwise.
 */
const hasChildren = (node) => node.children && node.children.length > 0;

/**
 * Validates the tree data against multiple conditions.
 * @param {Array} nodes - The nodes to validate.
 * @returns {Object} - An object containing `isValid` (boolean) and `message` (string).
 */
const isValid = (nodes = []) => {
    if (!Array.isArray(nodes)) {
        return { isValid: false, message: "Input should be an array of objects." };
    }

    const seenIds = new Set();
    const checkNode = (node, visited = new Set()) => {
        if (!node.name || !node.parentId || !node.uniqueId) {
            return { isValid: false, message: "Each object must have 'name', 'parentId', and 'uniqueId' fields." };
        }
        if (visited.has(node.uniqueId)) {
            return { isValid: false, message: "Cyclic dependency detected." };
        }
        if (seenIds.has(node.uniqueId)) {
            return { isValid: false, message: `Duplicate uniqueId found: ${node.uniqueId}` };
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
        return { isValid: true, message: "Tree data is valid." };
    };

    for (const node of nodes) {
        const result = checkNode(node);
        if (!result.isValid) {
            return result;
        }
    }

    return { isValid: true, message: "Tree data is valid." };
};

export {isValid as isValidTreeData};