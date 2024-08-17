

// Sample data structure
// const objects = [
//     { uniqueId: '1', name: 'Object1', relations: [{ id: 'r1', name: 'father of', hasId: '1', withId: '2' }] },
//     { uniqueId: '2', name: 'Object2', relations: [{ id: 'r2', name: 'father of', hasId: '2', withId: '3' }] },
//     { uniqueId: '3', name: 'Object3', relations: [] },
//     // Additional objects...
// ];

/**
 * Function to get all children for a given uniqueId
 * @param {Array} data - Array of objects with uniqueId, name, and relations.
 * @param {string} uniqueId - The uniqueId of the object to find children for.
 * @returns {Array} - Array of child objects.
 */
function getChildren(data, uniqueId) {
    const children = [];

    data.forEach(obj => {
        obj.relations.forEach(relation => {
            if (relation.name === 'father of' && relation.hasId === uniqueId) {
                const child = data.find(o => o.uniqueId === relation.withId);
                if (child) {
                    children.push(child);
                }
            }
        });
    });

    // Recursively find children's children
    const grandChildren = children.flatMap(child => getChildren(data, child.uniqueId));
    children.push(...grandChildren);

    return children;
}



// Example usage
// const uniqueIdToFind = '1';
// const children = getChildren(objects, uniqueIdToFind);

// console.log('Children:', children);

module.exports= getChildren;
