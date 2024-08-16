// const { startOperation, stepOperation, endOperation } = require("../../util/custom-logger");

const ex1 = require('../exampleArrayForTesting');

const buildTree = require('../buildTree');
[ex1[0]].map((textInput, index)=>{
    // console.log(`\n=========== Index of SAMPLE: ${index}====================`, '\n');
    const result = buildTree(textInput.input);
    
    console.log(`test no: ${index}, Expected: ${ex1[index].expectedResult}, Actual: ${result.isValid}, Message: ${result.message}`);
    console.log(`Input: '${ex1[index].input}', \n ====================, \n result: ${JSON.stringify(result.data)}`)

})