const exampleIndentedStringArrayForTesting = [
    // Valid scenarios
    {
        input: `
            Root
             Child 1
              Grandchild 1
              

              
               Great Grandchild 1
                 Great Great Grandchild 1
              Grandchild 2
             Child 2
              Grandchild 3
        `,
        expectedResult: true,
        id:1
    },
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
        id:2
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
        id:3
    },
    {
        input: `
            Root
        `,
        expectedResult: true,
        id:4
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
        expectedResult: true, // Indentation inconsistently increases
        id:5
    },
    {
        input: `
            Root
             Child 1
              Grandchild 1
             Child 2
              Grandchild 2
        `,
        expectedResult: true, // Inconsistent indentation levels
        id:6
    },
    {
        input: `
            Root
             Child 1
              Grandchild 1
               Grandchild 2
        `,
        expectedResult: true, // Not enough indentation levels to be valid
        id:7
    },
    {
        input: `
            Radha
            Shyam
        `,
        expectedResult: true, // No indentation, should be a flat structure but not valid
        id:8
    },
    {
        input: `
            Root
             Child 1
              Grandchild 1
               Grandchild 2
              Grandchild 3
        `,
        expectedResult: true, // Same indentation level for siblings
        id:9
    },
    {
        input: `
            Root
             Child 1
              Grandchild 1
               Grandchild 2
               Grandchild 3
        `,
        expectedResult: true, // Same indentation level for siblings
        id:10
    },
    {
        input: "",
        expectedResult: false, // Empty input
        id:11
    },
    {
        input: null,
        expectedResult: false, // Null input
        id:12
    },
    {
        input: {},
        expectedResult: false, // Non-string input
        id:13
    },
    {
        input:`
          Root
            Child 1
        Invalid Indentation
          Another root

        `,
        expectedResult: false, // Indentation of 3rd line is less than First node
        id:14
    },
    {
        input:`
          Root
            Child 1
          Valid Indentation
          Another root

        `,
        expectedResult: true, // Indentation of 2nd line is less than First node
        id:15
    }
];

module.exports = exampleIndentedStringArrayForTesting;
