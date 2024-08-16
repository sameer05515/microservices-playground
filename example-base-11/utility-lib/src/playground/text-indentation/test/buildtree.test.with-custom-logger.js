const { getHierarchyString } = require("../../util/custom-logger");

const ex1 = require("../exampleArrayForTesting");

const buildTree = require("../buildTree");

// [ex1[7]].map((textInput, index) => {
//     console.log(`\n=========== Index of SAMPLE: '${index}' ====================`, '\n');
//     console.log(`Input: '${textInput.input}'`);
//     console.log('============================================');
//     const result = buildTree(textInput.input);

//     console.log(`Test No: ${index}, Expected: ${ex1[index].expectedResult}, Actual: ${result.isValid}, Message: ${result.message}`);
//     // if(result?.data && result.data.length > 0){
//     //     console.log("++++++++++++++++++++++\n", result.data[0], "\n++++++++++++++++++++++\n")
//     // }
//     console.log('============================================');
//     console.log(`Input: '${textInput.input}'`);
//     console.log('============================================');
//     result.isValid ?
//         console.log(`Result: \n`, getHierarchyString(result.data) || 'Empty string') :
//         console.log(`Message: \n`, result.message || 'Empty message');

//     console.log(`=================== Processed SAMPLE Index : '${index}' with Result: Expected: ${ex1[index].expectedResult}, Actual: ${result.isValid} =========================\n\n`);

// });

let mismatches = [];

ex1
    .map((textInput, index) => {
        console.log(
            `\n=========== Starting Processing for SAMPLE Index: '${index}' ====================`,
            "\n"
        );
        const result = buildTree(textInput.input);

        console.log(
            `Test No: ${index}, Expected: ${textInput.expectedResult}, Actual: ${result.isValid}, Message: ${result.message}`
        );
        // if (result?.data && result.data.length > 0) {
        //     console.log("++++++++++++++++++++++\n", result.data[0], "\n++++++++++++++++++++++\n");
        // }
        console.log("============================================");
        console.log(`Input: '${textInput.input}'`);
        console.log("============================================");
        result.isValid
            ? console.log(
                `Result: \n`,
                getHierarchyString(result.data) || "Empty string"
            )
            : console.log(`Message: \n`, result.message || "Empty message");

        console.log(
            `=================== Processed SAMPLE Index : '${index}' with Result: Expected: ${textInput.expectedResult}, Actual: ${result.isValid} =========================\n\n`
        );
        return {
            expected: textInput.expectedResult,
            actual: result.isValid,
            sampleIndex: index,
        };
    })
    .reduce((acc, { expected, actual, sampleIndex }) => {
        if (expected !== actual) {
            acc.push(sampleIndex);
        }
        return acc;
    }, mismatches);

mismatches.length === 0
    ? console.log("All sample index test cases match the expectation.")
    : console.log(
        `Below sample id test cases do not match the expectation. Please review and correct the logic: ${mismatches.join(
            ", "
        )}`
    );
