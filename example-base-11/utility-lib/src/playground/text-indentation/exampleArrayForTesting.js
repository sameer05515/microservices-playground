const exampleIndentedStringArrayForTesting = [
    // Valid scenarios
    {
        input: `
            Root
             Child 1
              Grandchild 1
               Grandchild 2
             Child 2
              Grandchild 3
        `,
        expectedResult: true,
    },
    {
        input: `
            Root
             Child 1
              Grandchild 1
              Grandchild 2
               Super Grandchild 1
             Child 2
              Grandchild 3
        `,
        expectedResult: true,
    },
    {
        input: `
            Root
        `,
        expectedResult: true,
    },
  
    // Invalid scenarios
    {
        input: `
            Root
             Child 1
              Grandchild 1
               Grandchild 2
                Grandchild 3
        `,
        expectedResult: false, // Indentation inconsistently increases
    },
    {
        input: `
            Root
             Child 1
              Grandchild 1
             Child 2
              Grandchild 2
        `,
        expectedResult: false, // Inconsistent indentation levels
    },
    {
        input: `
            Root
             Child 1
              Grandchild 1
               Grandchild 2
        `,
        expectedResult: false, // Not enough indentation levels to be valid
    },
    {
        input: `
            Radha
            Shyam
        `,
        expectedResult: false, // No indentation, should be a flat structure but not valid
    },
    {
        input: `
            Root
             Child 1
              Grandchild 1
               Grandchild 2
              Grandchild 3
        `,
        expectedResult: false, // Same indentation level for siblings
    },
    {
        input: `
            Root
             Child 1
              Grandchild 1
               Grandchild 2
               Grandchild 3
        `,
        expectedResult: false, // Same indentation level for siblings
    },
    {
        input: "",
        expectedResult: false, // Empty input
    },
    {
        input: null,
        expectedResult: false, // Null input
    },
    {
        input: {},
        expectedResult: false, // Non-string input
    },
];

module.exports = exampleIndentedStringArrayForTesting;
