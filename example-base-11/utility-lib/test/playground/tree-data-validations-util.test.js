import { isValidTreeData, TreeValidationErrorCodes } from '../../src/playground/tree-data-validations-util';

describe('isValidTreeData', () => {
    it('should return invalid error for non-array input', () => {
        const result = isValidTreeData({});
        expect(result).toEqual(TreeValidationErrorCodes.INVALID_INPUT);
    });

    it('should return invalid error for missing required fields', () => {
        const nodes = [
            { name: "Node 1", parentId: "1" }, // Missing uniqueId
            { name: "Node 2", parentId: "1", uniqueId: "2" }
        ];
        const result = isValidTreeData(nodes);
        expect(result).toEqual(TreeValidationErrorCodes.MISSING_FIELDS);
    });

    it('should return invalid error for duplicate uniqueIds', () => {
        const nodes = [
            { name: "Node 1", parentId: "1", uniqueId: "1" },
            { name: "Node 2", parentId: "1", uniqueId: "1" } // Duplicate uniqueId
        ];
        const result = isValidTreeData(nodes);
        expect(result).toEqual(TreeValidationErrorCodes.DUPLICATE_UNIQUE_ID);
    });

    it('should return invalid error for cyclic dependencies', () => {
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
            ...TreeValidationErrorCodes.CYCLIC_DEPENDENCY,
            uniqueId: "1"
        });
    });

    it('should return valid for correct tree data', () => {
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
        expect(result).toEqual(TreeValidationErrorCodes.VALID_TREE);
    });

    it('should return valid for correct flat tree data', () => {
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
        expect(result).toEqual(TreeValidationErrorCodes.VALID_TREE);
    });
});
