const { generateUniqueString } = require('./generateUniqueString');

const testCases = [
    {
        input: [null, 1],
        expectedResult: /^DEFAULT_ID_PREFIX_\d{13}_\d{3}_1$/,
        expectation: "Should use the default prefix when prefix is null and append the index."
    },
    {
        input: ['MY_PREFIX', 5],
        expectedResult: /^MY_PREFIX_\d{13}_\d{3}_5$/,
        expectation: "Should use the given prefix and append the index."
    },
    {
        input: ['CUSTOM_PREFIX'],
        expectedResult: /^CUSTOM_PREFIX_\d{13}_\d{3}$/,
        expectation: "Should use the given prefix and omit the index if not provided."
    },
    {
        input: [null, null],
        expectedResult: /^DEFAULT_ID_PREFIX_\d{13}_\d{3}$/,
        expectation: "Should use the default prefix and omit the index when both are null."
    },
    {
        input: ['TEST'],
        expectedResult: /^TEST_\d{13}_\d{3}$/,
        expectation: "Should use the given prefix and omit the index."
    },
    {
        input: ['', 2],
        expectedResult: /^DEFAULT_ID_PREFIX_\d{13}_\d{3}_2$/,
        expectation: "Should use the default prefix when an empty string is provided as prefix."
    },
    {
        input: ['  ', 3],
        expectedResult: /^DEFAULT_ID_PREFIX_\d{13}_\d{3}_3$/,
        expectation: "Should use the default prefix when a whitespace string is provided as prefix."
    },
    {
        input: ['Special_Prefix', 42],
        expectedResult: /^Special_Prefix_\d{13}_\d{3}_42$/,
        expectation: "Should handle prefixes with special characters correctly."
    },
    {
        input: [undefined, 100],
        expectedResult: /^DEFAULT_ID_PREFIX_\d{13}_\d{3}_100$/,
        expectation: "Should use the default prefix when undefined is passed as the prefix."
    }
];

function runTests() {
    const resultArr=[];
    testCases.forEach(({ input, expectedResult, expectation }, index) => {
        const result = generateUniqueString(...input);
        const passed = expectedResult.test(result);
        console.log(`Test Case ${index + 1}: ${passed ? 'Passed' : 'Failed'} - ${expectation} - Result: ${result}`);
    });
}

runTests();
