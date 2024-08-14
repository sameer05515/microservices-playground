import { isValidTreeData } from '../../src/playground/tree-data-validations-util';

describe('isValidTreeData', () => {

    test('should return false if input is not an array', () => {
        const result = isValidTreeData({});
        expect(result).toEqual({
            isValid: false,
            message: "Input should be an array of objects."
        });
    });

    test('should return false if a node does not have required fields', () => {
        const nodes = [
            { name: "Node 1", parentId: null }
        ];
        const result = isValidTreeData(nodes);
        expect(result).toEqual({
            isValid: false,
            message: "Each object must have 'name', 'parentId', and 'uniqueId' fields."
        });
    });

    test('should return false if there are duplicate uniqueIds', () => {
        const nodes = [
            { name: "Node 1", parentId: null, uniqueId: "1" },
            { name: "Node 2", parentId: "1", uniqueId: "1" }
        ];
        const result = isValidTreeData(nodes);
        expect(result).toEqual({
            isValid: false,
            message: "Duplicate uniqueId found: 1"
        });
    });

    test('should return false if there is a cyclic dependency', () => {
        const nodes = [
            { name: "Node 1", parentId: "3", uniqueId: "1", children: [
                { name: "Node 2", parentId: "1", uniqueId: "2", children: [
                    { name: "Node 3", parentId: "2", uniqueId: "3", children: [
                        { name: "Node 1", parentId: "3", uniqueId: "1" }
                    ] }
                ] }
            ] }
        ];
        const result = isValidTreeData(nodes);
        expect(result).toEqual({
            isValid: false,
            message: "Cyclic dependency detected."
        });
    });

    test('should return true for valid tree data', () => {
        const nodes = [
            { name: "Node 1", parentId: null, uniqueId: "1", children: [
                { name: "Node 2", parentId: "1", uniqueId: "2", children: [
                    { name: "Node 3", parentId: "2", uniqueId: "3" }
                ] }
            ] }
        ];
        const result = isValidTreeData(nodes);
        expect(result).toEqual({
            isValid: true,
            message: "Tree data is valid."
        });
    });

    test('should return true for valid flat tree data', () => {
        const nodes = [
            { name: "Node 1", parentId: null, uniqueId: "1" },
            { name: "Node 2", parentId: "1", uniqueId: "2" },
            { name: "Node 3", parentId: "2", uniqueId: "3" }
        ];
        const result = isValidTreeData(nodes);
        expect(result).toEqual({
            isValid: true,
            message: "Tree data is valid."
        });
    });

});
