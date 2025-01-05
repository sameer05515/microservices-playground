const ErrorCodes= require('./error-codes');

function parseLines(text) {
    
    if (!text || typeof text !== 'string') {
        return {
            isValid: false,
            errorCode: ErrorCodes.EMPTY_INPUT.code,
            message: ErrorCodes.EMPTY_INPUT.message,
            data: []
        };
    }
    const lines = text.split('\n').map(line => line.trimRight()).filter(line => line.length > 0);

    // if (lines.length === 0) {
    //     return {
    //         isValid: false,
    //         errorCode: ErrorCodes.EMPTY_INPUT.code,
    //         message: ErrorCodes.EMPTY_INPUT.message,
    //         data: []
    //     };
    // }

    const indentationLevel = (line) => line.search(/\S/);
    const firstIndentation = indentationLevel(lines[0]);

    for (let i = 1; i < lines.length; i++) {
        if (indentationLevel(lines[i]) < firstIndentation) {
            return {
                isValid: false,
                errorCode: ErrorCodes.INVALID_INDENTATION.code,
                message: ErrorCodes.INVALID_INDENTATION.message,
                data: []
            };
        }
    }

    return {
        isValid: true,
        errorCode: ErrorCodes.SUCCESS.code,
        message: ErrorCodes.SUCCESS.message,
        data: lines
    };
}

module.exports= parseLines;