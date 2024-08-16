const {
  startOperation,
  stepOperation,
  endOperation,
} = require("../util/custom-logger");
const validate = require("./validate");
const parseLines = require("./parse-lines");

function buildTree(text) {
  startOperation({
    title: "Inside Method: [buildTree] buildTree: Start with data: ",
    data: text,
  }, true);
  const parsed = parseLines(text);
  stepOperation({
    title: "Inside Method: [buildTree]: Result post method: parseLines: ",
    data: { parsed },
  });

  if (!parsed.isValid) {
    stepOperation({
      title: "Inside Method: [buildTree]: Result for checking 'parsed.isValid' is 'falsy' : ",
      data: {
        data: parsed.data,
        isValid: false,
        errorCode: parsed.errorCode,
        message: parsed.message,
      },
    });
    return {
      data: parsed.data,
      isValid: false,
      errorCode: parsed.errorCode,
      message: parsed.message,
    };
  }

  stepOperation({
    title: "Inside Method: [buildTree]: Result for checking 'parsed.isValid' is 'truthy' : Will start validate method with parsedData : ",
    data: { parsedData:parsed.data },
  });

  const dataAfterValidation= validate(parsed.data);
  stepOperation({
    title: "Inside Method: [buildTree]: Data recieved from 'validate' method ",
    data: { dataAfterValidation },
  });

  endOperation({ title: "Inside Method: [buildTree]: Method End with data: ", data: dataAfterValidation });
  return dataAfterValidation;
}

// Example Usage:
const textInput = `
    Node 1
        Node 1.1
        Node 1.2
            Node 1.2.1
    Node 2
`;

// const result = buildTree(textInput);
// console.log(result);

module.exports = buildTree;
