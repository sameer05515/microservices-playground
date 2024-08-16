
const validate= require('./validate');
const parseLines= require('./parse-lines');

function buildTree(text) {
    const parsed = parseLines(text);

    if (!parsed.isValid) {
        return {
            data: parsed.data,
            isValid: false,
            errorCode: parsed.errorCode,
            message: parsed.message
        };
    }

    return validate(parsed.data);
}

// Example Usage:
const textInput = `
    Node 1
        Node 1.1
        Node 1.2
            Node 1.2.1
    Node 2
`;

const result = buildTree(textInput);
// console.log(result);


module.exports= buildTree;