const { getHierarchyString } = require("../../util/custom-logger");

const ex1 = require('../exampleArrayForTesting');

const buildTree = require('../buildTree');

// [ex1[0]].map((textInput, index)=>{
//     //console.log(`\n=========== Index of SAMPLE: '${index}' ====================`, '\n');
//     const result = buildTree(textInput.input);

    
//     console.log(`test no: ${index}, Expected: ${ex1[index].expectedResult}, Actual: ${result.isValid}, Message: ${result.message}`);
//     // if(result?.data && result.data.length>0){
//     //     console.log("++++++++++++++++++++++\n", result.data[0], "\n++++++++++++++++++++++\n")
//     // }
//     console.log('============================================');
//     console.log(`Input: '${ex1[index].input}'`);
//     console.log('============================================');
//     console.log(`Result: \n`,getHierarchyString(result.data))

// })

ex1.map((textInput, index)=>{
    console.log(`\n=========== Starting proceessing for SAMPLE Index : '${index}' ====================`, '\n');
    const result = buildTree(textInput.input);

    
    console.log(`test no: ${index}, Expected: ${ex1[index].expectedResult}, Actual: ${result.isValid}, Message: ${result.message}`);
    if(result?.data && result.data.length>0){
        console.log("++++++++++++++++++++++\n", result.data[0], "\n++++++++++++++++++++++\n")
    }
    console.log('============================================');
    console.log(`Input: '${ex1[index].input}'`);
    console.log('============================================');
    console.log(`Result: \n`,getHierarchyString(result.data));

    console.log(`=================== Index of SAMPLE: '${index}' Processed with result: Expected: ${ex1[index].expectedResult}, Actual: ${result.isValid} =========================\n\n`);

})