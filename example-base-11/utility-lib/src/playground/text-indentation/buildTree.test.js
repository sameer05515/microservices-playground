const ex1 = require('./exampleArrayForTesting');
const buildTree = require('./buildTree');
ex1.map((textInput, index)=>{
    const result = buildTree(textInput.input);
    console.log('\n===============================', '\n');
    console.log(`test no: ${index}, Expected: ${ex1[index].expectedResult}, Actual: ${result.isValid}, Message: ${result.message}`);
    console.log(`Input: '${ex1[index].input}', \n ====================, \n result: ${JSON.stringify(result.data)}`)

})