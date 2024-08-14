// tree-data-validations-util.test.js
import { isValidTreeData, TreeValidationMessageCodes, ErrorTypes } from '../../src/playground/tree-data-validations-util';

describe('isValidTreeData', () => {
    it('should return invalid error for non-array input', () => {
        const result = isValidTreeData({});
        expect(result).toEqual(TreeValidationMessageCodes.INVALID_INPUT);
    });

    it('should return invalid error for null input', () => {
        const result = isValidTreeData(null);
        expect(result).toEqual(TreeValidationMessageCodes.INVALID_INPUT);
    });

    it('should return invalid error for string input', () => {
        const result = isValidTreeData("some random string");
        expect(result).toEqual(TreeValidationMessageCodes.INVALID_INPUT);
    });

    it('should return invalid error for number input', () => {
        const result = isValidTreeData(1);
        expect(result).toEqual(TreeValidationMessageCodes.INVALID_INPUT);
    });

    it('should return invalid error for array of string input', () => {
        const result = isValidTreeData(["some random string", "some random string2"]);
        expect(result).toEqual(TreeValidationMessageCodes.INVALID_INPUT);
    });

    it('should return invalid error for array of number input', () => {
        const result = isValidTreeData([1, 2]);
        expect(result).toEqual(TreeValidationMessageCodes.INVALID_INPUT);
    });

    it('should return invalid error for missing required fields', () => {
        const nodes = [
            { name: "Node 1", parentId: "1" }, // Missing uniqueId
            { name: "Node 2", parentId: "1", uniqueId: "2" }
        ];
        const result = isValidTreeData(nodes);
        expect(result).toEqual(TreeValidationMessageCodes.MISSING_FIELDS);
    });

    it('should return invalid error for duplicate uniqueIds', () => {
        const nodes = [
            { name: "Node 1", parentId: "1", uniqueId: "1" },
            { name: "Node 2", parentId: "1", uniqueId: "1" } // Duplicate uniqueId
        ];
        const result = isValidTreeData(nodes);
        expect(result).toEqual(TreeValidationMessageCodes.DUPLICATE_UNIQUE_ID);
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
            ...TreeValidationMessageCodes.CYCLIC_DEPENDENCY,
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
        expect(result).toEqual(TreeValidationMessageCodes.VALID_TREE);
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
        expect(result).toEqual(TreeValidationMessageCodes.VALID_TREE);
    });
});
