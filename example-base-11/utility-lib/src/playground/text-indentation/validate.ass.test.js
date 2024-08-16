const assert = require('assert');
const validate = require('./validate'); // Ensure the path is correct

const testCases = [
    // Valid scenarios
    // (Include the same valid scenarios as before)

    // Invalid scenarios
    {
        input: null,
        expected: {
            isValid: false,
            errorCode: 'INVALID_INPUT',
            message: 'Input is not a string.',
            data: []
        }
    },
    {
        input: {},
        expected: {
            isValid: false,
            errorCode: 'INVALID_INPUT',
            message: 'Input is not a string.',
            data: []
        }
    },
    {
        input: "",
        expected: {
            isValid: false,
            errorCode: 'EMPTY_INPUT',
            message: 'Input is empty.',
            data: []
        }
    },
    // (Include other invalid cases as before)
];

// Run tests
testCases.forEach(({ input, expected }, index) => {
    const result = validate(input);
    try {
        assert.deepStrictEqual(result, expected);
        console.log(`Test case ${index + 1} passed.`);
    } catch (error) {
        console.error(`Test case ${index + 1} failed: ${error.message}`);
    }
});
