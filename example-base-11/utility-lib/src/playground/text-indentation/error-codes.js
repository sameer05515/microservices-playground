const ErrorCodes = {
    SUCCESS: {
        code: "SUCCESS",
        message: "Success"
    },
    EMPTY_INPUT: {
        code: "EMPTY_INPUT",
        message: "Input text is empty or contains no valid lines."
    },
    INVALID_INPUT: {
        code: 'INVALID_INPUT',
        message: 'Input is not a string.'
    },
    INVALID_INDENTATION: {
        code: 2,
        message: "Indentation is invalid; subsequent lines should have indentation greater than or equal to the first line."
    },
    INCONSISTENT_INDENTATION: {
        code: 3,
        message: "Indentation levels are inconsistent."
    }
};

module.exports= ErrorCodes;