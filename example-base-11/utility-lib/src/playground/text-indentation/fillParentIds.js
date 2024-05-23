function fillParentIds(nodes) {
    const stack = [];
    const nodeMap = new Map();

    // Initialize nodes with parentId
    nodes.forEach(node => nodeMap.set(node.uniqueId, node));

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Maintain stack based on the level
        while (stack.length && stack[stack.length - 1].level >= node.level) {
            stack.pop();
        }

        // Assign parentId based on the stack
        node.parentId = stack.length ? stack[stack.length - 1].uniqueId : '';

        // Push the current node onto the stack
        stack.push(node);
    }

    return nodes;
}


module.exports= fillParentIds;