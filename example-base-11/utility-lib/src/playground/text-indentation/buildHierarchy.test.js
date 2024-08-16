const buildHierarchy= require('./buildHierarchy');

// Example usage
const data = [
    {
        name: "Root",
        indentLevel: 12,
        uniqueId: "LINE_ID_1723810507981_677_1",
        lineNo: 1,
        level: 0,
        children: [],
        parentId: ""
    },
    {
        name: "Child 1",
        indentLevel: 13,
        uniqueId: "LINE_ID_1723810507981_279_2",
        lineNo: 2,
        level: 1,
        children: [],
        parentId: "LINE_ID_1723810507981_677_1"
    },
    {
        name: "Grandchild 1",
        indentLevel: 14,
        uniqueId: "LINE_ID_1723810507981_488_3",
        lineNo: 3,
        level: 2,
        children: [],
        parentId: "LINE_ID_1723810507981_279_2"
    },
    {
        name: "Grandchild 2",
        indentLevel: 15,
        uniqueId: "LINE_ID_1723810507981_757_4",
        lineNo: 4,
        level: 3,
        children: [],
        parentId: "LINE_ID_1723810507981_488_3"
    },
    {
        name: "Child 2",
        indentLevel: 13,
        uniqueId: "LINE_ID_1723810507981_958_5",
        lineNo: 5,
        level: 1,
        children: [],
        parentId: "LINE_ID_1723810507981_677_1"
    },
    {
        name: "Grandchild 3",
        indentLevel: 14,
        uniqueId: "LINE_ID_1723810507981_339_6",
        lineNo: 6,
        level: 2,
        children: [],
        parentId: "LINE_ID_1723810507981_958_5"
    }
];

// Transform the data to build the hierarchy
const transformedData = buildHierarchy(data);
console.log(JSON.stringify(transformedData, null, 2));