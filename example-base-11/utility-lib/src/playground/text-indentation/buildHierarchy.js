function buildHierarchy(nodes) {
    // Ensure all nodes have a children property
    nodes.forEach(node => node.children = []);

    // Create a map to quickly access nodes by their uniqueId
    const nodeMap = new Map();
    nodes.forEach(node => nodeMap.set(node.uniqueId, node));
    
    // Initialize an array to hold the root nodes (nodes with no parentId)
    const rootNodes = [];

    // Iterate over the nodes to build the hierarchy
    nodes.forEach(node => {
        // If node has a parentId, add it to the parent's children array
        if (node.parentId) {
            const parent = nodeMap.get(node.parentId);
            if (parent) {
                parent.children = parent.children || [];
                parent.children.push(node);
            }
        } else {
            // If node has no parentId, it is a root node
            rootNodes.push(node);
        }
    });

    return rootNodes;
}

module.exports = buildHierarchy;
