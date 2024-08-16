const {generateUniqueString} = require('./generateUniqueString');

// Example usage:
const uniqueString1 = generateUniqueString(null, 1);
const uniqueString2 = generateUniqueString('MY_PREFIX');
console.log(uniqueString1); // Output: DEFAULT_ID_PREFIX_<timestamp>_<random>_1
console.log(uniqueString2); // Output: MY_PREFIX_<timestamp>_<random>


const testCases = [
    {
        input: [null, 1],
        expectedResult: /^DEFAULT_ID_PREFIX_\d{13}_\d{3}_1$/
    },
    {
        input: ['MY_PREFIX', 5],
        expectedResult: /^MY_PREFIX_\d{13}_\d{3}_5$/
    },
    {
        input: ['CUSTOM_PREFIX'],
        expectedResult: /^CUSTOM_PREFIX_\d{13}_\d{3}$/
    },
    {
        input: [null, null],
        expectedResult: /^DEFAULT_ID_PREFIX_\d{13}_\d{3}$/
    },
    {
        input: ['TEST'],
        expectedResult: /^TEST_\d{13}_\d{3}$/
    }
];


function runTests() {
    testCases.forEach(({ input, expectedResult }, index) => {
        const result = generateUniqueString(...input);
        const passed = expectedResult.test(result);
        console.log(`Test Case ${index + 1}: ${passed ? 'Passed' : 'Failed'} - Result: ${result}`);
    });
}

runTests();