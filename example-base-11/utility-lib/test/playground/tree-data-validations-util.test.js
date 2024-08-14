import { isValidTreeData, TreeValidationErrorCodes } from '../../src/playground/tree-data-validations-util';

// describe('isValidTreeData', () => {
//     it('should return false if there are duplicate uniqueIds', () => {
//         const nodes = [
//             { name: 'Node 1', uniqueId: '1', parentId: '0' },
//             { name: 'Node 2', uniqueId: '1', parentId: '0' }, // duplicate uniqueId
//         ];
//         const result = isValidTreeData(nodes);
//         expect(result).toEqual({
//             isValid: false,
//             message: "Duplicate uniqueId found: 1",
//         });
//     });

//     it('should return true for valid tree data', () => {
//         const nodes = [
//             { name: 'Node 1', uniqueId: '1', parentId: '0', children: [] },
//             { name: 'Node 2', uniqueId: '2', parentId: '1', children: [] },
//         ];
//         const result = isValidTreeData(nodes);
//         expect(result).toEqual({
//             isValid: true,
//             message: "Tree data is valid.",
//         });
//     });

//     it('should return true for valid flat tree data', () => {
//         const nodes = [
//             { name: 'Node 1', uniqueId: '1', parentId: '0' },
//             { name: 'Node 2', uniqueId: '2', parentId: '0' },
//         ];
//         const result = isValidTreeData(nodes);
//         expect(result).toEqual({
//             isValid: true,
//             message: "Tree data is valid.",
//         });
//     });

//     it('should return false for missing name, parentId, or uniqueId', () => {
//         const nodes = [
//             { uniqueId: '1', parentId: '0' }, // Missing name
//             { name: 'Node 2', parentId: '0' }, // Missing uniqueId
//         ];
//         const result = isValidTreeData(nodes);
//         expect(result).toEqual({
//             isValid: false,
//             message: "Each object must have 'name', 'parentId', and 'uniqueId' fields.",
//         });
//     });

//     it('should return false for cyclic dependencies', () => {
//         const nodes = [
//             {
//                 name: 'Node 1',
//                 uniqueId: '1',
//                 parentId: '0',
//                 children: [
//                     { name: 'Node 2', uniqueId: '2', parentId: '1', children: [{ name: 'Node 1', uniqueId: '1', parentId: '2' }] },
//                 ],
//             },
//         ];
//         const result = isValidTreeData(nodes);
//         expect(result).toEqual({
//             isValid: false,
//             message: "Cyclic dependency detected.",
//         });
//     });
// });


// import { isValidTreeData, TreeValidationErrorCodes } from './tree-data-validations-util';

describe('isValidTreeData', () => {
    it('should return false if input is not an array', () => {
        const result = isValidTreeData({});
        expect(result).toEqual({
            isValid: false,
            ...TreeValidationErrorCodes.INVALID_INPUT
        });
    });

    it('should return false if any object is missing required fields', () => {
        const nodes = [
            { name: "Node 1", parentId: "1" }, // Missing uniqueId
            { name: "Node 2", parentId: "1", uniqueId: "2" }
        ];
        const result = isValidTreeData(nodes);
        expect(result).toEqual({
            isValid: false,
            ...TreeValidationErrorCodes.MISSING_FIELDS
        });
    });

    it('should return false if there are duplicate uniqueIds', () => {
        const nodes = [
            { name: "Node 1", parentId: "1", uniqueId: "1" },
            { name: "Node 2", parentId: "1", uniqueId: "1" } // Duplicate uniqueId
        ];
        const result = isValidTreeData(nodes);
        expect(result).toEqual({
            isValid: false,
            ...TreeValidationErrorCodes.DUPLICATE_UNIQUE_ID
        });
    });

    it('should return false if there are cyclic dependencies', () => {
        const nodes = [
            {
                name: "Node 1",
                parentId: "0",
                uniqueId: "1",
                children: [
                    {
                        name: "Node 2",
                        parentId: "1",
                        uniqueId: "2",
                        children: [
                            {
                                name: "Node 1", // This creates a cycle back to Node 1
                                parentId: "2",
                                uniqueId: "1"
                            }
                        ]
                    }
                ]
            }
        ];
        const result = isValidTreeData(nodes);
        expect(result).toEqual({
            isValid: false,
            ...TreeValidationErrorCodes.CYCLIC_DEPENDENCY,
            uniqueId: "1"
        });
    });

    it('should return true for valid tree data', () => {
        const nodes = [
            {
                name: "Node 1",
                parentId: "0",
                uniqueId: "1",
                children: [
                    {
                        name: "Node 2",
                        parentId: "1",
                        uniqueId: "2"
                    }
                ]
            }
        ];
        const result = isValidTreeData(nodes);
        expect(result).toEqual({
            isValid: true,
            ...TreeValidationErrorCodes.VALID_TREE
        });
    });

    it('should return true for valid flat tree data', () => {
        const nodes = [
            {
                name: "Node 1",
                parentId: "0",
                uniqueId: "1"
            },
            {
                name: "Node 2",
                parentId: "0",
                uniqueId: "2"
            }
        ];
        const result = isValidTreeData(nodes);
        expect(result).toEqual({
            isValid: true,
            ...TreeValidationErrorCodes.VALID_TREE
        });
    });
});
