import { isValidTreeData } from '../../src/playground/tree-data-validations-util';

describe('isValidTreeData', () => {
    it('should return false if there are duplicate uniqueIds', () => {
        const nodes = [
            { name: 'Node 1', uniqueId: '1', parentId: '0' },
            { name: 'Node 2', uniqueId: '1', parentId: '0' }, // duplicate uniqueId
        ];
        const result = isValidTreeData(nodes);
        expect(result).toEqual({
            isValid: false,
            message: "Duplicate uniqueId found: 1",
        });
    });

    it('should return true for valid tree data', () => {
        const nodes = [
            { name: 'Node 1', uniqueId: '1', parentId: '0', children: [] },
            { name: 'Node 2', uniqueId: '2', parentId: '1', children: [] },
        ];
        const result = isValidTreeData(nodes);
        expect(result).toEqual({
            isValid: true,
            message: "Tree data is valid.",
        });
    });

    it('should return true for valid flat tree data', () => {
        const nodes = [
            { name: 'Node 1', uniqueId: '1', parentId: '0' },
            { name: 'Node 2', uniqueId: '2', parentId: '0' },
        ];
        const result = isValidTreeData(nodes);
        expect(result).toEqual({
            isValid: true,
            message: "Tree data is valid.",
        });
    });

    it('should return false for missing name, parentId, or uniqueId', () => {
        const nodes = [
            { uniqueId: '1', parentId: '0' }, // Missing name
            { name: 'Node 2', parentId: '0' }, // Missing uniqueId
        ];
        const result = isValidTreeData(nodes);
        expect(result).toEqual({
            isValid: false,
            message: "Each object must have 'name', 'parentId', and 'uniqueId' fields.",
        });
    });

    it('should return false for cyclic dependencies', () => {
        const nodes = [
            {
                name: 'Node 1',
                uniqueId: '1',
                parentId: '0',
                children: [
                    { name: 'Node 2', uniqueId: '2', parentId: '1', children: [{ name: 'Node 1', uniqueId: '1', parentId: '2' }] },
                ],
            },
        ];
        const result = isValidTreeData(nodes);
        expect(result).toEqual({
            isValid: false,
            message: "Cyclic dependency detected.",
        });
    });
});
