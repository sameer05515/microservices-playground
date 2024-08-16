const fillParentIds= require('./fillParentIds');


// Example Usage
const data = [
    { name: "Root", indentLevel: 12, uniqueId: "LINE_ID_1723810507981_677_1", lineNo: 1, level: 0, children: [] },
    { name: "Child 1", indentLevel: 13, uniqueId: "LINE_ID_1723810507981_279_2", lineNo: 2, level: 1, children: [] },
    { name: "Grandchild 1", indentLevel: 14, uniqueId: "LINE_ID_1723810507981_488_3", lineNo: 3, level: 2, children: [] },
    { name: "Grandchild 2", indentLevel: 15, uniqueId: "LINE_ID_1723810507981_757_4", lineNo: 4, level: 3, children: [] },
    { name: "Child 2", indentLevel: 13, uniqueId: "LINE_ID_1723810507981_958_5", lineNo: 5, level: 1, children: [] },
    { name: "Grandchild 3", indentLevel: 14, uniqueId: "LINE_ID_1723810507981_339_6", lineNo: 6, level: 2, children: [] }
];

const data2 = [
    { name: "Root", indentLevel: 12, uniqueId: "LINE_ID_1723810950721_848_1", lineNo: 1, level: 0, children: [] },
    { name: "Child 1", indentLevel: 13, uniqueId: "LINE_ID_1723810950721_907_2", lineNo: 2, level: 1, children: [] },
    { name: "Grandchild 1", indentLevel: 14, uniqueId: "LINE_ID_1723810950721_454_3", lineNo: 3, level: 2, children: [] },
    { name: "Great Grandchild 1", indentLevel: 15, uniqueId: "LINE_ID_1723810950721_883_4", lineNo: 4, level: 3, children: [] },
    { name: "Grandchild 2", indentLevel: 14, uniqueId: "LINE_ID_1723810950721_316_5", lineNo: 5, level: 2, children: [] },
    { name: "Child 2", indentLevel: 13, uniqueId: "LINE_ID_1723810950721_366_6", lineNo: 6, level: 1, children: [] },
    { name: "Grandchild 3", indentLevel: 14, uniqueId: "LINE_ID_1723810950721_195_7", lineNo: 7, level: 2, children: [] }
];

const data3 = [
    { name: "Root", indentLevel: 12, uniqueId: "LINE_ID_1723811371389_194_1", lineNo: 1, level: 0, children: [] },
    { name: "Child 1", indentLevel: 13, uniqueId: "LINE_ID_1723811371389_644_2", lineNo: 2, level: 1, children: [] },
    { name: "Grandchild 1", indentLevel: 14, uniqueId: "LINE_ID_1723811371389_245_3", lineNo: 3, level: 2, children: [] },
    { name: "Great Grandchild 1", indentLevel: 15, uniqueId: "LINE_ID_1723811371389_213_4", lineNo: 4, level: 3, children: [] },
    { name: "Great Great Grandchild 1", indentLevel: 17, uniqueId: "LINE_ID_1723811371389_522_5", lineNo: 5, level: 5, children: [] },
    { name: "Grandchild 2", indentLevel: 14, uniqueId: "LINE_ID_1723811371389_836_6", lineNo: 6, level: 2, children: [] },
    { name: "Child 2", indentLevel: 13, uniqueId: "LINE_ID_1723811371389_216_7", lineNo: 7, level: 1, children: [] },
    { name: "Grandchild 3", indentLevel: 14, uniqueId: "LINE_ID_1723811371389_158_8", lineNo: 8, level: 2, children: [] }
];

const useCaseDataArr = [
    { name: "data", input: data },
    { name: "data2", input: data2 },
    { name: "data3", input: data3 },
];

useCaseDataArr.forEach(({ name, input }) => {
    console.log(
        `\n=================\n input for: ${name.toUpperCase()} \n\n`,
        fillParentIds(input)
    );
});
