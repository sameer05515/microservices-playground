
const getChildren= require('./getChildren')

const useCases = [
    {
        input: {
            uniqueId: '1',
            data: [
                { uniqueId: '1', name: 'Parent', relations: [{ id: 'r1', name: 'father of', hasId: '1', withId: '2' }] },
                { uniqueId: '2', name: 'Child1', relations: [{ id: 'r2', name: 'father of', hasId: '2', withId: '3' }] },
                { uniqueId: '3', name: 'Grandchild', relations: [] },
            ],
        },
        expectedResult: [
            { uniqueId: '2', name: 'Child1', relations: [{ id: 'r2', name: 'father of', hasId: '2', withId: '3' }] },
            { uniqueId: '3', name: 'Grandchild', relations: [] },
        ],
        expectation: 'Should return both Child1 and Grandchild for Parent with uniqueId 1.'
    },
    {
        input: {
            uniqueId: '2',
            data: [
                { uniqueId: '1', name: 'Parent', relations: [{ id: 'r1', name: 'father of', hasId: '1', withId: '2' }] },
                { uniqueId: '2', name: 'Child1', relations: [{ id: 'r2', name: 'father of', hasId: '2', withId: '3' }] },
                { uniqueId: '3', name: 'Grandchild', relations: [] },
            ],
        },
        expectedResult: [
            { uniqueId: '3', name: 'Grandchild', relations: [] },
        ],
        expectation: 'Should return only Grandchild for Child1 with uniqueId 2.'
    },
    {
        input: {
            uniqueId: '3',
            data: [
                { uniqueId: '1', name: 'Parent', relations: [{ id: 'r1', name: 'father of', hasId: '1', withId: '2' }] },
                { uniqueId: '2', name: 'Child1', relations: [{ id: 'r2', name: 'father of', hasId: '2', withId: '3' }] },
                { uniqueId: '3', name: 'Grandchild', relations: [] },
            ],
        },
        expectedResult: [],
        expectation: 'Should return an empty array for Grandchild with uniqueId 3 as it has no children.'
    },
    {
        input: {
            uniqueId: '1',
            data: [
                { uniqueId: '1', name: 'Parent', relations: [{ id: 'r1', name: 'father of', hasId: '1', withId: '2' }] },
                { uniqueId: '2', name: 'Child1', relations: [{ id: 'r3', name: 'father of', hasId: '2', withId: '4' }] },
                { uniqueId: '3', name: 'Child2', relations: [{ id: 'r2', name: 'father of', hasId: '1', withId: '3' }] },
                { uniqueId: '4', name: 'Grandchild2', relations: [] },
            ],
        },
        expectedResult: [
            { uniqueId: '2', name: 'Child1', relations: [{ id: 'r3', name: 'father of', hasId: '2', withId: '4' }] },
            { uniqueId: '3', name: 'Child2', relations: [{ id: 'r2', name: 'father of', hasId: '1', withId: '3' }] },
            { uniqueId: '4', name: 'Grandchild2', relations: [] },
        ],
        expectation: 'Should return Child1, Child2, and Grandchild2 for Parent with uniqueId 1.'
    },
    {
        input: {
            uniqueId: '4',
            data: [
                { uniqueId: '1', name: 'Parent', relations: [{ id: 'r1', name: 'father of', hasId: '1', withId: '2' }] },
                { uniqueId: '2', name: 'Child1', relations: [{ id: 'r3', name: 'father of', hasId: '2', withId: '4' }] },
                { uniqueId: '3', name: 'Child2', relations: [{ id: 'r2', name: 'father of', hasId: '1', withId: '3' }] },
                { uniqueId: '4', name: 'Grandchild2', relations: [] },
            ],
        },
        expectedResult: [],
        expectation: 'Should return an empty array for Grandchild2 with uniqueId 4 as it has no children.'
    }
];

let mismatches = [];
// Example usage of test cases
useCases.map((testCase, index) => {
    const result = getChildren(testCase.input.data, testCase.input.uniqueId);
    const actualResult= JSON.stringify(result) === JSON.stringify(testCase.expectedResult);
    console.log(`Test Case ${index + 1}: ${testCase.expectation}: ${actualResult ? 'Passed' : 'Failed'}`);
    return {
        result: actualResult,
        expectation: testCase.expectation,
    };
}).reduce((acc, { result, expectation }) => {
    if (!result) {
        acc.push(expectation);
    }
    return acc;
}, mismatches);

mismatches.length === 0
? console.log("All test cases match the expectation.")
: console.log(
    `Below expectation of test cases do not match. Please review and correct the logic: ${mismatches.join(
        ",\n "
    )}`
);
